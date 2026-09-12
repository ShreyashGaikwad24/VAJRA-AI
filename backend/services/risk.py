from sqlalchemy import select
from sqlalchemy.orm import Session

from models.equipment import Equipment
from models.sensor import Sensor


class RiskService:
    def calculate_risk(self, db: Session) -> dict:
        equipment = list(
            db.scalars(
                select(Equipment).where(
                    Equipment.status != "offline"
                )
            ).all()
        )

        sensors = list(
            db.scalars(
                select(Sensor).where(
                    Sensor.is_active.is_(True)
                )
            ).all()
        )

        contributors = []
        recommendations = []

        temperature_risk = self._sensor_risk(
            sensors,
            "temperature",
        )

        pressure_risk = self._sensor_risk(
            sensors,
            "pressure",
        )

        vibration_risk = self._sensor_risk(
            sensors,
            "vibration",
        )

        gas_risk = self._sensor_risk(
            sensors,
            "gas",
        )

        maintenance_risk = self._maintenance_risk(
            equipment
        )

        health_risk = self._health_risk(
            equipment
        )

        cri = self._weighted_average(
            [
                (temperature_risk, 0.30),
                (pressure_risk, 0.20),
                (vibration_risk, 0.15),
                (gas_risk, 0.25),
                (maintenance_risk, 0.10),
            ]
        )

        pri = self._weighted_average(
            [
                (cri, 0.60),
                (health_risk, 0.40),
            ]
        )

        eri = self._weighted_average(
            [
                (gas_risk, 0.45),
                (temperature_risk, 0.35),
                (vibration_risk, 0.20),
            ]
        )

        sri = self._weighted_average(
            [
                (maintenance_risk, 0.60),
                (health_risk, 0.40),
            ]
        )

        overall_risk = self._calculate_overall_risk(
            cri=cri,
            pri=pri,
            eri=eri,
            sri=sri,
        )

        contributors.extend(
            [
                self._contributor(
                    "Temperature",
                    temperature_risk,
                    "Elevated process temperature detected.",
                ),
                self._contributor(
                    "Pressure",
                    pressure_risk,
                    "Process pressure is approaching or exceeding its normal range.",
                ),
                self._contributor(
                    "Vibration",
                    vibration_risk,
                    "Equipment vibration indicates possible mechanical stress.",
                ),
                self._contributor(
                    "Gas",
                    gas_risk,
                    "Gas concentration indicates potential leak or exposure risk.",
                ),
                self._contributor(
                    "Maintenance",
                    maintenance_risk,
                    "Overdue maintenance increases operational risk.",
                ),
            ]
        )

        if temperature_risk >= 60:
            recommendations.append(
                {
                    "priority": "high",
                    "action": "Inspect and stabilize process temperature.",
                    "reason": "Temperature risk is elevated.",
                }
            )

        if pressure_risk >= 60:
            recommendations.append(
                {
                    "priority": "high",
                    "action": "Verify pressure control and relief protection.",
                    "reason": "Pressure risk is elevated.",
                }
            )

        if vibration_risk >= 60:
            recommendations.append(
                {
                    "priority": "medium",
                    "action": "Inspect affected rotating equipment.",
                    "reason": "Elevated vibration may indicate mechanical degradation.",
                }
            )

        if gas_risk >= 60:
            recommendations.append(
                {
                    "priority": "critical",
                    "action": "Investigate possible gas release and restrict nearby exposure.",
                    "reason": "Gas concentration exceeds the expected operating range.",
                }
            )

        if maintenance_risk >= 60:
            recommendations.append(
                {
                    "priority": "medium",
                    "action": "Schedule overdue maintenance intervention.",
                    "reason": "Maintenance backlog is contributing to risk.",
                }
            )

        if not recommendations:
            recommendations.append(
                {
                    "priority": "low",
                    "action": "Continue normal monitoring.",
                    "reason": "No major risk contributor currently exceeds the intervention threshold.",
                }
            )

        return {
            "cri": round(cri, 2),
            "pri": round(pri, 2),
            "eri": round(eri, 2),
            "sri": round(sri, 2),
            "overall_risk": round(overall_risk, 2),
            "risk_level": self._risk_level(overall_risk),
            "contributors": contributors,
            "recommendations": recommendations,
        }

    def _sensor_risk(
        self,
        sensors: list[Sensor],
        sensor_type: str,
    ) -> float:
        matching = [
            sensor
            for sensor in sensors
            if sensor.sensor_type == sensor_type
        ]

        if not matching:
            return 0.0

        risks = [
            self._single_sensor_risk(sensor)
            for sensor in matching
        ]

        return max(risks)

    def _single_sensor_risk(
        self,
        sensor: Sensor,
    ) -> float:
        value = sensor.current_value

        if value is None:
            return 0.0

        normal_min = sensor.normal_min
        normal_max = sensor.normal_max

        if normal_min is None or normal_max is None:
            return 0.0

        normal_range = normal_max - normal_min

        if normal_range <= 0:
            return 0.0

        if normal_min <= value <= normal_max:
            if value <= normal_min + normal_range * 0.8:
                return 20.0

            distance = value - (
                normal_min + normal_range * 0.8
            )

            return min(
                60.0,
                20.0 + (
                    distance
                    / (normal_range * 0.2)
                ) * 40.0,
            )

        if value > normal_max:
            excess = value - normal_max

            return min(
                100.0,
                60.0 + (
                    excess / normal_range
                ) * 40.0,
            )

        below_range = normal_min - value

        return min(
            100.0,
            60.0 + (
                below_range / normal_range
            ) * 40.0,
        )

    def _maintenance_risk(
        self,
        equipment: list[Equipment],
    ) -> float:
        if not equipment:
            return 0.0

        overdue = sum(
            1
            for item in equipment
            if item.maintenance_overdue
        )

        return min(
            100.0,
            (overdue / len(equipment)) * 100.0,
        )

    def _health_risk(
        self,
        equipment: list[Equipment],
    ) -> float:
        if not equipment:
            return 0.0

        average_health = sum(
            item.health_score
            for item in equipment
        ) / len(equipment)

        return max(
            0.0,
            min(
                100.0,
                100.0 - average_health,
            ),
        )

    def _weighted_average(
        self,
        values: list[tuple[float, float]],
    ) -> float:
        total_weight = sum(
            weight
            for _, weight in values
        )

        if total_weight == 0:
            return 0.0

        return sum(
            value * weight
            for value, weight in values
        ) / total_weight

    def _calculate_overall_risk(
        self,
        cri: float,
        pri: float,
        eri: float,
        sri: float,
    ) -> float:
        weighted_risk = self._weighted_average(
            [
                (cri, 0.40),
                (pri, 0.25),
                (eri, 0.20),
                (sri, 0.15),
            ]
        )

        highest_risk = max(
            cri,
            pri,
            eri,
            sri,
        )

        # Prevent severe safety conditions from
        # being diluted by lower-risk dimensions.
        if highest_risk >= 80:
            return max(
                weighted_risk,
                highest_risk * 0.90,
            )

        if highest_risk >= 60:
            return max(
                weighted_risk,
                highest_risk * 0.75,
            )

        return weighted_risk

    def _risk_level(
        self,
        risk: float,
    ) -> str:
        if risk >= 80:
            return "critical"

        if risk >= 60:
            return "high"

        if risk >= 35:
            return "medium"

        return "low"

    def _contributor(
        self,
        factor: str,
        score: float,
        explanation: str,
    ) -> dict:
        if score >= 80:
            severity = "critical"
        elif score >= 60:
            severity = "high"
        elif score >= 35:
            severity = "medium"
        else:
            severity = "low"

        return {
            "factor": factor,
            "score": round(score, 2),
            "severity": severity,
            "explanation": explanation,
        }


risk_service = RiskService()
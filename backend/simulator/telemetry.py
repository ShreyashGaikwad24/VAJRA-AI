import random
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from api.websocket import websocket_manager
from models.sensor import Sensor
from repositories.telemetry import TelemetryRepository
from services.realtime import serialize_telemetry


class TelemetrySimulator:
    def __init__(self, repository: TelemetryRepository):
        self.repository = repository
        self.random = random.Random(42)
        self.scenario = "normal"
        self.scenario_step = 0

    def set_scenario(self, scenario: str) -> None:
        allowed_scenarios = {
            "normal",
            "warning",
            "critical",
        }

        if scenario not in allowed_scenarios:
            raise ValueError(
                f"Unsupported scenario: {scenario}. "
                f"Allowed values: {sorted(allowed_scenarios)}"
            )

        self.scenario = scenario
        self.scenario_step = 0

    def _target_range(
        self,
        sensor: Sensor,
    ) -> tuple[float, float]:
        normal_min = sensor.normal_min
        normal_max = sensor.normal_max

        if normal_min is None or normal_max is None:
            current = sensor.current_value or 0.0

            if self.scenario == "normal":
                return current * 0.98, current * 1.02

            if self.scenario == "warning":
                return current * 1.05, current * 1.10

            return current * 1.10, current * 1.20

        normal_range = normal_max - normal_min

        if self.scenario == "normal":
            return normal_min, normal_max

        if self.scenario == "warning":
            return (
                normal_max - normal_range * 0.20,
                normal_max + normal_range * 0.15,
            )

        return (
            normal_max + normal_range * 0.10,
            normal_max + normal_range * 0.40,
        )

    def generate_value(
        self,
        sensor: Sensor,
    ) -> float:
        target_min, target_max = self._target_range(
            sensor
        )

        target_value = self.random.uniform(
            target_min,
            target_max,
        )

        current = sensor.current_value

        if current is None:
            value = target_value
        else:
            movement_factor = 0.25

            value = current + (
                target_value - current
            ) * movement_factor

            noise = max(
                abs(target_value) * 0.005,
                0.01,
            )

            value += self.random.uniform(
                -noise,
                noise,
            )

        return round(value, 3)

    def generate_reading(
        self,
        db: Session,
        sensor: Sensor,
    ):
        value = self.generate_value(sensor)
        timestamp = datetime.now(timezone.utc)

        quality = "good"

        if self.scenario == "warning":
            quality = "warning"
        elif self.scenario == "critical":
            quality = "critical"

        reading = self.repository.create(
            db=db,
            sensor_id=sensor.id,
            timestamp=timestamp,
            value=value,
            quality=quality,
        )

        sensor.current_value = value
        sensor.last_reading_at = timestamp

        return reading

    async def generate_all_readings(
        self,
        db: Session,
    ) -> list:
        sensors = list(
            db.scalars(
                select(Sensor).where(
                    Sensor.is_active.is_(True)
                )
            ).all()
        )

        readings = []

        try:
            for sensor in sensors:
                reading = self.generate_reading(
                    db=db,
                    sensor=sensor,
                )

                readings.append(reading)

            db.commit()

            for reading in readings:
                db.refresh(reading)

            self.scenario_step += 1

            if readings:
                await websocket_manager.broadcast(
                    serialize_telemetry(readings)
                )

            return readings

        except Exception:
            db.rollback()
            raise


telemetry_simulator = TelemetrySimulator(
    TelemetryRepository()
)
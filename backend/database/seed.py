from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.session import SessionLocal
from models.equipment import Equipment
from models.plant import Plant
from models.sensor import Sensor
from models.zone import Zone


PLANT = {
    "name": "Jamnagar Refinery",
    "code": "JAM-REF",
    "location": "Jamnagar, Gujarat, India",
    "description": "Industrial refinery safety intelligence and monitoring environment.",
}


ZONES = [
    {
        "code": "ZONE-A",
        "name": "Storage",
        "description": "Bulk storage tanks and cooling infrastructure.",
        "risk_level": "low",
    },
    {
        "code": "ZONE-B",
        "name": "Processing",
        "description": "Primary refinery processing and heat exchange area.",
        "risk_level": "medium",
    },
    {
        "code": "ZONE-C",
        "name": "Hot Work",
        "description": "High-temperature reactor and valve operations.",
        "risk_level": "critical",
    },
    {
        "code": "ZONE-D",
        "name": "Control",
        "description": "Control room, pumping and electrical infrastructure.",
        "risk_level": "low",
    },
    {
        "code": "ZONE-E",
        "name": "Loading",
        "description": "Loading, warehouse and material transfer operations.",
        "risk_level": "medium",
    },
]


EQUIPMENT = [
    {
        "code": "ST-201",
        "name": "Storage Tanks",
        "equipment_type": "Storage Tank",
        "zone_code": "ZONE-A",
        "status": "Healthy",
        "health_score": 95,
        "temperature": 37,
        "pressure": 4.1,
        "flow_rate": 56,
        "gas_level": 7,
        "humidity": 61,
        "vibration": 0.9,
        "workers_nearby": 6,
        "maintenance_overdue": False,
        "root_cause": None,
        "recommendation": "Continue routine monitoring.",
    },
    {
        "code": "CT-015",
        "name": "Cooling Towers",
        "equipment_type": "Cooling Tower",
        "zone_code": "ZONE-A",
        "status": "Warning",
        "health_score": 84,
        "temperature": 52,
        "pressure": 3.8,
        "flow_rate": 61,
        "gas_level": 5,
        "humidity": 70,
        "vibration": 1.8,
        "workers_nearby": 4,
        "maintenance_overdue": False,
        "root_cause": "Elevated operating temperature and vibration.",
        "recommendation": "Inspect cooling performance and vibration trend.",
    },
    {
        "code": "DT-110",
        "name": "Distillation Towers",
        "equipment_type": "Distillation Tower",
        "zone_code": "ZONE-B",
        "status": "Healthy",
        "health_score": 91,
        "temperature": 301,
        "pressure": 9.2,
        "flow_rate": 72,
        "gas_level": 11,
        "humidity": 39,
        "vibration": 1.2,
        "workers_nearby": 8,
        "maintenance_overdue": False,
        "root_cause": None,
        "recommendation": "Continue normal operation and monitoring.",
    },
    {
        "code": "R-101",
        "name": "Reactor Unit R-101",
        "equipment_type": "Reactor",
        "zone_code": "ZONE-C",
        "status": "Critical",
        "health_score": 92,
        "temperature": 421,
        "pressure": 17.2,
        "flow_rate": 82,
        "gas_level": 39,
        "humidity": 34,
        "vibration": 2.7,
        "workers_nearby": 12,
        "maintenance_overdue": False,
        "root_cause": "High reactor temperature, pressure and gas concentration.",
        "recommendation": "Immediately assess reactor operating conditions and reduce exposure.",
    },
    {
        "code": "HX-044",
        "name": "Heat Exchangers",
        "equipment_type": "Heat Exchanger",
        "zone_code": "ZONE-B",
        "status": "Warning",
        "health_score": 79,
        "temperature": 287,
        "pressure": 11.4,
        "flow_rate": 69,
        "gas_level": 13,
        "humidity": 37,
        "vibration": 2.1,
        "workers_nearby": 5,
        "maintenance_overdue": True,
        "root_cause": "Elevated vibration with overdue maintenance.",
        "recommendation": "Schedule inspection and maintenance before continued high-load operation.",
    },
    {
        "code": "PS-023",
        "name": "Pump Station P-204",
        "equipment_type": "Pump",
        "zone_code": "ZONE-D",
        "status": "Maintenance",
        "health_score": 71,
        "temperature": 88,
        "pressure": 6.4,
        "flow_rate": 53,
        "gas_level": 4,
        "humidity": 56,
        "vibration": 3.2,
        "workers_nearby": 3,
        "maintenance_overdue": True,
        "root_cause": "High vibration and overdue preventive maintenance.",
        "recommendation": "Inspect pump bearings and perform scheduled maintenance.",
    },
    {
        "code": "WH-090",
        "name": "Warehouse",
        "equipment_type": "Warehouse",
        "zone_code": "ZONE-E",
        "status": "Offline",
        "health_score": 62,
        "temperature": 42,
        "pressure": 1.9,
        "flow_rate": 0,
        "gas_level": 6,
        "humidity": 49,
        "vibration": 0.4,
        "workers_nearby": 2,
        "maintenance_overdue": False,
        "root_cause": "Equipment monitoring endpoint offline.",
        "recommendation": "Restore monitoring connectivity and verify equipment status.",
    },
    {
        "code": "LB-071",
        "name": "Loading Bay",
        "equipment_type": "Loading Bay",
        "zone_code": "ZONE-E",
        "status": "Warning",
        "health_score": 76,
        "temperature": 65,
        "pressure": 3.9,
        "flow_rate": 58,
        "gas_level": 18,
        "humidity": 51,
        "vibration": 1.6,
        "workers_nearby": 11,
        "maintenance_overdue": False,
        "root_cause": "Elevated gas concentration with high worker density.",
        "recommendation": "Increase gas monitoring and control personnel exposure.",
    },
    {
        "code": "CR-010",
        "name": "Control Room",
        "equipment_type": "Control System",
        "zone_code": "ZONE-D",
        "status": "Healthy",
        "health_score": 97,
        "temperature": 24,
        "pressure": 1.1,
        "flow_rate": 22,
        "gas_level": 1,
        "humidity": 41,
        "vibration": 0.2,
        "workers_nearby": 9,
        "maintenance_overdue": False,
        "root_cause": None,
        "recommendation": "Continue normal monitoring.",
    },
    {
        "code": "PJ-114",
        "name": "Pipeline Junction PL-27A",
        "equipment_type": "Pipeline Junction",
        "zone_code": "ZONE-B",
        "status": "Warning",
        "health_score": 81,
        "temperature": 103,
        "pressure": 8.9,
        "flow_rate": 74,
        "gas_level": 9,
        "humidity": 36,
        "vibration": 1.4,
        "workers_nearby": 3,
        "maintenance_overdue": False,
        "root_cause": "Elevated pipeline temperature under sustained flow.",
        "recommendation": "Inspect junction temperature and pressure trend.",
    },
    {
        "code": "VS-307",
        "name": "Valve Station",
        "equipment_type": "Valve Station",
        "zone_code": "ZONE-C",
        "status": "Critical",
        "health_score": 68,
        "temperature": 166,
        "pressure": 14.6,
        "flow_rate": 81,
        "gas_level": 22,
        "humidity": 33,
        "vibration": 2.4,
        "workers_nearby": 7,
        "maintenance_overdue": True,
        "root_cause": "Elevated temperature, gas concentration and overdue maintenance.",
        "recommendation": "Inspect valve integrity and isolate unsafe work if required.",
    },
    {
        "code": "SS-014",
        "name": "Substation",
        "equipment_type": "Electrical Substation",
        "zone_code": "ZONE-D",
        "status": "Healthy",
        "health_score": 93,
        "temperature": 41,
        "pressure": 1.3,
        "flow_rate": 32,
        "gas_level": 2,
        "humidity": 44,
        "vibration": 0.7,
        "workers_nearby": 2,
        "maintenance_overdue": False,
        "root_cause": None,
        "recommendation": "Continue normal electrical monitoring.",
    },
]


SENSORS = [
    {
        "code": "S-TEMP-R101",
        "name": "R-101 Temperature Sensor",
        "sensor_type": "temperature",
        "unit": "°C",
        "zone_code": "ZONE-C",
        "equipment_code": "R-101",
        "current_value": 421,
        "normal_min": 280,
        "normal_max": 380,
    },
    {
        "code": "S-PRES-R101",
        "name": "R-101 Pressure Sensor",
        "sensor_type": "pressure",
        "unit": "bar",
        "zone_code": "ZONE-C",
        "equipment_code": "R-101",
        "current_value": 17.2,
        "normal_min": 10,
        "normal_max": 15,
    },
    {
        "code": "S-GAS-PL27A",
        "name": "PL-27A Gas Sensor",
        "sensor_type": "gas",
        "unit": "% LEL",
        "zone_code": "ZONE-B",
        "equipment_code": "PJ-114",
        "current_value": 9,
        "normal_min": 0,
        "normal_max": 25,
    },
    {
        "code": "S-VIB-P204",
        "name": "P-204 Vibration Sensor",
        "sensor_type": "vibration",
        "unit": "mm/s",
        "zone_code": "ZONE-D",
        "equipment_code": "PS-023",
        "current_value": 3.2,
        "normal_min": 0,
        "normal_max": 2.5,
    },
    {
        "code": "S-HUM-LB",
        "name": "Loading Bay Humidity Sensor",
        "sensor_type": "humidity",
        "unit": "%",
        "zone_code": "ZONE-E",
        "equipment_code": "LB-071",
        "current_value": 51,
        "normal_min": 35,
        "normal_max": 55,
    },
    {
        "code": "S-FLOW-HX",
        "name": "HX-044 Flow Sensor",
        "sensor_type": "flow",
        "unit": "m³/h",
        "zone_code": "ZONE-B",
        "equipment_code": "HX-044",
        "current_value": 69,
        "normal_min": 50,
        "normal_max": 80,
    },
    {
        "code": "S-TEMP-ST",
        "name": "ST-201 Temperature Sensor",
        "sensor_type": "temperature",
        "unit": "°C",
        "zone_code": "ZONE-A",
        "equipment_code": "ST-201",
        "current_value": 37,
        "normal_min": 20,
        "normal_max": 45,
    },
    {
        "code": "S-GAS-VS",
        "name": "VS-307 Gas Sensor",
        "sensor_type": "gas",
        "unit": "% LEL",
        "zone_code": "ZONE-C",
        "equipment_code": "VS-307",
        "current_value": 22,
        "normal_min": 0,
        "normal_max": 20,
    },
]


def get_or_create_plant(db: Session) -> Plant:
    plant = db.scalar(
        select(Plant).where(Plant.code == PLANT["code"])
    )

    now = datetime.now(timezone.utc)

    if plant is None:
        plant = Plant(**PLANT)
        db.add(plant)
        db.flush()
    else:
        for key, value in PLANT.items():
            setattr(plant, key, value)
        plant.updated_at = now

    return plant


def seed_zones(db: Session, plant: Plant) -> dict[str, Zone]:
    zones: dict[str, Zone] = {}

    for data in ZONES:
        zone = db.scalar(
            select(Zone).where(
                Zone.plant_id == plant.id,
                Zone.code == data["code"],
            )
        )

        if zone is None:
            zone = Zone(
                plant_id=plant.id,
                **data,
            )
            db.add(zone)
            db.flush()
        else:
            for key, value in data.items():
                setattr(zone, key, value)

        zones[data["code"]] = zone

    return zones


def seed_equipment(
    db: Session,
    zones: dict[str, Zone],
) -> dict[str, Equipment]:
    equipment_map: dict[str, Equipment] = {}

    for data in EQUIPMENT:
        zone = zones[data["zone_code"]]

        equipment = db.scalar(
            select(Equipment).where(
                Equipment.zone_id == zone.id,
                Equipment.code == data["code"],
            )
        )

        values = {
            key: value
            for key, value in data.items()
            if key != "zone_code"
        }

        if equipment is None:
            equipment = Equipment(
                zone_id=zone.id,
                **values,
            )
            db.add(equipment)
            db.flush()
        else:
            equipment.zone_id = zone.id
            for key, value in values.items():
                setattr(equipment, key, value)

        equipment_map[data["code"]] = equipment

    return equipment_map


def seed_sensors(
    db: Session,
    zones: dict[str, Zone],
    equipment_map: dict[str, Equipment],
) -> dict[str, Sensor]:
    sensor_map: dict[str, Sensor] = {}

    for data in SENSORS:
        zone = zones[data["zone_code"]]
        equipment = equipment_map[data["equipment_code"]]

        values = {
            key: value
            for key, value in data.items()
            if key not in {"zone_code", "equipment_code"}
        }

        sensor = db.scalar(
            select(Sensor).where(
                Sensor.zone_id == zone.id,
                Sensor.code == data["code"],
            )
        )

        if sensor is None:
            sensor = Sensor(
                zone_id=zone.id,
                equipment_id=equipment.id,
                **values,
            )
            db.add(sensor)
            db.flush()
        else:
            sensor.zone_id = zone.id
            sensor.equipment_id = equipment.id

            for key, value in values.items():
                setattr(sensor, key, value)

        sensor_map[data["code"]] = sensor

    return sensor_map


def seed_database() -> None:
    db = SessionLocal()

    try:
        plant = get_or_create_plant(db)
        zones = seed_zones(db, plant)
        equipment_map = seed_equipment(db, zones)
        sensor_map = seed_sensors(db, zones, equipment_map)

        db.commit()

        print("SAFE-AI database seed completed.")
        print(f"Plant: {plant.code}")
        print(f"Zones: {len(zones)}")
        print(f"Equipment: {len(equipment_map)}")
        print(f"Sensors: {len(sensor_map)}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
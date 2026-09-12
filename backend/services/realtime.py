from datetime import datetime, timezone


def serialize_telemetry(readings: list) -> dict:
    return {
        "type": "telemetry_update",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "readings": [
            {
                "id": reading.id,
                "sensor_id": reading.sensor_id,
                "timestamp": reading.timestamp.isoformat(),
                "value": reading.value,
                "quality": reading.quality,
            }
            for reading in readings
        ],
    }


def serialize_risk(risk_data: dict) -> dict:
    return {
        "type": "risk_update",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "risk": risk_data,
    }
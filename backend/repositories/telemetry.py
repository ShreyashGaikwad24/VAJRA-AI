from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.telemetry import TelemetryReading


class TelemetryRepository:
    def create(
        self,
        db: Session,
        sensor_id: int,
        timestamp: datetime,
        value: float,
        quality: str = "good",
    ):
        reading = TelemetryReading(
            sensor_id=sensor_id,
            timestamp=timestamp,
            value=value,
            quality=quality,
        )

        db.add(reading)
        db.flush()

        return reading

    def get_by_sensor(
        self,
        db: Session,
        sensor_id: int,
        limit: int = 100,
    ):
        statement = (
            select(TelemetryReading)
            .where(
                TelemetryReading.sensor_id == sensor_id
            )
            .order_by(
                TelemetryReading.timestamp.desc()
            )
            .limit(limit)
        )

        return list(
            db.scalars(statement).all()
        )


telemetry_repository = TelemetryRepository()
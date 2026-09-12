from datetime import datetime

from sqlalchemy.orm import Session

from repositories.telemetry import TelemetryRepository


class TelemetryService:
    def __init__(self, repository: TelemetryRepository):
        self.repository = repository

    def create_reading(
        self,
        db: Session,
        sensor_id: int,
        timestamp: datetime,
        value: float,
        quality: str = "good",
    ):
        return self.repository.create(
            db=db,
            sensor_id=sensor_id,
            timestamp=timestamp,
            value=value,
            quality=quality,
        )

    def get_sensor_readings(
        self,
        db: Session,
        sensor_id: int,
        limit: int = 100,
    ):
        return self.repository.get_by_sensor(
            db=db,
            sensor_id=sensor_id,
            limit=limit,
        )


telemetry_service = TelemetryService(TelemetryRepository())
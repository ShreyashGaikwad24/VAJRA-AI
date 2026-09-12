from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repositories.sensor import SensorRepository
from schemas.sensor import SensorCreate, SensorUpdate


class SensorService:
    def __init__(self, db: Session):
        self.repository = SensorRepository(db)

    def get_all(
        self,
        zone_id: int | None = None,
        equipment_id: int | None = None,
    ):
        return self.repository.get_all(zone_id, equipment_id)

    def get_by_id(self, sensor_id: int):
        sensor = self.repository.get_by_id(sensor_id)

        if sensor is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sensor not found",
            )

        return sensor

    def create(self, data: SensorCreate):
        existing_sensor = self.repository.get_by_code(data.code)

        if existing_sensor is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Sensor code already exists",
            )

        return self.repository.create(data)

    def update(self, sensor_id: int, data: SensorUpdate):
        sensor = self.get_by_id(sensor_id)

        if data.code is not None and data.code != sensor.code:
            existing_sensor = self.repository.get_by_code(data.code)

            if existing_sensor is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Sensor code already exists",
                )

        return self.repository.update(sensor, data)

    def delete(self, sensor_id: int):
        sensor = self.get_by_id(sensor_id)
        self.repository.delete(sensor)
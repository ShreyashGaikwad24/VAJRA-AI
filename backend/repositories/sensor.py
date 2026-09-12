from sqlalchemy import select
from sqlalchemy.orm import Session

from models.sensor import Sensor
from schemas.sensor import SensorCreate, SensorUpdate


class SensorRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(
        self,
        zone_id: int | None = None,
        equipment_id: int | None = None,
    ) -> list[Sensor]:
        statement = select(Sensor).order_by(Sensor.id)

        if zone_id is not None:
            statement = statement.where(Sensor.zone_id == zone_id)

        if equipment_id is not None:
            statement = statement.where(Sensor.equipment_id == equipment_id)

        return list(self.db.scalars(statement).all())

    def get_by_id(self, sensor_id: int) -> Sensor | None:
        return self.db.get(Sensor, sensor_id)

    def get_by_code(self, code: str) -> Sensor | None:
        statement = select(Sensor).where(Sensor.code == code)
        return self.db.scalar(statement)

    def create(self, data: SensorCreate) -> Sensor:
        sensor = Sensor(**data.model_dump())

        self.db.add(sensor)
        self.db.commit()
        self.db.refresh(sensor)

        return sensor

    def update(
        self,
        sensor: Sensor,
        data: SensorUpdate,
    ) -> Sensor:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(sensor, field, value)

        self.db.commit()
        self.db.refresh(sensor)

        return sensor

    def delete(self, sensor: Sensor) -> None:
        self.db.delete(sensor)
        self.db.commit()
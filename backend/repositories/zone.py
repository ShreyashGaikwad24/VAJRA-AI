from sqlalchemy import select
from sqlalchemy.orm import Session

from models.zone import Zone
from schemas.zone import ZoneCreate, ZoneUpdate


class ZoneRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, plant_id: int | None = None) -> list[Zone]:
        statement = select(Zone).order_by(Zone.id)

        if plant_id is not None:
            statement = statement.where(Zone.plant_id == plant_id)

        return list(self.db.scalars(statement).all())

    def get_by_id(self, zone_id: int) -> Zone | None:
        return self.db.get(Zone, zone_id)

    def get_by_code(self, code: str) -> Zone | None:
        statement = select(Zone).where(Zone.code == code)
        return self.db.scalar(statement)

    def create(self, data: ZoneCreate) -> Zone:
        zone = Zone(**data.model_dump())

        self.db.add(zone)
        self.db.commit()
        self.db.refresh(zone)

        return zone

    def update(self, zone: Zone, data: ZoneUpdate) -> Zone:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(zone, field, value)

        self.db.commit()
        self.db.refresh(zone)

        return zone

    def delete(self, zone: Zone) -> None:
        self.db.delete(zone)
        self.db.commit()
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.plant import Plant
from schemas.plant import PlantCreate, PlantUpdate


class PlantRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Plant]:
        statement = select(Plant).order_by(Plant.id)
        return list(self.db.scalars(statement).all())

    def get_by_id(self, plant_id: int) -> Plant | None:
        return self.db.get(Plant, plant_id)

    def get_by_code(self, code: str) -> Plant | None:
        statement = select(Plant).where(Plant.code == code)
        return self.db.scalar(statement)

    def create(self, data: PlantCreate) -> Plant:
        plant = Plant(**data.model_dump())

        self.db.add(plant)
        self.db.commit()
        self.db.refresh(plant)

        return plant

    def update(self, plant: Plant, data: PlantUpdate) -> Plant:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(plant, field, value)

        self.db.commit()
        self.db.refresh(plant)

        return plant

    def delete(self, plant: Plant) -> None:
        self.db.delete(plant)
        self.db.commit()
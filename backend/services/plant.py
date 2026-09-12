from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repositories.plant import PlantRepository
from schemas.plant import PlantCreate, PlantUpdate


class PlantService:
    def __init__(self, db: Session):
        self.repository = PlantRepository(db)

    def get_all(self):
        return self.repository.get_all()

    def get_by_id(self, plant_id: int):
        plant = self.repository.get_by_id(plant_id)

        if plant is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant not found",
            )

        return plant

    def create(self, data: PlantCreate):
        existing_plant = self.repository.get_by_code(data.code)

        if existing_plant is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Plant code already exists",
            )

        return self.repository.create(data)

    def update(self, plant_id: int, data: PlantUpdate):
        plant = self.get_by_id(plant_id)

        if data.code is not None and data.code != plant.code:
            existing_plant = self.repository.get_by_code(data.code)

            if existing_plant is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Plant code already exists",
                )

        return self.repository.update(plant, data)

    def delete(self, plant_id: int):
        plant = self.get_by_id(plant_id)
        self.repository.delete(plant)
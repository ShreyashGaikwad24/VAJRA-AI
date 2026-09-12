from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repositories.equipment import EquipmentRepository
from schemas.equipment import EquipmentCreate, EquipmentUpdate


class EquipmentService:
    def __init__(self, db: Session):
        self.repository = EquipmentRepository(db)

    def get_all(self, zone_id: int | None = None):
        return self.repository.get_all(zone_id)

    def get_by_id(self, equipment_id: int):
        equipment = self.repository.get_by_id(equipment_id)

        if equipment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Equipment not found",
            )

        return equipment

    def create(self, data: EquipmentCreate):
        existing_equipment = self.repository.get_by_code(data.code)

        if existing_equipment is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Equipment code already exists",
            )

        return self.repository.create(data)

    def update(self, equipment_id: int, data: EquipmentUpdate):
        equipment = self.get_by_id(equipment_id)

        if data.code is not None and data.code != equipment.code:
            existing_equipment = self.repository.get_by_code(data.code)

            if existing_equipment is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Equipment code already exists",
                )

        return self.repository.update(equipment, data)

    def delete(self, equipment_id: int):
        equipment = self.get_by_id(equipment_id)
        self.repository.delete(equipment)
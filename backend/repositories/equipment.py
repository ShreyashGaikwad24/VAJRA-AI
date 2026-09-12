from sqlalchemy import select
from sqlalchemy.orm import Session

from models.equipment import Equipment
from schemas.equipment import EquipmentCreate, EquipmentUpdate


class EquipmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, zone_id: int | None = None) -> list[Equipment]:
        statement = select(Equipment).order_by(Equipment.id)

        if zone_id is not None:
            statement = statement.where(Equipment.zone_id == zone_id)

        return list(self.db.scalars(statement).all())

    def get_by_id(self, equipment_id: int) -> Equipment | None:
        return self.db.get(Equipment, equipment_id)

    def get_by_code(self, code: str) -> Equipment | None:
        statement = select(Equipment).where(Equipment.code == code)
        return self.db.scalar(statement)

    def create(self, data: EquipmentCreate) -> Equipment:
        equipment = Equipment(**data.model_dump())

        self.db.add(equipment)
        self.db.commit()
        self.db.refresh(equipment)

        return equipment

    def update(
        self,
        equipment: Equipment,
        data: EquipmentUpdate,
    ) -> Equipment:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(equipment, field, value)

        self.db.commit()
        self.db.refresh(equipment)

        return equipment

    def delete(self, equipment: Equipment) -> None:
        self.db.delete(equipment)
        self.db.commit()
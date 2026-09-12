from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database.session import get_db
from schemas.equipment import EquipmentCreate, EquipmentRead, EquipmentUpdate
from services.equipment import EquipmentService


router = APIRouter(
    prefix="/api/equipment",
    tags=["Equipment"],
)


@router.get(
    "",
    response_model=list[EquipmentRead],
)
def list_equipment(
    zone_id: int | None = None,
    db: Session = Depends(get_db),
):
    service = EquipmentService(db)
    return service.get_all(zone_id)


@router.get(
    "/{equipment_id}",
    response_model=EquipmentRead,
)
def get_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
):
    service = EquipmentService(db)
    return service.get_by_id(equipment_id)


@router.post(
    "",
    response_model=EquipmentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_equipment(
    data: EquipmentCreate,
    db: Session = Depends(get_db),
):
    service = EquipmentService(db)
    return service.create(data)


@router.patch(
    "/{equipment_id}",
    response_model=EquipmentRead,
)
def update_equipment(
    equipment_id: int,
    data: EquipmentUpdate,
    db: Session = Depends(get_db),
):
    service = EquipmentService(db)
    return service.update(equipment_id, data)


@router.delete(
    "/{equipment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
):
    service = EquipmentService(db)
    service.delete(equipment_id)
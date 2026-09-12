from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database.session import get_db
from schemas.zone import ZoneCreate, ZoneRead, ZoneUpdate
from services.zone import ZoneService


router = APIRouter(
    prefix="/api/zones",
    tags=["Zones"],
)


@router.get(
    "",
    response_model=list[ZoneRead],
)
def list_zones(
    plant_id: int | None = None,
    db: Session = Depends(get_db),
):
    service = ZoneService(db)
    return service.get_all(plant_id)


@router.get(
    "/{zone_id}",
    response_model=ZoneRead,
)
def get_zone(
    zone_id: int,
    db: Session = Depends(get_db),
):
    service = ZoneService(db)
    return service.get_by_id(zone_id)


@router.post(
    "",
    response_model=ZoneRead,
    status_code=status.HTTP_201_CREATED,
)
def create_zone(
    data: ZoneCreate,
    db: Session = Depends(get_db),
):
    service = ZoneService(db)
    return service.create(data)


@router.patch(
    "/{zone_id}",
    response_model=ZoneRead,
)
def update_zone(
    zone_id: int,
    data: ZoneUpdate,
    db: Session = Depends(get_db),
):
    service = ZoneService(db)
    return service.update(zone_id, data)


@router.delete(
    "/{zone_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_zone(
    zone_id: int,
    db: Session = Depends(get_db),
):
    service = ZoneService(db)
    service.delete(zone_id)
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database.session import get_db
from schemas.sensor import SensorCreate, SensorRead, SensorUpdate
from services.sensor import SensorService


router = APIRouter(
    prefix="/api/sensors",
    tags=["Sensors"],
)


@router.get(
    "",
    response_model=list[SensorRead],
)
def list_sensors(
    zone_id: int | None = None,
    equipment_id: int | None = None,
    db: Session = Depends(get_db),
):
    service = SensorService(db)
    return service.get_all(zone_id, equipment_id)


@router.get(
    "/{sensor_id}",
    response_model=SensorRead,
)
def get_sensor(
    sensor_id: int,
    db: Session = Depends(get_db),
):
    service = SensorService(db)
    return service.get_by_id(sensor_id)


@router.post(
    "",
    response_model=SensorRead,
    status_code=status.HTTP_201_CREATED,
)
def create_sensor(
    data: SensorCreate,
    db: Session = Depends(get_db),
):
    service = SensorService(db)
    return service.create(data)


@router.patch(
    "/{sensor_id}",
    response_model=SensorRead,
)
def update_sensor(
    sensor_id: int,
    data: SensorUpdate,
    db: Session = Depends(get_db),
):
    service = SensorService(db)
    return service.update(sensor_id, data)


@router.delete(
    "/{sensor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_sensor(
    sensor_id: int,
    db: Session = Depends(get_db),
):
    service = SensorService(db)
    service.delete(sensor_id)
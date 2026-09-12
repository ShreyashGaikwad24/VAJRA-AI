from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database.session import get_db
from schemas.plant import PlantCreate, PlantRead, PlantUpdate
from services.plant import PlantService


router = APIRouter(
    prefix="/api/plants",
    tags=["Plants"],
)


@router.get(
    "",
    response_model=list[PlantRead],
)
def list_plants(
    db: Session = Depends(get_db),
):
    service = PlantService(db)
    return service.get_all()


@router.get(
    "/{plant_id}",
    response_model=PlantRead,
)
def get_plant(
    plant_id: int,
    db: Session = Depends(get_db),
):
    service = PlantService(db)
    return service.get_by_id(plant_id)


@router.post(
    "",
    response_model=PlantRead,
    status_code=status.HTTP_201_CREATED,
)
def create_plant(
    data: PlantCreate,
    db: Session = Depends(get_db),
):
    service = PlantService(db)
    return service.create(data)


@router.patch(
    "/{plant_id}",
    response_model=PlantRead,
)
def update_plant(
    plant_id: int,
    data: PlantUpdate,
    db: Session = Depends(get_db),
):
    service = PlantService(db)
    return service.update(plant_id, data)


@router.delete(
    "/{plant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_plant(
    plant_id: int,
    db: Session = Depends(get_db),
):
    service = PlantService(db)
    service.delete(plant_id)
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repositories.zone import ZoneRepository
from schemas.zone import ZoneCreate, ZoneUpdate


class ZoneService:
    def __init__(self, db: Session):
        self.repository = ZoneRepository(db)

    def get_all(self, plant_id: int | None = None):
        return self.repository.get_all(plant_id)

    def get_by_id(self, zone_id: int):
        zone = self.repository.get_by_id(zone_id)

        if zone is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Zone not found",
            )

        return zone

    def create(self, data: ZoneCreate):
        existing_zone = self.repository.get_by_code(data.code)

        if existing_zone is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Zone code already exists",
            )

        return self.repository.create(data)

    def update(self, zone_id: int, data: ZoneUpdate):
        zone = self.get_by_id(zone_id)

        if data.code is not None and data.code != zone.code:
            existing_zone = self.repository.get_by_code(data.code)

            if existing_zone is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Zone code already exists",
                )

        return self.repository.update(zone, data)

    def delete(self, zone_id: int):
        zone = self.get_by_id(zone_id)
        self.repository.delete(zone)
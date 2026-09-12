from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PlantBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    code: str = Field(min_length=1, max_length=100)
    location: str | None = Field(default=None, max_length=300)
    description: str | None = None
    is_active: bool = True


class PlantCreate(PlantBase):
    pass


class PlantUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    code: str | None = Field(default=None, min_length=1, max_length=100)
    location: str | None = Field(default=None, max_length=300)
    description: str | None = None
    is_active: bool | None = None


class PlantRead(PlantBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
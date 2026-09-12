from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ZoneBase(BaseModel):
    plant_id: int = Field(gt=0)
    name: str = Field(min_length=1, max_length=200)
    code: str = Field(min_length=1, max_length=100)
    description: str | None = None
    risk_level: str = Field(default="normal", max_length=50)
    is_active: bool = True


class ZoneCreate(ZoneBase):
    pass


class ZoneUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    code: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    risk_level: str | None = Field(default=None, max_length=50)
    is_active: bool | None = None


class ZoneRead(ZoneBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
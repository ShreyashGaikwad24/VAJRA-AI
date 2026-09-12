from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SensorBase(BaseModel):
    zone_id: int = Field(gt=0)
    equipment_id: int | None = Field(default=None, gt=0)

    name: str = Field(min_length=1, max_length=200)
    code: str = Field(min_length=1, max_length=100)

    sensor_type: str = Field(min_length=1, max_length=50)
    unit: str = Field(min_length=1, max_length=30)

    current_value: float | None = None
    normal_min: float | None = None
    normal_max: float | None = None

    is_active: bool = True


class SensorCreate(SensorBase):
    pass


class SensorUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    code: str | None = Field(default=None, min_length=1, max_length=100)

    sensor_type: str | None = Field(default=None, min_length=1, max_length=50)
    unit: str | None = Field(default=None, min_length=1, max_length=30)

    current_value: float | None = None
    normal_min: float | None = None
    normal_max: float | None = None

    is_active: bool | None = None


class SensorRead(SensorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    last_reading_at: datetime | None
    created_at: datetime
    updated_at: datetime
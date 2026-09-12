from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EquipmentBase(BaseModel):
    zone_id: int = Field(gt=0)
    name: str = Field(min_length=1, max_length=200)
    code: str = Field(min_length=1, max_length=100)
    equipment_type: str = Field(min_length=1, max_length=100)
    status: str = Field(default="normal", max_length=50)
    health_score: float = Field(default=100.0, ge=0.0, le=100.0)

    temperature: float | None = None
    pressure: float | None = None
    flow_rate: float | None = None
    vibration: float | None = None
    gas_level: float | None = None
    humidity: float | None = None

    workers_nearby: int = Field(default=0, ge=0)
    maintenance_overdue: bool = False

    root_cause: str | None = None
    recommendation: str | None = None


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    code: str | None = Field(default=None, min_length=1, max_length=100)
    equipment_type: str | None = Field(default=None, min_length=1, max_length=100)
    status: str | None = Field(default=None, max_length=50)
    health_score: float | None = Field(default=None, ge=0.0, le=100.0)

    temperature: float | None = None
    pressure: float | None = None
    flow_rate: float | None = None
    vibration: float | None = None
    gas_level: float | None = None
    humidity: float | None = None

    workers_nearby: int | None = Field(default=None, ge=0)
    maintenance_overdue: bool | None = None

    root_cause: str | None = None
    recommendation: str | None = None


class EquipmentRead(EquipmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
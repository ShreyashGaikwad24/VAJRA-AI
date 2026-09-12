from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TelemetryCreate(BaseModel):
    sensor_id: int = Field(gt=0)
    timestamp: datetime
    value: float
    quality: str = Field(default="good", min_length=1, max_length=30)


class TelemetryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sensor_id: int
    timestamp: datetime
    value: float
    quality: str
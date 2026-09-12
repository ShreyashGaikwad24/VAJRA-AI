from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RiskSnapshotRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    timestamp: datetime

    cri: float = Field(ge=0, le=100)
    pri: float = Field(ge=0, le=100)
    eri: float = Field(ge=0, le=100)
    sri: float = Field(ge=0, le=100)

    overall_risk: float = Field(ge=0, le=100)
    risk_level: str
from pydantic import BaseModel, Field


class RiskContributor(BaseModel):
    factor: str
    score: float = Field(ge=0, le=100)
    severity: str
    explanation: str


class RiskRecommendation(BaseModel):
    priority: str
    action: str
    reason: str


class RiskResponse(BaseModel):
    cri: float = Field(ge=0, le=100)
    pri: float = Field(ge=0, le=100)
    eri: float = Field(ge=0, le=100)
    sri: float = Field(ge=0, le=100)

    overall_risk: float = Field(ge=0, le=100)
    risk_level: str

    contributors: list[RiskContributor]
    recommendations: list[RiskRecommendation]
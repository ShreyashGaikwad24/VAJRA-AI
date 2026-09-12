from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.session import get_db
from schemas.risk import RiskResponse
from services.risk import risk_service


router = APIRouter(
    prefix="/api/risk",
    tags=["Risk"],
)


@router.get(
    "",
    response_model=RiskResponse,
)
def get_current_risk(
    db: Session = Depends(get_db),
):
    return risk_service.calculate_risk(db)
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.session import get_db
from schemas.risk_history import RiskSnapshotRead
from services.risk_history import risk_history_service


router = APIRouter(
    prefix="/api/risk/history",
    tags=["Risk History"],
)


@router.post(
    "/snapshot",
    response_model=RiskSnapshotRead,
)
def save_risk_snapshot(
    db: Session = Depends(get_db),
):
    from services.risk import risk_service

    risk_data = risk_service.calculate_risk(db)

    return risk_history_service.save_snapshot(
        db=db,
        risk_data=risk_data,
    )


@router.get(
    "",
    response_model=list[RiskSnapshotRead],
)
def get_risk_history(
    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
    ),
    db: Session = Depends(get_db),
):
    return risk_history_service.get_recent_snapshots(
        db=db,
        limit=limit,
    )
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.risk import RiskSnapshot


class RiskRepository:
    def create(
        self,
        db: Session,
        timestamp: datetime,
        cri: float,
        pri: float,
        eri: float,
        sri: float,
        overall_risk: float,
        risk_level: str,
    ) -> RiskSnapshot:
        snapshot = RiskSnapshot(
            timestamp=timestamp,
            cri=cri,
            pri=pri,
            eri=eri,
            sri=sri,
            overall_risk=overall_risk,
            risk_level=risk_level,
        )

        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)

        return snapshot

    def get_recent(
        self,
        db: Session,
        limit: int = 100,
    ) -> list[RiskSnapshot]:
        statement = (
            select(RiskSnapshot)
            .order_by(RiskSnapshot.timestamp.desc())
            .limit(limit)
        )

        return list(db.scalars(statement).all())


risk_repository = RiskRepository()
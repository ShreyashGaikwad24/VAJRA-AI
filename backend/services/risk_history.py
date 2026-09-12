from datetime import datetime, timezone

from sqlalchemy.orm import Session

from repositories.risk import risk_repository


class RiskHistoryService:
    def save_snapshot(
        self,
        db: Session,
        risk_data: dict,
    ):
        return risk_repository.create(
            db=db,
            timestamp=datetime.now(timezone.utc),
            cri=risk_data["cri"],
            pri=risk_data["pri"],
            eri=risk_data["eri"],
            sri=risk_data["sri"],
            overall_risk=risk_data["overall_risk"],
            risk_level=risk_data["risk_level"],
        )

    def get_recent_snapshots(
        self,
        db: Session,
        limit: int = 100,
    ):
        return risk_repository.get_recent(
            db=db,
            limit=limit,
        )


risk_history_service = RiskHistoryService()
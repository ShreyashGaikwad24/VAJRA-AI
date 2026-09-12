from datetime import datetime

from sqlalchemy import DateTime, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base


class RiskSnapshot(Base):
    __tablename__ = "risk_snapshots"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )

    cri: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    pri: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    eri: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    sri: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    overall_risk: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    risk_level: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )
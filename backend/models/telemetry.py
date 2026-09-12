from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base


class TelemetryReading(Base):
    __tablename__ = "telemetry_readings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    sensor_id: Mapped[int] = mapped_column(
        ForeignKey("sensors.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )

    value: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    quality: Mapped[str] = mapped_column(
        default="good",
        nullable=False,
    )

    sensor = relationship("Sensor", backref="telemetry_readings")

    __table_args__ = (
        Index(
            "ix_telemetry_sensor_timestamp",
            "sensor_id",
            "timestamp",
        ),
    )
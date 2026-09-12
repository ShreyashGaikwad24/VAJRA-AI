import asyncio

from api.websocket import websocket_manager
from database.session import SessionLocal
from services.realtime import serialize_risk
from services.risk import risk_service
from services.risk_history import risk_history_service


RISK_SNAPSHOT_INTERVAL_SECONDS = 10


async def run_risk_snapshot_loop():
    while True:
        db = SessionLocal()

        try:
            risk_data = risk_service.calculate_risk(
                db=db,
            )

            risk_history_service.save_snapshot(
                db=db,
                risk_data=risk_data,
            )

            await websocket_manager.broadcast(
                serialize_risk(risk_data)
            )

        except Exception as exc:
            db.rollback()
            print(
                f"Risk snapshot error: {exc}"
            )

        finally:
            db.close()

        await asyncio.sleep(
            RISK_SNAPSHOT_INTERVAL_SECONDS
        )
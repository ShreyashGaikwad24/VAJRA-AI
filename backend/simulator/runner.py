import asyncio

from database.session import SessionLocal
from simulator.telemetry import telemetry_simulator


SIMULATION_INTERVAL_SECONDS = 5


async def run_telemetry_loop():
    while True:
        db = SessionLocal()

        try:
            await telemetry_simulator.generate_all_readings(
                db=db,
            )

        except Exception as exc:
            db.rollback()
            print(
                f"Telemetry simulation error: {exc}"
            )

        finally:
            db.close()

        await asyncio.sleep(
            SIMULATION_INTERVAL_SECONDS
        )
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from api.equipment import router as equipment_router
from api.plants import router as plants_router
from api.risk import router as risk_router
from api.risk_history import router as risk_history_router
from api.sensors import router as sensors_router
from api.simulation import router as simulation_router
from api.telemetry import router as telemetry_router
from api.zones import router as zones_router
from database.session import engine
from simulator.risk_runner import run_risk_snapshot_loop
from simulator.runner import run_telemetry_loop
from api.websocket import router as websocket_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    telemetry_task = asyncio.create_task(
        run_telemetry_loop()
    )

    risk_snapshot_task = asyncio.create_task(
        run_risk_snapshot_loop()
    )

    try:
        yield

    finally:
        telemetry_task.cancel()
        risk_snapshot_task.cancel()

        await asyncio.gather(
            telemetry_task,
            risk_snapshot_task,
            return_exceptions=True,
        )


app = FastAPI(
    title="SAFE AI Backend",
    description="Foundation service for SAFE AI project",
    version="0.1.0",
    lifespan=lifespan,
)


app.include_router(plants_router)
app.include_router(zones_router)
app.include_router(equipment_router)
app.include_router(sensors_router)
app.include_router(telemetry_router)
app.include_router(simulation_router)
app.include_router(risk_router)
app.include_router(risk_history_router)
app.include_router(websocket_router)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "safe-ai-backend",
    }


@app.get("/health/db")
def database_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": "postgresql",
    }
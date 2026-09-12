from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database.session import get_db
from models.sensor import Sensor
from schemas.telemetry import TelemetryCreate, TelemetryRead
from services.telemetry import telemetry_service
from simulator.telemetry import telemetry_simulator
from schemas.simulation import (
    SimulationScenarioRequest,
    SimulationScenarioResponse,
)

router = APIRouter(
    prefix="/api/telemetry",
    tags=["Telemetry"],
)


@router.post(
    "",
    response_model=TelemetryRead,
    status_code=status.HTTP_201_CREATED,
)
def create_telemetry(
    payload: TelemetryCreate,
    db: Session = Depends(get_db),
):
    return telemetry_service.create_reading(
        db=db,
        sensor_id=payload.sensor_id,
        timestamp=payload.timestamp,
        value=payload.value,
        quality=payload.quality,
    )


@router.get(
    "",
    response_model=list[TelemetryRead],
)
def list_telemetry(
    sensor_id: int = Query(gt=0),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    return telemetry_service.get_sensor_readings(
        db=db,
        sensor_id=sensor_id,
        limit=limit,
    )


@router.post(
    "/simulate/{sensor_id}",
    response_model=TelemetryRead,
    status_code=status.HTTP_201_CREATED,
)
def simulate_telemetry(
    sensor_id: int,
    db: Session = Depends(get_db),
):
    sensor = db.get(Sensor, sensor_id)

    if sensor is None:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found",
        )

    return telemetry_simulator.generate_reading(
        db=db,
        sensor=sensor,
    )


@router.post(
    "/simulate",
    response_model=list[TelemetryRead],
    status_code=status.HTTP_201_CREATED,
)
def simulate_all_telemetry(
    db: Session = Depends(get_db),
):
    return telemetry_simulator.generate_all_readings(
        db=db,
    )
@router.post(
    "/scenario",
    response_model=SimulationScenarioResponse,
)
def set_simulation_scenario(
    payload: SimulationScenarioRequest,
):
    telemetry_simulator.set_scenario(payload.scenario.value)

    return SimulationScenarioResponse(
        scenario=payload.scenario,
        scenario_step=telemetry_simulator.scenario_step,
    )
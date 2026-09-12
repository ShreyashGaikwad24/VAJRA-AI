from fastapi import APIRouter

from schemas.simulation import (
    SimulationScenarioRequest,
    SimulationScenarioResponse,
)
from simulator.telemetry import telemetry_simulator


router = APIRouter(
    prefix="/api/simulation",
    tags=["Simulation"],
)


@router.get(
    "/scenario",
    response_model=SimulationScenarioResponse,
)
def get_simulation_scenario():
    return SimulationScenarioResponse(
        scenario=telemetry_simulator.scenario,
        scenario_step=telemetry_simulator.scenario_step,
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
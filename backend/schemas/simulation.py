from enum import Enum

from pydantic import BaseModel


class SimulationScenario(str, Enum):
    normal = "normal"
    warning = "warning"
    critical = "critical"


class SimulationScenarioRequest(BaseModel):
    scenario: SimulationScenario


class SimulationScenarioResponse(BaseModel):
    scenario: SimulationScenario
    scenario_step: int
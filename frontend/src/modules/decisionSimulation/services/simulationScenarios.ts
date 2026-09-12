import type {
  EmergencyPreparednessId,
  MaintenanceActionId,
  OperatorAllocationId,
  SimulationControls,
  SimulationScenarioMeta,
} from './simulationTypes'

export const DEFAULT_SCENARIO_META: SimulationScenarioMeta = {
  name: 'Reduce High Temp in R-101',
  focusArea: 'Reactor Unit (R-101)',
  primaryRisk: 'High Temperature',
}

export const DEFAULT_SIMULATION_CONTROLS: SimulationControls = {
  coolingWaterFlowPct: 25,
  feedRatePct: -15,
  reactorPressurePct: -5,
  maintenanceAction: 'clean-heat-exchanger',
  operatorAllocation: 'add-2-operators',
  emergencyPreparedness: 'enhanced-monitoring',
}

export const MAINTENANCE_ACTIONS: Array<{
  id: MaintenanceActionId
  label: string
  impact: 'Low' | 'Medium' | 'High'
}> = [
  { id: 'clean-heat-exchanger', label: 'Clean Heat Exchanger', impact: 'High' },
  { id: 'reactor-inspection', label: 'Reactor Safety Inspection', impact: 'Medium' },
  { id: 'valve-calibration', label: 'Calibrate Control Valves', impact: 'Medium' },
  { id: 'cooling-loop-flush', label: 'Cooling Loop Flush', impact: 'High' },
]

export const OPERATOR_ALLOCATIONS: Array<{
  id: OperatorAllocationId
  label: string
  impact: 'Low' | 'Medium' | 'High'
}> = [
  { id: 'no-change', label: 'No Change', impact: 'Low' },
  { id: 'add-2-operators', label: 'Add 2 Operators', impact: 'Medium' },
  { id: 'add-4-operators', label: 'Add 4 Operators', impact: 'High' },
  { id: 'reassign-shift-supervisor', label: 'Reassign Shift Supervisor', impact: 'Medium' },
]

export const EMERGENCY_PREPAREDNESS_OPTIONS: Array<{
  id: EmergencyPreparednessId
  label: string
  impact: 'Low' | 'Medium' | 'High'
}> = [
  { id: 'standard-monitoring', label: 'Standard Monitoring', impact: 'Low' },
  { id: 'enhanced-monitoring', label: 'Enhanced Monitoring', impact: 'Medium' },
  { id: 'hot-work-permit-lockdown', label: 'Hot Work Permit Lockdown', impact: 'High' },
  { id: 'pre-deploy-response-team', label: 'Pre-deploy Response Team', impact: 'High' },
]

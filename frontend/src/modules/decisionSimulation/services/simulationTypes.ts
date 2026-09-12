import type {
  AIExplanation,
  ForecastState,
  PatternMatch,
  PlantEquipment,
  PlantSensor,
  PlantZone,
  RiskContributor,
  RiskRecommendation,
  RiskScores,
  RiskLevel,
} from '@/data/plant/types'

export type MaintenanceActionId =
  | 'clean-heat-exchanger'
  | 'reactor-inspection'
  | 'valve-calibration'
  | 'cooling-loop-flush'

export type OperatorAllocationId =
  | 'no-change'
  | 'add-2-operators'
  | 'add-4-operators'
  | 'reassign-shift-supervisor'

export type EmergencyPreparednessId =
  | 'standard-monitoring'
  | 'enhanced-monitoring'
  | 'hot-work-permit-lockdown'
  | 'pre-deploy-response-team'

export type SimulationControls = {
  coolingWaterFlowPct: number
  feedRatePct: number
  reactorPressurePct: number
  maintenanceAction: MaintenanceActionId
  operatorAllocation: OperatorAllocationId
  emergencyPreparedness: EmergencyPreparednessId
}

export type SimulationScenarioMeta = {
  name: string
  focusArea: string
  primaryRisk: string
}

export type DerivedSimulationMetrics = {
  predictedIncidents: RiskLevel
  riskSpread: RiskLevel
  affectedWorkers: number
  downtimeRiskHours: number
  potentialLossCrores: number
  riskReductionPct: number
  criReductionPct: number
  incidentRiskReductionPct: number
  downtimeRiskReductionPct: number
  potentialLossReductionPct: number
  safetyImprovement: 'Low' | 'Moderate' | 'High'
  operationalStability: 'Degraded' | 'Stable' | 'Improved'
  confidenceScore: number
}

export type SimulationSnapshot = {
  equipment: PlantEquipment[]
  sensors: PlantSensor[]
  zones: Array<PlantZone & { riskScore: number }>
  riskScores: RiskScores
  riskContributors: RiskContributor[]
  recommendations: RiskRecommendation[]
  explanation: AIExplanation
  patternMatch: PatternMatch
  forecast: ForecastState
  metrics: DerivedSimulationMetrics
}

export type SimulationRunResult = {
  before: SimulationSnapshot
  after: SimulationSnapshot
  controls: SimulationControls
  checklist: string[]
}

export type DecisionSelectionInfo = {
  scenarioName: string
  focusArea: string
  primaryRisk: string
  currentCri: number
  currentCriLevel: RiskLevel
}

import type {
  PlantEquipment,
  PlantSensor,
  PlantZone,
  RiskLevel,
  RiskScores,
} from '@/data/plant/types'
import { riskLevelFromScore } from '@/data/plant/types'
import { buildExplanation } from '@/modules/situationRoom/services/explanationEngine'
import { buildForecast } from '@/modules/situationRoom/services/forecastService'
import { matchHistoricalIncident } from '@/modules/situationRoom/services/incidentService'
import { buildRecommendations } from '@/modules/situationRoom/services/recommendationEngine'
import {
  computeRiskContributors,
  computeRiskScores,
  computeZoneRisk,
} from '@/modules/situationRoom/services/riskEngine'

import type {
  DerivedSimulationMetrics,
  SimulationControls,
  SimulationRunResult,
  SimulationSnapshot,
} from './simulationTypes'

const BASE_WEATHER_WIND = 11
const BASE_SHIFT_FATIGUE = 75

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function levelFromValue(value: number): RiskLevel {
  return riskLevelFromScore(value)
}

function levelWeight(level: RiskLevel): number {
  switch (level) {
    case 'critical':
      return 1
    case 'high':
      return 0.72
    case 'medium':
      return 0.46
    case 'low':
      return 0.22
    case 'safe':
      return 0.08
  }
}

function cloneBaseline<T>(value: T): T {
  return structuredClone(value)
}

function deriveZoneRisk(
  zones: PlantZone[],
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
): Array<PlantZone & { riskScore: number }> {
  return zones.map((zone) => ({
    ...zone,
    riskScore: Math.round(computeZoneRisk(zone, equipment, sensors)),
  }))
}

function deriveSnapshot(
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  zones: PlantZone[],
  weatherWind: number,
  shiftFatigue: number,
): Omit<SimulationSnapshot, 'metrics'> {
  const zoneState = deriveZoneRisk(zones, equipment, sensors)
  const riskScores = computeRiskScores(zoneState, equipment, sensors, weatherWind, shiftFatigue)
  const riskContributors = computeRiskContributors(zoneState, equipment, sensors, weatherWind, shiftFatigue)
  const recommendations = buildRecommendations(riskScores, equipment, sensors, zoneState)
  const explanation = buildExplanation(riskScores, equipment, sensors, zoneState, riskContributors)
  const patternMatch = matchHistoricalIncident(equipment, sensors, zoneState, riskContributors)
  const forecast = buildForecast(riskScores, equipment, sensors)

  return {
    equipment,
    sensors,
    zones: zoneState,
    riskScores,
    riskContributors,
    recommendations,
    explanation,
    patternMatch,
    forecast,
  }
}

function applyControlEffects(
  baseEquipment: PlantEquipment[],
  baseSensors: PlantSensor[],
  baseZones: PlantZone[],
  controls: SimulationControls,
): {
  equipment: PlantEquipment[]
  sensors: PlantSensor[]
  zones: PlantZone[]
  weatherWind: number
  shiftFatigue: number
} {
  const equipment = cloneBaseline(baseEquipment)
  const sensors = cloneBaseline(baseSensors)
  const zones = cloneBaseline(baseZones)

  const reactor = equipment.find((item) => item.id === 'R-101')
  const heatExchanger = equipment.find((item) => item.id === 'HX-044')
  const valveStation = equipment.find((item) => item.id === 'VS-307')
  const pipelineJunction = equipment.find((item) => item.id === 'PJ-114')

  const coolingScale = controls.coolingWaterFlowPct / 100
  const feedScale = controls.feedRatePct / 100
  const pressureScale = controls.reactorPressurePct / 100

  let maintenanceTempFactor = 1
  let maintenanceGasFactor = 1
  let maintenanceVibrationFactor = 1

  switch (controls.maintenanceAction) {
    case 'clean-heat-exchanger':
      maintenanceTempFactor = 0.92
      maintenancePressureFactor(reactor, 0.95)
      if (heatExchanger) {
        heatExchanger.flow = clamp(heatExchanger.flow * 1.08, 0, 140)
        heatExchanger.temperature = clamp(heatExchanger.temperature * 0.94, 0, 500)
      }
      break
    case 'reactor-inspection':
      maintenanceTempFactor = 0.95
      maintenanceGasFactor = 0.94
      break
    case 'valve-calibration':
      maintenanceGasFactor = 0.9
      maintenanceVibrationFactor = 0.94
      if (valveStation) {
        valveStation.failureProbability = clamp(valveStation.failureProbability * 0.82, 0.01, 0.95)
      }
      if (pipelineJunction) {
        pipelineJunction.pressure = clamp(pipelineJunction.pressure * 0.93, 0, 25)
      }
      break
    case 'cooling-loop-flush':
      maintenanceTempFactor = 0.89
      maintenanceGasFactor = 0.95
      if (reactor) {
        reactor.flow = clamp(reactor.flow * 0.94, 0, 180)
      }
      break
  }

  let operatorRiskFactor = 1
  let workerExposureFactor = 1

  switch (controls.operatorAllocation) {
    case 'no-change':
      operatorRiskFactor = 1
      workerExposureFactor = 1
      break
    case 'add-2-operators':
      operatorRiskFactor = 0.95
      workerExposureFactor = 0.92
      break
    case 'add-4-operators':
      operatorRiskFactor = 0.9
      workerExposureFactor = 0.86
      break
    case 'reassign-shift-supervisor':
      operatorRiskFactor = 0.93
      workerExposureFactor = 0.9
      break
  }

  let emergencyPermitFactor = 1
  let emergencyGasFactor = 1
  let emergencyFatigue = BASE_SHIFT_FATIGUE

  switch (controls.emergencyPreparedness) {
    case 'standard-monitoring':
      emergencyPermitFactor = 1
      emergencyGasFactor = 1
      emergencyFatigue = BASE_SHIFT_FATIGUE
      break
    case 'enhanced-monitoring':
      emergencyPermitFactor = 0.94
      emergencyGasFactor = 0.94
      emergencyFatigue = BASE_SHIFT_FATIGUE - 4
      break
    case 'hot-work-permit-lockdown':
      emergencyPermitFactor = 0.82
      emergencyGasFactor = 0.9
      emergencyFatigue = BASE_SHIFT_FATIGUE - 7
      break
    case 'pre-deploy-response-team':
      emergencyPermitFactor = 0.9
      emergencyGasFactor = 0.88
      emergencyFatigue = BASE_SHIFT_FATIGUE - 9
      break
  }

  for (const item of equipment) {
    const isReactorZone = item.zoneId === 'ZONE C'

    if (item.id === 'R-101') {
      item.temperature = clamp(
        item.temperature * (1 - 0.28 * coolingScale + 0.22 * feedScale) * maintenanceTempFactor,
        0,
        500,
      )
      item.pressure = clamp(item.pressure * (1 + pressureScale) * (1 + 0.12 * feedScale), 0, 25)
      item.gas = clamp(item.gas * (1 + 0.18 * feedScale - 0.14 * coolingScale) * maintenanceGasFactor * emergencyGasFactor, 0, 100)
      item.vibration = clamp(item.vibration * (1 + 0.1 * feedScale) * maintenanceVibrationFactor, 0, 6)
      item.failureProbability = clamp(
        item.failureProbability * (1 + 0.35 * feedScale - 0.26 * coolingScale) * operatorRiskFactor,
        0.01,
        0.95,
      )
    } else {
      item.temperature = clamp(item.temperature * (1 - 0.08 * coolingScale) * maintenanceTempFactor, 0, 500)
      item.pressure = clamp(item.pressure * (1 + 0.35 * pressureScale), 0, 25)
      item.gas = clamp(item.gas * maintenanceGasFactor * emergencyGasFactor, 0, 100)
      item.vibration = clamp(item.vibration * maintenanceVibrationFactor, 0, 6)
      item.failureProbability = clamp(item.failureProbability * operatorRiskFactor, 0.01, 0.95)
    }

    item.workersNearby = Math.max(1, Math.round(item.workersNearby * workerExposureFactor))

    if (isReactorZone && controls.emergencyPreparedness === 'hot-work-permit-lockdown') {
      item.workersNearby = Math.max(1, Math.round(item.workersNearby * 0.8))
    }

    if (item.temperature >= 380 || item.gas >= 30) {
      item.status = 'Critical'
    } else if (item.temperature >= 250 || item.pressure >= 10 || item.vibration >= 2.4) {
      item.status = 'Warning'
    } else if (item.maintenanceOverdue) {
      item.status = 'Maintenance'
    } else {
      item.status = 'Healthy'
    }
  }

  for (const sensor of sensors) {
    const linked = equipment.find((item) => item.id === sensor.equipmentId)
    if (!linked) {
      continue
    }

    switch (sensor.type) {
      case 'temperature':
        sensor.value = linked.temperature
        break
      case 'pressure':
        sensor.value = linked.pressure
        break
      case 'gas':
        sensor.value = linked.gas
        break
      case 'vibration':
        sensor.value = linked.vibration
        break
      case 'humidity':
        sensor.value = linked.humidity
        break
      case 'flow':
        sensor.value = linked.flow
        break
    }
    sensor.history = [...sensor.history.slice(-23), sensor.value]
  }

  for (const zone of zones) {
    zone.activePermits = Math.max(1, Math.round(zone.activePermits * emergencyPermitFactor))
    if (zone.id === 'ZONE C' && controls.emergencyPreparedness === 'hot-work-permit-lockdown') {
      zone.hotWorkActive = false
    }
  }

  return {
    equipment,
    sensors,
    zones,
    weatherWind: BASE_WEATHER_WIND,
    shiftFatigue: clamp(emergencyFatigue, 45, 92),
  }
}

function maintenancePressureFactor(reactor: PlantEquipment | undefined, factor: number) {
  if (!reactor) {
    return
  }
  reactor.pressure = clamp(reactor.pressure * factor, 0, 25)
}

function buildMetrics(before: SimulationSnapshot, after: SimulationSnapshot): DerivedSimulationMetrics {
  const beforeCri = before.riskScores.cri
  const afterCri = after.riskScores.cri

  const beforeIncidentSeverity = levelWeight(levelFromValue(before.forecast.probability))
  const afterIncidentSeverity = levelWeight(levelFromValue(after.forecast.probability))

  const afterAffectedWorkers = after.equipment.reduce((sum, item) => sum + item.workersNearby, 0)

  const beforeDowntimeRiskHours = clamp(
    (before.forecast.timeToCriticalMinutes / 60) * (1.4 + beforeIncidentSeverity * 10),
    1,
    24,
  )
  const afterDowntimeRiskHours = clamp(
    (after.forecast.timeToCriticalMinutes / 60) * (0.7 + afterIncidentSeverity * 5),
    0.5,
    24,
  )

  const beforePotentialLossCrores = clamp(
    0.25 + beforeCri / 55 + beforeIncidentSeverity * 1.45 + beforeDowntimeRiskHours / 13,
    0.1,
    8,
  )
  const afterPotentialLossCrores = clamp(
    0.15 + afterCri / 80 + afterIncidentSeverity * 1.1 + afterDowntimeRiskHours / 18,
    0.1,
    8,
  )

  const criReductionPct = Math.round(((beforeCri - afterCri) / Math.max(1, beforeCri)) * 100)
  const incidentRiskReductionPct = Math.round(((beforeIncidentSeverity - afterIncidentSeverity) / Math.max(0.05, beforeIncidentSeverity)) * 100)
  const downtimeRiskReductionPct = Math.round(((beforeDowntimeRiskHours - afterDowntimeRiskHours) / Math.max(0.5, beforeDowntimeRiskHours)) * 100)
  const potentialLossReductionPct = Math.round(((beforePotentialLossCrores - afterPotentialLossCrores) / Math.max(0.1, beforePotentialLossCrores)) * 100)
  const totalRiskReduction = clamp(
    Math.round((criReductionPct * 0.4) + (incidentRiskReductionPct * 0.25) + (downtimeRiskReductionPct * 0.2) + (potentialLossReductionPct * 0.15)),
    -100,
    100,
  )

  const confidenceScore = clamp(
    Math.round(64 + Math.max(0, criReductionPct) * 0.24 + Math.max(0, incidentRiskReductionPct) * 0.12 + after.explanation.confidence * 0.16),
    45,
    98,
  )

  const safetyImprovement: 'Low' | 'Moderate' | 'High' =
    totalRiskReduction >= 40 ? 'High' : totalRiskReduction >= 20 ? 'Moderate' : 'Low'

  const operationalStability: 'Degraded' | 'Stable' | 'Improved' =
    totalRiskReduction >= 20 ? 'Improved' : totalRiskReduction >= 0 ? 'Stable' : 'Degraded'

  return {
    predictedIncidents: levelFromValue(after.forecast.probability),
    riskSpread: levelFromValue(after.riskScores.eri),
    affectedWorkers: Math.max(1, afterAffectedWorkers),
    downtimeRiskHours: Math.round(afterDowntimeRiskHours * 10) / 10,
    potentialLossCrores: Math.round(afterPotentialLossCrores * 10) / 10,
    riskReductionPct: totalRiskReduction,
    criReductionPct,
    incidentRiskReductionPct,
    downtimeRiskReductionPct,
    potentialLossReductionPct,
    safetyImprovement,
    operationalStability,
    confidenceScore,
  }
}

function buildChecklist(controls: SimulationControls): string[] {
  const checklist: string[] = []

  if (controls.coolingWaterFlowPct !== 0) {
    const sign = controls.coolingWaterFlowPct > 0 ? 'Increase' : 'Reduce'
    checklist.push(`${sign} cooling water flow by ${Math.abs(controls.coolingWaterFlowPct)}%`)
  }

  if (controls.feedRatePct !== 0) {
    const sign = controls.feedRatePct > 0 ? 'Increase' : 'Reduce'
    checklist.push(`${sign} feed rate by ${Math.abs(controls.feedRatePct)}%`)
  }

  if (controls.reactorPressurePct !== 0) {
    const sign = controls.reactorPressurePct > 0 ? 'Increase' : 'Reduce'
    checklist.push(`${sign} reactor pressure by ${Math.abs(controls.reactorPressurePct)}%`)
  }

  if (controls.maintenanceAction === 'clean-heat-exchanger') {
    checklist.push('Clean heat exchanger')
  } else if (controls.maintenanceAction === 'reactor-inspection') {
    checklist.push('Perform reactor safety inspection')
  } else if (controls.maintenanceAction === 'valve-calibration') {
    checklist.push('Calibrate control valves')
  } else {
    checklist.push('Flush cooling loop')
  }

  if (controls.operatorAllocation === 'add-2-operators') {
    checklist.push('Add 2 operators for monitoring')
  } else if (controls.operatorAllocation === 'add-4-operators') {
    checklist.push('Add 4 operators for monitoring')
  } else if (controls.operatorAllocation === 'reassign-shift-supervisor') {
    checklist.push('Reassign shift supervisor to Zone C')
  }

  if (controls.emergencyPreparedness === 'enhanced-monitoring') {
    checklist.push('Enable enhanced monitoring')
  } else if (controls.emergencyPreparedness === 'hot-work-permit-lockdown') {
    checklist.push('Apply hot work permit lockdown')
  } else if (controls.emergencyPreparedness === 'pre-deploy-response-team') {
    checklist.push('Pre-deploy emergency response team')
  }

  return checklist
}

function withMetrics(snapshot: Omit<SimulationSnapshot, 'metrics'>, metrics: DerivedSimulationMetrics): SimulationSnapshot {
  return {
    ...snapshot,
    metrics,
  }
}

export function runDecisionSimulation(params: {
  controls: SimulationControls
  baselineEquipment: PlantEquipment[]
  baselineSensors: PlantSensor[]
  baselineZones: PlantZone[]
}): SimulationRunResult {
  const baseEquipment = cloneBaseline(params.baselineEquipment)
  const baseSensors = cloneBaseline(params.baselineSensors)
  const baseZones = cloneBaseline(params.baselineZones)

  const beforeCore = deriveSnapshot(baseEquipment, baseSensors, baseZones, BASE_WEATHER_WIND, BASE_SHIFT_FATIGUE)

  const simulated = applyControlEffects(baseEquipment, baseSensors, baseZones, params.controls)
  const afterCore = deriveSnapshot(
    simulated.equipment,
    simulated.sensors,
    simulated.zones,
    simulated.weatherWind,
    simulated.shiftFatigue,
  )

  const beforeBase: SimulationSnapshot = withMetrics(beforeCore, {
    predictedIncidents: levelFromValue(beforeCore.forecast.probability),
    riskSpread: levelFromValue(beforeCore.riskScores.eri),
    affectedWorkers: beforeCore.equipment.reduce((sum, item) => sum + item.workersNearby, 0),
    downtimeRiskHours: Math.round(((beforeCore.forecast.timeToCriticalMinutes / 60) * 2.6) * 10) / 10,
    potentialLossCrores: Math.round((0.25 + beforeCore.riskScores.cri / 42) * 10) / 10,
    riskReductionPct: 0,
    criReductionPct: 0,
    incidentRiskReductionPct: 0,
    downtimeRiskReductionPct: 0,
    potentialLossReductionPct: 0,
    safetyImprovement: 'Low',
    operationalStability: 'Stable',
    confidenceScore: beforeCore.explanation.confidence,
  })

  const finalMetrics = buildMetrics(beforeBase, withMetrics(afterCore, beforeBase.metrics))
  const afterBase = withMetrics(afterCore, finalMetrics)

  return {
    before: beforeBase,
    after: afterBase,
    controls: params.controls,
    checklist: buildChecklist(params.controls),
  }
}

export function levelLabel(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'Critical'
    case 'high':
      return 'High'
    case 'medium':
      return 'Moderate'
    case 'low':
      return 'Low'
    case 'safe':
      return 'Safe'
  }
}

export function levelColor(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return '#dc2626'
    case 'high':
      return '#f97316'
    case 'medium':
      return '#eab308'
    case 'low':
      return '#22c55e'
    case 'safe':
      return '#3b82f6'
  }
}

export function computeCurrentNew(base: number, pct: number): { current: number; next: number } {
  return {
    current: base,
    next: base * (1 + pct / 100),
  }
}

export function summarizeRiskSpread(scores: RiskScores): RiskLevel {
  return riskLevelFromScore(scores.eri)
}

import { useCallback, useMemo, useState } from 'react'

import { usePlantStore } from '@/store/usePlantStore'
import { usePlantSimulation } from '@/modules/situationRoom/hooks/usePlantSimulation'
import { riskLevelFromScore } from '@/data/plant/types'

import { DEFAULT_SCENARIO_META, DEFAULT_SIMULATION_CONTROLS } from '../services/simulationScenarios'
import { levelLabel, runDecisionSimulation } from '../services/simulationEngine'
import type {
  DecisionSelectionInfo,
  SimulationControls,
  SimulationRunResult,
  SimulationSnapshot,
} from '../services/simulationTypes'

const BASE_COOLING_FLOW = 180
const BASE_FEED_RATE = 120
const BASE_REACTOR_PRESSURE = 6.5

function baselineSnapshot(snapshot: SimulationSnapshot): SimulationSnapshot {
  return snapshot
}

export function useDecisionSimulation() {
  usePlantSimulation(true)

  const plantName = usePlantStore((s) => s.plantName)
  const equipment = usePlantStore((s) => s.equipment)
  const sensors = usePlantStore((s) => s.sensors)
  const zones = usePlantStore((s) => s.zones)
  const riskScores = usePlantStore((s) => s.riskScores)
  const riskContributors = usePlantStore((s) => s.riskContributors)
  const recommendations = usePlantStore((s) => s.recommendations)
  const explanation = usePlantStore((s) => s.explanation)
  const forecast = usePlantStore((s) => s.forecast)

  const [controls, setControls] = useState<SimulationControls>(DEFAULT_SIMULATION_CONTROLS)
  const [runResult, setRunResult] = useState<SimulationRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const beforeResult = useMemo(() => {
    const computed = runDecisionSimulation({
      controls: DEFAULT_SIMULATION_CONTROLS,
      baselineEquipment: equipment,
      baselineSensors: sensors,
      baselineZones: zones,
    })
    return baselineSnapshot({
      ...computed.before,
      riskScores,
      riskContributors,
      recommendations,
      explanation,
      forecast,
    })
  }, [equipment, explanation, forecast, recommendations, riskContributors, riskScores, sensors, zones])

  const afterResult = runResult?.after ?? null

  const selectionInfo: DecisionSelectionInfo = useMemo(() => ({
    scenarioName: DEFAULT_SCENARIO_META.name,
    focusArea: DEFAULT_SCENARIO_META.focusArea,
    primaryRisk: DEFAULT_SCENARIO_META.primaryRisk,
    currentCri: beforeResult.riskScores.cri,
    currentCriLevel: riskLevelFromScore(riskScores.cri),
  }), [beforeResult.metrics.predictedIncidents, beforeResult.riskScores.cri])

  const controlValues = useMemo(() => ({
    cooling: {
      current: BASE_COOLING_FLOW,
      next: BASE_COOLING_FLOW * (1 + controls.coolingWaterFlowPct / 100),
    },
    feed: {
      current: BASE_FEED_RATE,
      next: BASE_FEED_RATE * (1 + controls.feedRatePct / 100),
    },
    pressure: {
      current: BASE_REACTOR_PRESSURE,
      next: BASE_REACTOR_PRESSURE * (1 + controls.reactorPressurePct / 100),
    },
  }), [controls.coolingWaterFlowPct, controls.feedRatePct, controls.reactorPressurePct])

  const runSimulation = useCallback(async () => {
    setIsRunning(true)

    await new Promise((resolve) => {
      window.setTimeout(resolve, 650)
    })

    const result = runDecisionSimulation({
      controls,
      baselineEquipment: equipment,
      baselineSensors: sensors,
      baselineZones: zones,
    })

    setRunResult(result)
    setIsRunning(false)
  }, [controls, equipment, sensors, zones])

  const resetSimulation = useCallback(() => {
    setControls(DEFAULT_SIMULATION_CONTROLS)
    setRunResult(null)
  }, [])

  const recommendationText = useMemo(() => {
    if (!afterResult) {
      return 'Run simulation to evaluate intervention impact and generate AI-backed recommendation.'
    }

    if (afterResult.metrics.riskReductionPct >= 35) {
      return 'The simulation shows a significant reduction in risk by implementing the selected actions. It is recommended to proceed with the suggested changes.'
    }

    if (afterResult.metrics.riskReductionPct >= 15) {
      return 'The selected interventions produce moderate risk reduction. Proceed with controls and monitor Zone C closely.'
    }

    return 'The selected configuration yields limited improvement. Consider stronger maintenance and emergency preparedness actions before execution.'
  }, [afterResult])

  const expectedOutcomes = useMemo(() => {
    const metrics = afterResult?.metrics
    if (!metrics) {
      return {
        riskReduction: 0,
        safetyImprovement: 'Low' as const,
        operationalStability: 'Stable' as const,
        confidenceScore: beforeResult.explanation.confidence,
      }
    }

    return {
      riskReduction: metrics.riskReductionPct,
      safetyImprovement: metrics.safetyImprovement,
      operationalStability: metrics.operationalStability,
      confidenceScore: metrics.confidenceScore,
    }
  }, [afterResult, beforeResult.explanation.confidence])

  return {
    plantName,
    controls,
    setControls,
    controlValues,
    before: beforeResult,
    after: afterResult,
    runResult,
    isRunning,
    runSimulation,
    resetSimulation,
    recommendationText,
    expectedOutcomes,
    selectionInfo,
    currentCriText: `${selectionInfo.currentCri} (${levelLabel(selectionInfo.currentCriLevel).toUpperCase()})`,
  }
}

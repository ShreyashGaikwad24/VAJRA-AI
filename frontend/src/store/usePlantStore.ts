
import { create } from 'zustand'

import type {
  AIExplanation,
  ForecastState,
  PatternMatch,
  PlantEquipment,
  PlantOverviewStats,
  PlantSensor,
  PlantZone,
  RiskContributor,
  RiskLevel,
  RiskRecommendation,
  RiskScores,
  RiskTrendPoint,
  SensorSnapshot,
  TrendDirection,
} from '@/data/plant/types'
import { riskLevelFromScore } from '@/data/plant/types'

import { buildExplanation } from '@/modules/situationRoom/services/explanationEngine'
import { buildForecast } from '@/modules/situationRoom/services/forecastService'
import { matchHistoricalIncident } from '@/modules/situationRoom/services/incidentService'

import { loadPlantData } from '@/services/plantLoader'
import { calculateZoneRiskScore } from '@/services/plantAdapter'
import type { RiskResponse } from '@/services/plantApi'
import {
  connectRealtime,
  type RealtimeMessage,
  type RiskUpdate,
  type TelemetryUpdate,
} from '@/services/realtime'

export type ZoneState = PlantZone & {
  riskScore: number
  backendRiskLevel: string
}

export type AppModule =
  | 'Dashboard'
  | 'Digital Twin'
  | 'Situation Room'
  | 'Decision Simulation'
  | 'AI Copilot'

export type TelemetryContext = {
  weatherWind: number
  shiftFatigue: number
}

type PlantStore = {
  simulationMode: boolean
  plantName: string

  equipment: PlantEquipment[]
  sensors: PlantSensor[]
  zones: ZoneState[]

  telemetryContext: TelemetryContext

  riskScores: RiskScores
  riskSummary: string
  riskContributors: RiskContributor[]
  recommendations: RiskRecommendation[]

  explanation: AIExplanation
  patternMatch: PatternMatch
  forecast: ForecastState

  riskTrendHistory: RiskTrendPoint[]
  sensorSnapshot: SensorSnapshot[]
  overview: PlantOverviewStats

  selectedZoneId: string | null
  selectedEquipmentId: string | null
  selectedSensorId: string | null

  showSensors: boolean
  cameraView: '3d' | 'top'
  heatMapMode: 'heat' | 'bubble'
  zoneFilter: string

  isLoading: boolean
  backendConnected: boolean
  backendError: string | null

  sensorCodeByBackendId: Record<number, string>

  initialize: () => Promise<void>
  tickTelemetry: () => void
  recalculateRisk: () => void

  selectZone: (zoneId: string | null) => void
  selectEquipment: (equipmentId: string | null) => void
  selectSensor: (sensorId: string | null) => void

  setShowSensors: (value: boolean) => void
  setCameraView: (view: '3d' | 'top') => void
  setHeatMapMode: (mode: 'heat' | 'bubble') => void
  setZoneFilter: (zoneId: string) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function trendFromDelta(delta: number): TrendDirection {
  if (delta > 0.4) return 'up'
  if (delta < -0.4) return 'down'
  return 'flat'
}

function buildSensorSnapshot(sensors: PlantSensor[]): SensorSnapshot[] {
  return sensors.map((sensor) => {
    const history = sensor.history
    const previousValue =
      history.length > 1
        ? history[history.length - 2]
        : sensor.value

    const delta = sensor.value - previousValue
    const trend = trendFromDelta(delta)

    let status: RiskLevel = 'safe'

    if (
      sensor.value < sensor.normalMin ||
      sensor.value > sensor.normalMax
    ) {
      const span = Math.max(
        sensor.normalMax - sensor.normalMin,
        1,
      )

      const deviation =
        sensor.value > sensor.normalMax
          ? ((sensor.value - sensor.normalMax) / span) * 100
          : ((sensor.normalMin - sensor.value) / span) * 100

      status = riskLevelFromScore(
        clamp(20 + deviation, 20, 99),
      )
    } else if (
      sensor.value >
      sensor.normalMin +
        (sensor.normalMax - sensor.normalMin) * 0.85
    ) {
      status = 'low'
    }

    return {
      id: sensor.id,
      label: sensor.id,
      value: sensor.value,
      unit: sensor.unit,
      status,
      trend,
      history,
    }
  })
}

function buildOverview(
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  zones: ZoneState[],
): PlantOverviewStats {
  return {
    totalAssets: equipment.length,
    activeSensors: sensors.length,
    activePermits: zones.reduce(
      (sum, zone) => sum + zone.activePermits,
      0,
    ),
    onSiteWorkers: equipment.reduce(
      (sum, item) => sum + item.workersNearby,
      0,
    ),
    openIncidents: equipment.filter(
      (item) => item.status === 'Critical',
    ).length,
  }
}

function buildRiskSummary(
  scores: RiskScores,
  equipment: PlantEquipment[],
): string {
  const reactor = equipment.find(
    (item) => item.id === 'R-101',
  )

  const level = riskLevelFromScore(scores.cri)

  if (level === 'critical') {
    return `High temperature trend detected in Reactor Unit (${reactor?.id ?? 'R-101'}). Immediate mitigation and supervisory intervention required.`
  }

  if (level === 'high') {
    return `Elevated process risk across active zones. Reactor ${reactor?.id ?? 'R-101'} requires immediate supervisory review.`
  }

  if (level === 'medium') {
    return `Moderate operational risk detected across active plant conditions. Continue enhanced monitoring and review active contributors.`
  }

  return 'Plant operating within monitored safety thresholds. Continue active surveillance.'
}

function mapRiskScores(risk: RiskResponse): RiskScores {
  return {
    cri: Math.round(clamp(risk.cri, 0, 100)),
    pri: Math.round(clamp(risk.pri, 0, 100)),
    eri: Math.round(clamp(risk.eri, 0, 100)),
    sri: Math.round(clamp(risk.sri, 0, 100)),
  }
}

function mapRiskContributors(
  contributors: RiskResponse['contributors'],
): RiskContributor[] {
  return contributors.map((item, index) => {
    const impact = clamp(item.score, 0, 100)

    return {
      id: `backend-contributor-${index}-${item.factor
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}`,
      factor: item.factor,
      impact,
      trend:
        impact >= 60
          ? 'up'
          : impact <= 25
            ? 'down'
            : 'flat',
      value: Math.round(impact),
    }
  })
}

function mapRiskRecommendations(
  recommendations: RiskResponse['recommendations'],
): RiskRecommendation[] {
  return recommendations.map((item, index) => {
    const priorityText = item.priority.toLowerCase()

    const severity: RiskLevel =
      priorityText === 'critical'
        ? 'critical'
        : priorityText === 'high'
          ? 'high'
          : priorityText === 'medium'
            ? 'medium'
            : 'low'

    const priority =
      severity === 'critical'
        ? 1
        : severity === 'high'
          ? 2
          : severity === 'medium'
            ? 3
            : 4

    return {
      id: `backend-recommendation-${index}`,
      priority,
      severity,
      title: item.action,
      detail: item.reason,
      executionTime:
        severity === 'critical'
          ? 'Immediate'
          : severity === 'high'
            ? '5 min'
            : severity === 'medium'
              ? '10 min'
              : '15 min',
      riskReduction:
        severity === 'critical'
          ? 18
          : severity === 'high'
            ? 12
            : severity === 'medium'
              ? 8
              : 5,
      status:
        severity === 'critical'
          ? 'ready'
          : 'queued',
    }
  })
}

function applyRiskUpdate(
  risk: RiskUpdate['risk'],
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  zones: ZoneState[],
  previousHistory: RiskTrendPoint[],
) {
  const riskScores = mapRiskScores(risk)

  const riskContributors = mapRiskContributors(
    risk.contributors,
  )

  const recommendations = mapRiskRecommendations(
    risk.recommendations,
  )

  const explanation = buildExplanation(
    riskScores,
    equipment,
    sensors,
    zones,
    riskContributors,
  )

  const patternMatch = matchHistoricalIncident(
    equipment,
    sensors,
    zones,
    riskContributors,
  )

  const forecast = buildForecast(
    riskScores,
    equipment,
    sensors,
  )

  const now = Date.now()

  const nextHistory = [
    ...previousHistory.slice(-47),
    {
      timestamp: now,
      cri: riskScores.cri,
      pri: riskScores.pri,
      eri: riskScores.eri,
    },
  ]

  return {
    riskScores,
    riskSummary: buildRiskSummary(
      riskScores,
      equipment,
    ),
    riskContributors,
    recommendations,
    explanation,
    patternMatch,
    forecast,
    riskTrendHistory: nextHistory,
    sensorSnapshot: buildSensorSnapshot(sensors),
    overview: buildOverview(
      equipment,
      sensors,
      zones,
    ),
  }
}

function updateSensorFromTelemetry(
  sensors: PlantSensor[],
  telemetry: TelemetryUpdate,
  sensorCodeByBackendId: Record<number, string>,
): PlantSensor[] {
  if (telemetry.readings.length === 0) {
    return sensors
  }

  const readingsByCode = new Map<string, number>()

  for (const reading of telemetry.readings) {
    const code =
      sensorCodeByBackendId[reading.sensor_id]

    if (code !== undefined) {
      readingsByCode.set(code, reading.value)
    }
  }

  if (readingsByCode.size === 0) {
    return sensors
  }

  return sensors.map((sensor) => {
    const nextValue = readingsByCode.get(sensor.id)

    if (nextValue === undefined) {
      return sensor
    }

    return {
      ...sensor,
      value: nextValue,
      history: [
        ...sensor.history,
        nextValue,
      ].slice(-24),
    }
  })
}

function updateEquipmentFromSensors(
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
): PlantEquipment[] {
  return equipment.map((item) => {
    const equipmentSensors = sensors.filter(
      (sensor) => sensor.equipmentId === item.id,
    )

    if (equipmentSensors.length === 0) {
      return item
    }

    const next = { ...item }

    for (const sensor of equipmentSensors) {
      switch (sensor.type) {
        case 'temperature':
          next.temperature = sensor.value
          break

        case 'pressure':
          next.pressure = sensor.value
          break

        case 'flow':
          next.flow = sensor.value
          break

        case 'vibration':
          next.vibration = sensor.value
          break

        case 'gas':
          next.gas = sensor.value
          break

        case 'humidity':
          next.humidity = sensor.value
          break
      }
    }

    return next
  })
}

function applyTelemetryUpdate(
  telemetry: TelemetryUpdate,
  sensors: PlantSensor[],
  equipment: PlantEquipment[],
  sensorCodeByBackendId: Record<number, string>,
) {
  const updatedSensors = updateSensorFromTelemetry(
    sensors,
    telemetry,
    sensorCodeByBackendId,
  )

  const updatedEquipment = updateEquipmentFromSensors(
    equipment,
    updatedSensors,
  )

  return {
    sensors: updatedSensors,
    equipment: updatedEquipment,
  }
}

export const usePlantStore = create<PlantStore>(
  (set, get) => {
    let disconnectRealtime:
      (() => void) | null = null

    const handleRealtimeMessage = (
      message: RealtimeMessage,
    ) => {
      const state = get()

      if (message.type === 'telemetry_update') {
        const updated = applyTelemetryUpdate(
          message,
          state.sensors,
          state.equipment,
          state.sensorCodeByBackendId,
        )
        const updatedZones = state.zones.map((zone) => ({
          ...zone,
          riskScore: calculateZoneRiskScore(
            zone.backendRiskLevel,
            zone.id,
            updated.equipment,
            updated.sensors,
          ),
        }))

        set({
          sensors: updated.sensors,
          equipment: updated.equipment,
          zones: updatedZones,
          sensorSnapshot: buildSensorSnapshot(
            updated.sensors,
          ),
          overview: buildOverview(
            updated.equipment,
            updated.sensors,
            updatedZones,
          ),
          backendConnected: true,
          backendError: null,
        })

        return
      }

      const derived = applyRiskUpdate(
        message.risk,
        state.equipment,
        state.sensors,
        state.zones,
        state.riskTrendHistory,
      )

      set({
        ...derived,
        backendConnected: true,
        backendError: null,
      })
    }

    const connectBackendRealtime = () => {
      if (disconnectRealtime !== null) {
        disconnectRealtime()
        disconnectRealtime = null
      }

      disconnectRealtime = connectRealtime({
        onOpen: () => {
          set({
            backendConnected: true,
            backendError: null,
          })
        },

        onMessage: handleRealtimeMessage,

        onClose: () => {
          set({
            backendConnected: false,
          })
        },

        onError: () => {
          set({
            backendConnected: false,
            backendError:
              'Realtime connection error.',
          })
        },
      })
    }

    return {
      simulationMode: false,
      plantName: 'Jamnagar Refinery',

      equipment: [],
      sensors: [],
      zones: [],

      telemetryContext: {
        weatherWind: 10,
        shiftFatigue: 35,
      },

      riskScores: {
        cri: 0,
        pri: 0,
        eri: 0,
        sri: 0,
      },

      riskSummary: '',
      riskContributors: [],
      recommendations: [],

      explanation: {
        text: '',
        confidence: 0,
        evidence: [],
      },

      patternMatch: {
        incident: {
          id: '',
          title: '',
          description: '',
          similarityFactors: [],
          outcome: '',
          downtime: '',
          totalLoss: '',
          injuries: 0,
          tags: [],
        },
        similarity: 0,
        matchedFactors: [],
      },

      forecast: {
        status: 'low',
        probability: 0,
        timeToCriticalMinutes: 0,
        points: [],
      },

      riskTrendHistory: [],
      sensorSnapshot: [],

      overview: {
        totalAssets: 0,
        activeSensors: 0,
        activePermits: 0,
        onSiteWorkers: 0,
        openIncidents: 0,
      },

      selectedZoneId: null,
      selectedEquipmentId: null,
      selectedSensorId: null,

      showSensors: false,
      cameraView: '3d',
      heatMapMode: 'heat',
      zoneFilter: 'All Zones',

      isLoading: false,
      backendConnected: false,
      backendError: null,

      sensorCodeByBackendId: {},

      initialize: async () => {
        const state = get()

        if (state.isLoading) {
          return
        }

        set({
          isLoading: true,
          backendError: null,
        })

        try {
          const data = await loadPlantData()

          const equipment = data.equipment
          const sensors = data.sensors

          const zones: ZoneState[] =
            data.zones.map((zone) => ({
              ...zone,
              riskScore: zone.riskScore,
              backendRiskLevel: zone.backendRiskLevel,
            }))

          const derived = applyRiskUpdate(
            data.risk,
            equipment,
            sensors,
            zones,
            [],
          )

          set({
            plantName: data.plant.name,

            equipment,
            sensors,
            zones,

            riskScores: derived.riskScores,
            riskSummary: derived.riskSummary,
            riskContributors:
              derived.riskContributors,
            recommendations:
              derived.recommendations,

            explanation: derived.explanation,
            patternMatch: derived.patternMatch,
            forecast: derived.forecast,

            riskTrendHistory:
              derived.riskTrendHistory,
            sensorSnapshot:
              derived.sensorSnapshot,
            overview: derived.overview,

            sensorCodeByBackendId:
              data.sensorCodeByBackendId,

            isLoading: false,
            backendConnected: false,
            backendError: null,
          })

          connectBackendRealtime()
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to load SAFE-AI plant data.'

          set({
            isLoading: false,
            backendConnected: false,
            backendError: message,
          })

          console.error(
            'Failed to initialize SAFE-AI backend state:',
            error,
          )
        }
      },

      tickTelemetry: () => {
        // Backend telemetry simulator is authoritative.
        // Live telemetry arrives through WebSocket.
      },

      recalculateRisk: () => {
        // Backend risk engine is authoritative.
        // Live risk arrives through WebSocket.
      },

      selectZone: (zoneId) => {
        set({
          selectedZoneId: zoneId,
          selectedEquipmentId: null,
          selectedSensorId: null,
          zoneFilter:
            zoneId ?? 'All Zones',
        })
      },

      selectEquipment: (equipmentId) => {
        const state = get()

        const equipment =
          state.equipment.find(
            (item) => item.id === equipmentId,
          )

        set({
          selectedEquipmentId: equipmentId,
          selectedZoneId:
            equipment?.zoneId ??
            state.selectedZoneId,
          selectedSensorId: null,
          zoneFilter:
            equipment?.zoneId ??
            state.zoneFilter,
        })
      },

      selectSensor: (sensorId) => {
        set({
          selectedSensorId: sensorId,
        })
      },

      setShowSensors: (value) => {
        set({
          showSensors: value,
        })
      },

      setCameraView: (view) => {
        set({
          cameraView: view,
        })
      },

      setHeatMapMode: (mode) => {
        set({
          heatMapMode: mode,
        })
      },

      setZoneFilter: (zoneId) => {
        set({
          zoneFilter: zoneId,
          selectedZoneId:
            zoneId === 'All Zones'
              ? null
              : zoneId,
          selectedEquipmentId: null,
          selectedSensorId: null,
        })
      },
    }
  },
)
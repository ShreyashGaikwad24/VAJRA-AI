import { create } from 'zustand'

import { PLANT_EQUIPMENT } from '@/data/plant/equipment'
import { PLANT_SENSORS } from '@/data/plant/sensors'
import { PLANT_ZONES } from '@/data/plant/zones'
import type {
  AIExplanation,
  ForecastState,
  PatternMatch,
  PlantEquipment,
  PlantOverviewStats,
  PlantSensor,
  RiskContributor,
  RiskRecommendation,
  RiskScores,
  RiskTrendPoint,
  SensorSnapshot,
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
  riskSummaryText,
} from '@/modules/situationRoom/services/riskEngine'
import {
  advanceTelemetry,
  createTelemetryContext,
  type TelemetryContext,
} from '@/modules/situationRoom/services/telemetrySimulator'

export type ZoneState = (typeof PLANT_ZONES)[number] & { riskScore: number }

export type AppModule = 'Dashboard' | 'Digital Twin' | 'Situation Room' | 'Decision Simulation' | 'AI Copilot'

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
  initialize: () => void
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

function buildSensorSnapshot(sensors: PlantSensor[], context: TelemetryContext): SensorSnapshot[] {
  const temp = sensors.find((sensor) => sensor.type === 'temperature' && sensor.equipmentId === 'R-101')
  const pressure = sensors.find((sensor) => sensor.type === 'pressure' && sensor.equipmentId === 'R-101')
  const gas = sensors.find((sensor) => sensor.type === 'gas')
  const vibration = sensors.find((sensor) => sensor.type === 'vibration')
  const humidity = sensors.find((sensor) => sensor.type === 'humidity')

  const trend = (history: number[]) => {
    const last = history[history.length - 1] ?? 0
    const prev = history[history.length - 4] ?? last
    if (last > prev + 0.2) return 'up' as const
    if (last < prev - 0.2) return 'down' as const
    return 'flat' as const
  }

  return [
    {
      id: 'snap-temp',
      label: 'Temperature',
      value: temp?.value ?? 0,
      unit: '°C',
      status: riskLevelFromScore(((temp?.value ?? 0) - 300) / 1.5),
      trend: trend(temp?.history ?? []),
      history: temp?.history ?? [],
    },
    {
      id: 'snap-pressure',
      label: 'Pressure',
      value: pressure?.value ?? 0,
      unit: 'bar',
      status: riskLevelFromScore(((pressure?.value ?? 0) - 10) * 8),
      trend: trend(pressure?.history ?? []),
      history: pressure?.history ?? [],
    },
    {
      id: 'snap-gas',
      label: 'Gas Leak',
      value: gas?.value ?? 0,
      unit: '% LEL',
      status: riskLevelFromScore((gas?.value ?? 0) * 1.05),
      trend: trend(gas?.history ?? []),
      history: gas?.history ?? [],
    },
    {
      id: 'snap-vibration',
      label: 'Vibration',
      value: vibration?.value ?? 0,
      unit: 'mm/s',
      status: riskLevelFromScore((vibration?.value ?? 0) * 24),
      trend: trend(vibration?.history ?? []),
      history: vibration?.history ?? [],
    },
    {
      id: 'snap-humidity',
      label: 'Humidity',
      value: humidity?.value ?? 0,
      unit: '%',
      status: riskLevelFromScore(Math.abs((humidity?.value ?? 0) - 45) * 1.2),
      trend: trend(humidity?.history ?? []),
      history: humidity?.history ?? [],
    },
    {
      id: 'snap-wind',
      label: 'Wind Speed',
      value: context.weatherWind,
      unit: 'km/h',
      status: riskLevelFromScore(context.weatherWind * 2.2),
      trend: context.weatherWind > 12 ? 'up' : 'flat',
      history: Array.from({ length: 24 }, (_, index) => context.weatherWind + Math.sin(index / 4) * 0.8),
    },
  ]
}

function buildOverview(equipment: PlantEquipment[], sensors: PlantSensor[], zones: ZoneState[]): PlantOverviewStats {
  return {
    totalAssets: 1248,
    activeSensors: sensors.length,
    activePermits: zones.reduce((sum, zone) => sum + zone.activePermits, 0),
    onSiteWorkers: equipment.reduce((sum, item) => sum + item.workersNearby, 0),
    openIncidents: equipment.filter((item) => item.status === 'Critical').length + 1,
  }
}

function deriveState(
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  zonesBase: typeof PLANT_ZONES,
  context: TelemetryContext,
  selectedZoneId: string | null,
  selectedEquipmentId: string | null,
) {
  const zones: ZoneState[] = zonesBase.map((zone) => ({
    ...zone,
    riskScore: Math.round(computeZoneRisk(zone, equipment, sensors)),
  }))

  const riskScores = computeRiskScores(zones, equipment, sensors, context.weatherWind, context.shiftFatigue)
  const riskContributors = computeRiskContributors(zones, equipment, sensors, context.weatherWind, context.shiftFatigue)
  const recommendations = buildRecommendations(riskScores, equipment, sensors, zones)
  const explanation = buildExplanation(riskScores, equipment, sensors, zones, riskContributors)
  const patternMatch = matchHistoricalIncident(equipment, sensors, zones, riskContributors)
  const forecast = buildForecast(riskScores, equipment, sensors)

  return {
    zones,
    riskScores,
    riskSummary: riskSummaryText(riskScores, equipment),
    riskContributors,
    recommendations,
    explanation,
    patternMatch,
    forecast,
    sensorSnapshot: buildSensorSnapshot(sensors, context),
    overview: buildOverview(equipment, sensors, zones),
    selectedZoneId,
    selectedEquipmentId,
  }
}

export const usePlantStore = create<PlantStore>((set, get) => ({
  simulationMode: true,
  plantName: 'Jamnagar Refinery',
  equipment: structuredClone(PLANT_EQUIPMENT),
  sensors: structuredClone(PLANT_SENSORS),
  zones: [],
  telemetryContext: createTelemetryContext(),
  riskScores: { cri: 0, pri: 0, eri: 0, sri: 0 },
  riskSummary: '',
  riskContributors: [],
  recommendations: [],
  explanation: { text: '', confidence: 0, evidence: [] },
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
  forecast: { status: 'high', probability: 0, timeToCriticalMinutes: 0, points: [] },
  riskTrendHistory: [],
  sensorSnapshot: [],
  overview: { totalAssets: 0, activeSensors: 0, activePermits: 0, onSiteWorkers: 0, openIncidents: 0 },
  selectedZoneId: null,
  selectedEquipmentId: null,
  selectedSensorId: null,
  showSensors: false,
  cameraView: '3d',
  heatMapMode: 'heat',
  zoneFilter: 'All Zones',

  initialize: () => {
    const equipment = structuredClone(PLANT_EQUIPMENT)
    const sensors = structuredClone(PLANT_SENSORS)
    const context = createTelemetryContext()
    const derived = deriveState(equipment, sensors, PLANT_ZONES, context, null, null)
    const now = Date.now()
    set({
      equipment,
      sensors,
      telemetryContext: context,
      ...derived,
      riskTrendHistory: [{ timestamp: now, cri: derived.riskScores.cri, pri: derived.riskScores.pri, eri: derived.riskScores.eri }],
    })
  },

  tickTelemetry: () => {
    const state = get()
    const advanced = advanceTelemetry(state.equipment, state.sensors, state.telemetryContext)
    const derived = deriveState(
      advanced.equipment,
      advanced.sensors,
      PLANT_ZONES,
      advanced.context,
      state.selectedZoneId,
      state.selectedEquipmentId,
    )
    set({
      equipment: advanced.equipment,
      sensors: advanced.sensors,
      telemetryContext: advanced.context,
      ...derived,
    })
  },

  recalculateRisk: () => {
    const state = get()
    const derived = deriveState(
      state.equipment,
      state.sensors,
      PLANT_ZONES,
      state.telemetryContext,
      state.selectedZoneId,
      state.selectedEquipmentId,
    )
    const now = Date.now()
    set({
      ...derived,
      riskTrendHistory: [
        ...state.riskTrendHistory.slice(-47),
        {
          timestamp: now,
          cri: derived.riskScores.cri,
          pri: derived.riskScores.pri,
          eri: derived.riskScores.eri,
        },
      ],
    })
  },

  selectZone: (zoneId) => {
    const state = get()
    set({
      selectedZoneId: zoneId,
      selectedEquipmentId: null,
      selectedSensorId: null,
      zoneFilter: zoneId ?? 'All Zones',
    })
    state.recalculateRisk()
  },

  selectEquipment: (equipmentId) => {
    const state = get()
    const equipment = state.equipment.find((item) => item.id === equipmentId)
    set({
      selectedEquipmentId: equipmentId,
      selectedZoneId: equipment?.zoneId ?? state.selectedZoneId,
      selectedSensorId: null,
    })
    state.recalculateRisk()
  },

  selectSensor: (sensorId) => set({ selectedSensorId: sensorId }),

  setShowSensors: (value) => set({ showSensors: value }),
  setCameraView: (view) => set({ cameraView: view }),
  setHeatMapMode: (mode) => set({ heatMapMode: mode }),
  setZoneFilter: (zoneId) => {
    get().selectZone(zoneId === 'All Zones' ? null : zoneId)
  },
}))

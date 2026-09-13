
import { api } from './api'

type ListResponse<T> = {
  value: T[]
  Count: number
}

export interface Plant {
  id: number
  name: string
  code: string
  location?: string | null
  description?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Zone {
  id: number
  plant_id: number
  name: string
  code: string
  description?: string | null
  risk_level: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Equipment {
  id: number
  zone_id: number
  name: string
  code: string
  equipment_type: string
  status: string
  health_score: number
  temperature?: number | null
  pressure?: number | null
  flow_rate?: number | null
  vibration?: number | null
  gas_level?: number | null
  humidity?: number | null
  workers_nearby: number
  maintenance_overdue: boolean
  root_cause?: string | null
  recommendation?: string | null
  created_at: string
  updated_at: string
}

export interface Sensor {
  id: number
  zone_id: number
  equipment_id?: number | null
  name: string
  code: string
  sensor_type: string
  unit: string
  current_value?: number | null
  normal_min?: number | null
  normal_max?: number | null
  is_active: boolean
  last_reading_at?: string | null
  created_at: string
  updated_at: string
}

export interface TelemetryReading {
  id: number
  sensor_id: number
  timestamp: string
  value: number
  quality: string
}

export interface RiskContributor {
  factor: string
  score: number
  severity: string
  explanation: string
}

export interface RiskRecommendation {
  priority: string
  action: string
  reason: string
}

export interface RiskResponse {
  cri: number
  pri: number
  eri: number
  sri: number
  overall_risk: number
  risk_level: string
  contributors: RiskContributor[]
  recommendations: RiskRecommendation[]
}

export interface RiskSnapshot {
  id: number
  timestamp: string
  cri: number
  pri: number
  eri: number
  sri: number
  overall_risk: number
  risk_level: string
}

export interface SimulationScenarioResponse {
  scenario: 'normal' | 'warning' | 'critical'
  scenario_step: number
}

async function getList<T>(path: string): Promise<T[]> {
  const response = await api.get<T[] | ListResponse<T>>(path)

  if (Array.isArray(response)) {
    return response
  }

  if (
    response &&
    typeof response === 'object' &&
    Array.isArray(response.value)
  ) {
    return response.value
  }

  throw new Error(
    `Invalid list response received from SAFE-AI API: ${path}`,
  )
}

export const plantApi = {
  getPlants(): Promise<Plant[]> {
    return getList<Plant>('/api/plants')
  },

  getPlant(plantId: number): Promise<Plant> {
    return api.get<Plant>(`/api/plants/${plantId}`)
  },

  getZones(plantId: number): Promise<Zone[]> {
    return getList<Zone[] extends never ? never : Zone>(
      `/api/zones?plant_id=${plantId}`,
    )
  },

  getEquipment(zoneId: number): Promise<Equipment[]> {
    return getList<Equipment>(
      `/api/equipment?zone_id=${zoneId}`,
    )
  },

  getSensors(
    zoneId: number,
    equipmentId?: number,
  ): Promise<Sensor[]> {
    const params = new URLSearchParams()

    params.set('zone_id', String(zoneId))

    if (equipmentId !== undefined) {
      params.set('equipment_id', String(equipmentId))
    }

    return getList<Sensor>(
      `/api/sensors?${params.toString()}`,
    )
  },

  getTelemetry(
    sensorId: number,
    limit = 100,
  ): Promise<TelemetryReading[]> {
    return getList<TelemetryReading>(
      `/api/telemetry?sensor_id=${sensorId}&limit=${limit}`,
    )
  },

  getRisk(): Promise<RiskResponse> {
    return api.get<RiskResponse>('/api/risk')
  },

  getRiskHistory(limit = 100): Promise<RiskSnapshot[]> {
    return getList<RiskSnapshot>(
      `/api/risk/history?limit=${limit}`,
    )
  },

  getSimulationScenario(): Promise<SimulationScenarioResponse> {
    return api.get<SimulationScenarioResponse>(
      '/api/simulation/scenario',
    )
  },

  setSimulationScenario(
    scenario: SimulationScenarioResponse['scenario'],
  ): Promise<SimulationScenarioResponse> {
    return api.post<SimulationScenarioResponse>(
      '/api/simulation/scenario',
      { scenario },
    )
  },
}
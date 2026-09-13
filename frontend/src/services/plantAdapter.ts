import type {
  Equipment,
  Plant,
  Sensor,
  Zone,
} from './plantApi'

import { PLANT_EQUIPMENT } from '@/data/plant/equipment'
import { PLANT_SENSORS } from '@/data/plant/sensors'
import { PLANT_ZONES } from '@/data/plant/zones'

import type {
  PlantEquipment,
  PlantSensor,
  PlantZone,
  RiskLevel,
} from '@/data/plant/types'

type BackendPlantData = {
  plant: Plant
  zones: Zone[]
  equipment: Equipment[]
  sensors: Sensor[]
}

function normalizeRiskLevel(value: string): RiskLevel {
  const normalized = value.toLowerCase()

  if (
    normalized === 'critical' ||
    normalized === 'high' ||
    normalized === 'medium' ||
    normalized === 'low' ||
    normalized === 'safe'
  ) {
    return normalized
  }

  if (normalized === 'warning') {
    return 'medium'
  }

  if (normalized === 'normal' || normalized === 'healthy') {
    return 'safe'
  }

  return 'low'
}

function normalizeZoneCode(code: string) {
  return code.replace(/-/g, ' ').toUpperCase()
}

function findVisualEquipment(code: string) {
  return PLANT_EQUIPMENT.find((equipment) => equipment.id === code)
}

function findVisualSensor(code: string) {
  return PLANT_SENSORS.find((sensor) => sensor.id === code)
}

function findVisualZone(code: string) {
  const normalizedCode = normalizeZoneCode(code)
  return PLANT_ZONES.find((zone) => normalizeZoneCode(zone.id) === normalizedCode)
}

function buildSensorHistory(sensor: Sensor, telemetryHistory?: number[]): number[] {
  if (telemetryHistory && telemetryHistory.length > 0) return telemetryHistory
  const currentValue = sensor.current_value ?? 0
  return Array.from({ length: 24 }, (_, index) => currentValue + Math.sin(index / 4) * Math.max(Math.abs(currentValue) * 0.01, 0.01))
}

export function adaptEquipment(equipment: Equipment[]): PlantEquipment[] {
  return equipment.map((item) => {
    const visual = findVisualEquipment(item.code)
    return {
      id: item.code, name: item.name, type: item.equipment_type,
      zoneId: visual?.zoneId ?? '', status: (item.status || 'Healthy') as PlantEquipment['status'],
      health: item.health_score, position: visual?.position ?? { x: 0, y: 0, z: 0 }, scale: visual?.scale ?? { x: 1, y: 1, z: 1 },
      temperature: item.temperature ?? 0, pressure: item.pressure ?? 0, flow: item.flow_rate ?? 0, gas: item.gas_level ?? 0, humidity: item.humidity ?? 0, vibration: item.vibration ?? 0,
      workersNearby: item.workers_nearby, maintenanceOverdue: item.maintenance_overdue, rootCause: item.root_cause ?? '', recommendation: item.recommendation ?? '', failureWindow: visual?.failureWindow ?? 'Monitoring', failureProbability: visual?.failureProbability ?? 0,
    }
  })
}

export function adaptSensors(sensors: Sensor[], telemetryHistory: Map<number, number[]> = new Map()): PlantSensor[] {
  return sensors.map((sensor) => {
    const visual = findVisualSensor(sensor.code)
    return {
      id: sensor.code, type: sensor.sensor_type as PlantSensor['type'], zoneId: visual?.zoneId ?? '',
      equipmentId: visual?.equipmentId ?? findVisualEquipmentForBackendSensor(sensor, sensors), position: visual?.position ?? { x: 0, y: 0, z: 0 }, value: sensor.current_value ?? 0, unit: sensor.unit,
      normalMin: sensor.normal_min ?? 0, normalMax: sensor.normal_max ?? 100, history: buildSensorHistory(sensor, telemetryHistory.get(sensor.id)),
    }
  })
}

function findVisualEquipmentForBackendSensor(
  sensor: Sensor,
  sensors: Sensor[],
): string {
  const visualSensor = PLANT_SENSORS.find(
    (item) => item.id === sensor.code,
  )

  if (visualSensor?.equipmentId) {
    return visualSensor.equipmentId
  }

  const sameEquipmentSensor = sensors.find(
    (item) =>
      item.equipment_id === sensor.equipment_id &&
      item.id !== sensor.id,
  )

  if (sameEquipmentSensor) {
    const matchingVisualSensor = PLANT_SENSORS.find(
      (item) => item.id === sameEquipmentSensor.code,
    )

    if (matchingVisualSensor?.equipmentId) {
      return matchingVisualSensor.equipmentId
    }
  }

  return ''
}

export function adaptZones(
  zones: Zone[],
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
): Array<PlantZone & { riskScore: number; backendRiskLevel: string }> {
  return zones.map((zone) => {
    const visual = findVisualZone(zone.code)
    const zoneId = visual?.id ?? zone.code
    const riskScore = calculateZoneRiskScore(zone.risk_level, zoneId, equipment, sensors)

    return {
      id: zoneId,
      name: visual?.name ?? zone.name,
      label: visual?.label ?? zone.name,
      description: zone.description ?? visual?.description ?? '',
      position: visual?.position ?? { x: 0, y: 0, z: 0 },
      size: visual?.size ?? { width: 5, depth: 5 },
      baseCri: visual?.baseCri ?? riskScore,
      hotWorkActive: visual?.hotWorkActive ?? false,
      activePermits: visual?.activePermits ?? 0,
      riskScore,
      backendRiskLevel: zone.risk_level,
    }
  })
}

export function calculateZoneRiskScore(
  backendRiskLevel: string,
  zoneId: string,
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
) {
  const zoneEquipment = equipment.filter((item) => normalizeZoneCode(item.zoneId) === normalizeZoneCode(zoneId))
  const zoneSensors = sensors.filter((sensor) => normalizeZoneCode(sensor.zoneId) === normalizeZoneCode(zoneId))
  const equipmentRisk = zoneEquipment.length
    ? zoneEquipment.reduce((sum, item) => sum + Math.max(0, Math.min(100, 100 - item.health)), 0) / zoneEquipment.length
    : 0
  const sensorRisk = zoneSensors.length
    ? zoneSensors.reduce((sum, sensor) => {
        const range = sensor.normalMax - sensor.normalMin
        if (range <= 0) return sum
        const deviation = sensor.value > sensor.normalMax
          ? ((sensor.value - sensor.normalMax) / range) * 100
          : sensor.value < sensor.normalMin
            ? ((sensor.normalMin - sensor.value) / range) * 100
            : 0
        return sum + Math.min(100, deviation)
      }, 0) / zoneSensors.length
    : 0
  const backendRisk = normalizeRiskLevel(backendRiskLevel) === 'critical'
    ? 80
    : normalizeRiskLevel(backendRiskLevel) === 'high'
      ? 65
      : normalizeRiskLevel(backendRiskLevel) === 'medium'
        ? 45
        : normalizeRiskLevel(backendRiskLevel) === 'low'
          ? 25
          : 10
  return Math.round(Math.min(100, backendRisk * 0.5 + equipmentRisk * 0.3 + sensorRisk * 0.2))
}

export function adaptPlantData(
  data: BackendPlantData,
  telemetryHistory: Map<number, number[]> = new Map(),
) {
  const equipment = adaptEquipment(data.equipment)
  const sensors = adaptSensors(data.sensors, telemetryHistory)
  const zones = adaptZones(data.zones, equipment, sensors)

  return {
    plant: data.plant,
    equipment,
    sensors,
    zones,
  }
}
import type {
  PlantEquipment,
  PlantSensor,
  PlantZone,
  RiskContributor,
  RiskLevel,
  RiskScores,
  TrendDirection,
} from '@/data/plant/types'
import { riskLevelFromScore } from '@/data/plant/types'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function trendFromDelta(delta: number): TrendDirection {
  if (delta > 0.4) return 'up'
  if (delta < -0.4) return 'down'
  return 'flat'
}

export function computeZoneRisk(
  zone: PlantZone,
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
): number {
  const zoneEquipment = equipment.filter((item) => item.zoneId === zone.id)
  const zoneSensors = sensors.filter((item) => item.zoneId === zone.id)

  const equipmentRisk =
    zoneEquipment.reduce((sum, item) => {
      const statusWeight =
        item.status === 'Critical' ? 95 : item.status === 'Warning' ? 70 : item.status === 'Maintenance' ? 55 : item.status === 'Offline' ? 40 : 20
      const telemetryRisk =
        (item.temperature > 350 ? 25 : item.temperature > 200 ? 12 : 0) +
        (item.gas > 30 ? 20 : item.gas > 15 ? 10 : 0) +
        item.vibration * 8 +
        item.failureProbability * 30
      return sum + statusWeight * 0.35 + telemetryRisk * 0.65
    }, 0) / Math.max(zoneEquipment.length, 1)

  const sensorRisk =
    zoneSensors.reduce((sum, sensor) => {
      const span = sensor.normalMax - sensor.normalMin
      const ratio = span > 0 ? (sensor.value - sensor.normalMin) / span : 0
      return sum + clamp(ratio, 0, 1.4) * 55
    }, 0) / Math.max(zoneSensors.length, 1)

  const permitRisk = zone.activePermits * 1.8
  const hotWorkRisk = zone.hotWorkActive ? 18 : 0

  return clamp(zone.baseCri * 0.18 + equipmentRisk * 0.52 + sensorRisk * 0.2 + permitRisk + hotWorkRisk, 5, 99)
}

export function computeRiskScores(
  zones: Array<PlantZone & { riskScore: number }>,
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  weatherWind: number,
  shiftFatigue: number,
): RiskScores {
  const cri = clamp(
    zones.reduce((max, zone) => Math.max(max, zone.riskScore), 0) * 0.92 +
      equipment.filter((item) => item.status === 'Critical').length * 4,
    8,
    99,
  )

  const reactor = equipment.find((item) => item.id === 'R-101')
  const tempTrend = reactor ? (reactor.temperature - 380) / 80 : 0
  const gasTrend =
    sensors.filter((sensor) => sensor.type === 'gas').reduce((sum, sensor) => sum + sensor.value, 0) /
    Math.max(sensors.filter((sensor) => sensor.type === 'gas').length, 1)

  const pri = clamp(cri * 0.72 + tempTrend * 18 + gasTrend * 0.45 + shiftFatigue * 0.12, 8, 99)

  const exposureWorkers = equipment.reduce((sum, item) => sum + item.workersNearby, 0)
  const eri = clamp(exposureWorkers * 0.08 + zones.filter((zone) => zone.hotWorkActive).length * 12 + weatherWind * 0.35, 8, 99)

  const maintenancePenalty = equipment.filter((item) => item.maintenanceOverdue).length * 7
  const healthyRatio =
    equipment.filter((item) => item.status === 'Healthy').length / Math.max(equipment.length, 1)
  const sri = clamp(88 - maintenancePenalty - cri * 0.18 + healthyRatio * 18, 8, 99)

  return {
    cri: Math.round(cri),
    pri: Math.round(pri),
    eri: Math.round(eri),
    sri: Math.round(sri),
  }
}

export function computeRiskContributors(
  zones: Array<PlantZone & { riskScore: number }>,
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  weatherWind: number,
  shiftFatigue: number,
): RiskContributor[] {
  const reactor = equipment.find((item) => item.id === 'R-101')
  const pipeline = equipment.find((item) => item.id === 'PJ-114')
  const pump = equipment.find((item) => item.id === 'PS-023')
  const hotZone = zones.find((zone) => zone.id === 'ZONE C')

  const gasSensor = sensors.find((sensor) => sensor.type === 'gas' && sensor.equipmentId === 'PJ-114')
  const gasValue = gasSensor?.value ?? pipeline?.gas ?? 0

  const contributors: RiskContributor[] = [
    {
      id: 'temp-reactor',
      factor: `High Temp. in Reactor ${reactor?.id ?? 'R-101'}`,
      impact: clamp(((reactor?.temperature ?? 0) - 300) / 1.4, 20, 99),
      trend: trendFromDelta((reactor?.temperature ?? 0) - 400),
      value: Math.round(reactor?.temperature ?? 0),
      zoneId: 'ZONE C',
      equipmentId: 'R-101',
    },
    {
      id: 'gas-leak',
      factor: 'Gas Leak Probability',
      impact: clamp(gasValue * 1.05, 15, 99),
      trend: trendFromDelta(gasValue - 30),
      value: Math.round(gasValue),
      zoneId: 'ZONE B',
      equipmentId: 'PJ-114',
    },
    {
      id: 'hot-work',
      factor: 'Hot Work Activity',
      impact: hotZone?.hotWorkActive ? clamp(hotZone.riskScore, 40, 95) : 18,
      trend: hotZone?.hotWorkActive ? 'up' : 'flat',
      value: hotZone?.activePermits ?? 0,
      zoneId: 'ZONE C',
    },
    {
      id: 'permit-deviation',
      factor: 'Permit Deviation',
      impact: clamp(zones.reduce((sum, zone) => sum + zone.activePermits, 0) * 1.4, 20, 90),
      trend: 'up',
      value: zones.reduce((sum, zone) => sum + zone.activePermits, 0),
    },
    {
      id: 'vibration',
      factor: 'Equipment Vibration',
      impact: clamp((pump?.vibration ?? 0) * 22, 15, 92),
      trend: trendFromDelta((pump?.vibration ?? 0) - 2.5),
      value: Math.round(((pump?.vibration ?? 0) + Number.EPSILON) * 10) / 10,
      equipmentId: 'PS-023',
    },
    {
      id: 'fatigue',
      factor: 'Human Factor / Fatigue',
      impact: clamp(shiftFatigue, 20, 88),
      trend: shiftFatigue > 70 ? 'up' : 'flat',
      value: Math.round(shiftFatigue),
    },
    {
      id: 'maintenance',
      factor: 'Maintenance Overdue',
      impact: clamp(equipment.filter((item) => item.maintenanceOverdue).length * 18, 10, 85),
      trend: equipment.some((item) => item.maintenanceOverdue) ? 'up' : 'down',
      value: equipment.filter((item) => item.maintenanceOverdue).length,
    },
    {
      id: 'weather',
      factor: 'Weather Condition',
      impact: clamp(weatherWind * 2.2, 10, 65),
      trend: weatherWind > 12 ? 'up' : 'flat',
      value: Math.round(weatherWind),
    },
  ]

  return contributors.sort((a, b) => b.impact - a.impact)
}

export function riskSummaryText(scores: RiskScores, equipment: PlantEquipment[]): string {
  const reactor = equipment.find((item) => item.id === 'R-101')
  const level = riskLevelFromScore(scores.cri)
  if (level === 'critical') {
    return `High temperature trend detected in Reactor Unit (${reactor?.id ?? 'R-101'}). Risk of explosion within ${Math.max(18, 52 - Math.round(scores.cri / 3))} minutes if unmitigated.`
  }
  if (level === 'high') {
    return `Elevated process risk across active zones. Reactor ${reactor?.id ?? 'R-101'} requires immediate supervisory review.`
  }
  return 'Plant operating within elevated monitoring thresholds. Continue active surveillance.'
}

export function getZoneRiskLevel(score: number): RiskLevel {
  return riskLevelFromScore(score)
}

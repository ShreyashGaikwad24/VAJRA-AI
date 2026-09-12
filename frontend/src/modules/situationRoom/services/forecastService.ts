import type { ForecastState, PlantEquipment, PlantSensor, RiskScores } from '@/data/plant/types'
import { riskLevelFromScore } from '@/data/plant/types'

export function buildForecast(
  scores: RiskScores,
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
): ForecastState {
  const reactor = equipment.find((item) => item.id === 'R-101')
  const gas = sensors.filter((sensor) => sensor.type === 'gas').reduce((sum, sensor) => sum + sensor.value, 0) /
    Math.max(sensors.filter((sensor) => sensor.type === 'gas').length, 1)

  const tempSlope = reactor ? (reactor.temperature - 380) / 120 : 0
  const gasSlope = gas / 100
  const base = scores.cri

  const points = Array.from({ length: 13 }, (_, index) => {
    const minute = index * 5
    const risk = base + tempSlope * index * 4 + gasSlope * index * 6 + Math.pow(index, 1.35) * 1.8
    return { minute, risk: Math.min(99, Math.max(base - 4, risk)) }
  })

  const endRisk = points[points.length - 1]?.risk ?? base
  const probability = Math.round(Math.min(95, 48 + tempSlope * 40 + gasSlope * 25 + (scores.cri - 70) * 0.35))
  const timeToCriticalMinutes = Math.max(12, Math.round(58 - scores.cri / 2 - tempSlope * 20))

  return {
    status: riskLevelFromScore(endRisk),
    probability,
    timeToCriticalMinutes,
    points,
  }
}

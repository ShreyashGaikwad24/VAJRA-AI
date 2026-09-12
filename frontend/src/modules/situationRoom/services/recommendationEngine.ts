import type { PlantEquipment, PlantSensor, PlantZone, RiskLevel, RiskRecommendation, RiskScores } from '@/data/plant/types'
import { riskLevelFromScore } from '@/data/plant/types'

function severityFromLevel(level: RiskLevel): RiskLevel {
  return level
}

export function buildRecommendations(
  _scores: RiskScores,
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  zones: Array<PlantZone & { riskScore: number }>,
): RiskRecommendation[] {
  const recommendations: RiskRecommendation[] = []
  const reactor = equipment.find((item) => item.id === 'R-101')
  const pipeline = equipment.find((item) => item.id === 'PJ-114')
  const pump = equipment.find((item) => item.id === 'PS-023')
  const hotZone = zones.find((zone) => zone.hotWorkActive)
  const gasSensor = sensors.find((sensor) => sensor.type === 'gas')

  if (reactor && reactor.temperature > 380) {
    recommendations.push({
      id: 'rec-temp',
      priority: 1,
      severity: 'critical',
      title: `Reduce temperature in Reactor ${reactor.id}`,
      detail: 'Lower feed rate and increase coolant loop throughput to reverse thermal drift.',
      executionTime: '5 min',
      riskReduction: 18,
      status: 'ready',
      zoneId: 'ZONE C',
      equipmentId: reactor.id,
    })
  }

  if (hotZone) {
    recommendations.push({
      id: 'rec-hot-work',
      priority: recommendations.length + 1,
      severity: 'critical',
      title: `Stop hot work in ${hotZone.name}`,
      detail: 'Suspend concurrent hot work permits until reactor thermal profile stabilizes.',
      executionTime: '3 min',
      riskReduction: 14,
      status: 'ready',
      zoneId: hotZone.id,
    })
  }

  if ((gasSensor?.value ?? pipeline?.gas ?? 0) > 28) {
    recommendations.push({
      id: 'rec-gas',
      priority: recommendations.length + 1,
      severity: 'high',
      title: 'Inspect Line 27A for gas leak',
      detail: 'Deploy gas detection team to PL-27A manifold and isolate affected branch if LEL remains elevated.',
      executionTime: '10 min',
      riskReduction: 12,
      status: 'queued',
      zoneId: 'ZONE B',
      equipmentId: 'PJ-114',
    })
  }

  if (zones.some((zone) => zone.activePermits > 10)) {
    recommendations.push({
      id: 'rec-permit',
      priority: recommendations.length + 1,
      severity: 'medium',
      title: 'Review Permit PTW-3041',
      detail: 'Reorder overlapping permits in the maintenance corridor to reduce simultaneous exposure.',
      executionTime: '8 min',
      riskReduction: 9,
      status: 'queued',
      zoneId: 'ZONE C',
    })
  }

  if (pump && pump.vibration > 2.5) {
    recommendations.push({
      id: 'rec-vibration',
      priority: recommendations.length + 1,
      severity: severityFromLevel(riskLevelFromScore(pump.vibration * 24)),
      title: `Monitor Pump ${pump.id} vibration`,
      detail: 'Inspect impeller alignment and schedule immediate maintenance if vibration exceeds 3.0 mm/s.',
      executionTime: '12 min',
      riskReduction: 8,
      status: 'queued',
      zoneId: pump.zoneId,
      equipmentId: pump.id,
    })
  }

  return recommendations
    .sort((a, b) => a.priority - b.priority)
    .map((item, index) => ({ ...item, priority: index + 1 }))
    .slice(0, 5)
}

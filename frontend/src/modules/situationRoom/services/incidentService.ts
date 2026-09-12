import type { HistoricalIncident, PatternMatch, PlantEquipment, PlantSensor, PlantZone, RiskContributor } from '@/data/plant/types'
import { HISTORICAL_INCIDENTS } from '@/data/plant/incidents'

function overlapScore(factors: string[], activeTags: string[]): number {
  const normalizedActive = activeTags.map((tag) => tag.toLowerCase())
  const hits = factors.filter((factor) =>
    normalizedActive.some((tag) => factor.toLowerCase().includes(tag) || tag.includes(factor.split(' ')[0]?.toLowerCase() ?? '')),
  )
  return hits.length / Math.max(factors.length, 1)
}

export function matchHistoricalIncident(
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  zones: Array<PlantZone & { riskScore: number }>,
  contributors: RiskContributor[],
): PatternMatch {
  const reactor = equipment.find((item) => item.id === 'R-101')
  const activeTags = [
    ...(reactor && reactor.temperature > 380 ? ['high temperature', 'thermal', 'reactor', 'R-101'] : []),
    ...(sensors.some((sensor) => sensor.type === 'gas' && sensor.value > 30) ? ['gas leak probability', 'gas'] : []),
    ...(zones.some((zone) => zone.hotWorkActive) ? ['hot work activity', 'hot-work'] : []),
    ...(contributors.some((item) => item.id === 'vibration' && item.impact > 50) ? ['vibration trend increasing'] : []),
    ...(contributors.some((item) => item.id === 'maintenance' && item.impact > 30) ? ['maintenance overdue'] : []),
  ]

  const ranked = HISTORICAL_INCIDENTS.map((incident) => {
    const factorScore = overlapScore(incident.similarityFactors, activeTags)
    const tagScore = overlapScore(incident.tags, activeTags)
    const similarity = Math.round((factorScore * 0.72 + tagScore * 0.28) * 100)
    const matchedFactors = incident.similarityFactors.filter((factor) =>
      activeTags.some((tag) => factor.toLowerCase().includes(tag.split(' ')[0] ?? tag)),
    )
    return { incident, similarity, matchedFactors }
  }).sort((a, b) => b.similarity - a.similarity)

  const best = ranked[0] ?? {
    incident: HISTORICAL_INCIDENTS[0],
    similarity: 72,
    matchedFactors: HISTORICAL_INCIDENTS[0].similarityFactors.slice(0, 3),
  }

  return {
    incident: best.incident,
    similarity: Math.max(best.similarity, 68),
    matchedFactors: best.matchedFactors.length > 0 ? best.matchedFactors : best.incident.similarityFactors.slice(0, 4),
  }
}

export function listIncidents(): HistoricalIncident[] {
  return HISTORICAL_INCIDENTS
}

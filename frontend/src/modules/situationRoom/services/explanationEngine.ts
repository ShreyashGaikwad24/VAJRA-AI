import type { AIExplanation, PlantEquipment, PlantSensor, PlantZone, RiskContributor, RiskScores } from '@/data/plant/types'

export function buildExplanation(
  scores: RiskScores,
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  zones: Array<PlantZone & { riskScore: number }>,
  contributors: RiskContributor[],
): AIExplanation {
  const reactor = equipment.find((item) => item.id === 'R-101')
  const gas = sensors.find((sensor) => sensor.type === 'gas')
  const hotZone = zones.find((zone) => zone.hotWorkActive)
  const vibration = contributors.find((item) => item.id === 'vibration')

  const parts: string[] = []
  if (reactor && reactor.temperature > 380) {
    parts.push(`high reactor temperature (${Math.round(reactor.temperature)}°C)`)
  }
  if (gas && gas.value > 25) {
    parts.push(`gas leak probability at ${Math.round(gas.value)}% LEL`)
  }
  if (hotZone) {
    parts.push(`active hot work in ${hotZone.label}`)
  }
  if (vibration && vibration.impact > 45) {
    parts.push(`increasing vibration on ${vibration.equipmentId ?? 'rotating assets'}`)
  }

  const text =
    parts.length > 0
      ? `The current risk level is elevated due to a combination of ${parts.join(', ')}, increasing the likelihood of thermal runaway or explosion if not mitigated immediately.`
      : 'Risk remains under active monitoring with moderate contributor overlap across process and exposure indicators.'

  const evidence = [
    { label: 'Live sensor data', active: sensors.length > 0 },
    { label: 'Historical incident patterns', active: scores.cri > 60 },
    { label: 'Permit / work order data', active: zones.some((zone) => zone.activePermits > 8) },
    { label: 'Maintenance & asset health', active: equipment.some((item) => item.maintenanceOverdue) },
    { label: 'Weather / environment', active: true },
    { label: 'Operator behavior', active: contributors.some((item) => item.id === 'fatigue') },
  ]

  const activeEvidence = evidence.filter((item) => item.active).length
  const confidence = Math.round(58 + activeEvidence * 6 + scores.cri * 0.12)

  return {
    text,
    confidence: Math.min(confidence, 98),
    evidence,
  }
}

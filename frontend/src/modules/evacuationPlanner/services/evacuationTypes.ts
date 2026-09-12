export type EvacuationTab = 'Evacuation Map' | 'Routes & Zones' | 'Assembly Points' | 'Scenario Builder' | 'Drill Management'

export type EvacuationArea = 'Reactor Area - Zone C' | 'Storage Area - Zone A' | 'Control Room - Zone D'

export type EvacuationScenario = 'Immediate Evacuation' | 'Phased Evacuation' | 'Shelter-in-Place'

export type TimelineEvent = {
  id: string
  time: string
  label: string
  count?: number
  severity: 'critical' | 'warning' | 'info'
}

export type AssemblyPoint = {
  id: string
  label: string
  goal: number
  current: number
  tone: string
}

export type RiskZone = {
  id: string
  label: string
  level: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK'
  tone: string
}

export type EvacuationState = {
  totalPeople: number
  evacuated: number
  inProgress: number
  remaining: number
  percent: number
  estimatedTimeMinutes: number
  elapsedMinutes: number
  averageSpeed: number
  timeline: TimelineEvent[]
  assemblyPoints: AssemblyPoint[]
  riskZones: RiskZone[]
}

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'safe'

export type EquipmentStatus = 'Healthy' | 'Warning' | 'Critical' | 'Maintenance' | 'Offline'

export type TrendDirection = 'up' | 'down' | 'flat'

export type Vec3 = { x: number; y: number; z: number }

export type PlantZone = {
  id: string
  name: string
  label: string
  description: string
  position: Vec3
  size: { width: number; depth: number }
  baseCri: number
  hotWorkActive: boolean
  activePermits: number
}

export type PlantEquipment = {
  id: string
  name: string
  type: string
  zoneId: string
  status: EquipmentStatus
  health: number
  position: Vec3
  scale: Vec3
  temperature: number
  pressure: number
  flow: number
  gas: number
  humidity: number
  vibration: number
  workersNearby: number
  maintenanceOverdue: boolean
  rootCause: string
  recommendation: string
  failureWindow: string
  failureProbability: number
}

export type PlantSensor = {
  id: string
  type: 'temperature' | 'pressure' | 'gas' | 'vibration' | 'humidity' | 'flow'
  zoneId: string
  equipmentId: string
  position: Vec3
  value: number
  unit: string
  normalMin: number
  normalMax: number
  history: number[]
}

export type RiskContributor = {
  id: string
  factor: string
  impact: number
  trend: TrendDirection
  value: number
  zoneId?: string
  equipmentId?: string
}

export type RiskRecommendation = {
  id: string
  priority: number
  severity: RiskLevel
  title: string
  detail: string
  executionTime: string
  riskReduction: number
  status: 'ready' | 'queued' | 'in_progress'
  zoneId?: string
  equipmentId?: string
}

export type HistoricalIncident = {
  id: string
  title: string
  description: string
  similarityFactors: string[]
  outcome: string
  downtime: string
  totalLoss: string
  injuries: number
  tags: string[]
}

export type AIExplanation = {
  text: string
  confidence: number
  evidence: Array<{ label: string; active: boolean }>
}

export type PatternMatch = {
  incident: HistoricalIncident
  similarity: number
  matchedFactors: string[]
}

export type ForecastState = {
  status: RiskLevel
  probability: number
  timeToCriticalMinutes: number
  points: Array<{ minute: number; risk: number }>
}

export type RiskTrendPoint = {
  timestamp: number
  cri: number
  pri: number
  eri: number
}

export type SensorSnapshot = {
  id: string
  label: string
  value: number
  unit: string
  status: RiskLevel
  trend: TrendDirection
  history: number[]
}

export type PlantOverviewStats = {
  totalAssets: number
  activeSensors: number
  activePermits: number
  onSiteWorkers: number
  openIncidents: number
}

export type RiskScores = {
  cri: number
  pri: number
  eri: number
  sri: number
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  if (score >= 20) return 'low'
  return 'safe'
}

export function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return '#dc2626'
    case 'high':
      return '#f97316'
    case 'medium':
      return '#eab308'
    case 'low':
      return '#22c55e'
    case 'safe':
      return '#3b82f6'
  }
}

export function riskLevelLabel(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'Critical'
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    case 'low':
      return 'Low'
    case 'safe':
      return 'Safe'
  }
}

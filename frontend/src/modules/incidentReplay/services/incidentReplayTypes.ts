export type ReplayTab = 'Replay View' | 'Timeline' | 'Sensor Data' | 'Actions Taken' | 'Analysis' | 'Lessons Learned'

export type ReplayShortcut = 'Last 7 Days' | 'Last 30 Days' | 'All Incidents' | 'Custom Range'

export type ReplayActionStatus = 'COMPLETED' | 'PENDING'

export type IncidentEvent = {
  id: string
  time: string
  rawSeconds: number
  label: string
  detail: string
  severity: 'critical' | 'warning' | 'info'
}

export type IncidentMetric = {
  id: string
  label: string
  value: string
  tone: string
}

export type SensorReading = {
  id: string
  label: string
  value: string
  unit: string
  status: 'CRITICAL' | 'HIGH' | 'STABLE'
  tone: string
}

export type ReplayAction = {
  id: string
  label: string
  status: ReplayActionStatus
}

export type CameraClip = {
  id: string
  label: string
  time: string
  status: 'live' | 'recorded'
}

export type NoteEntry = {
  id: string
  text: string
  createdAt: string
}

export type ReplayState = {
  incidentId: string
  incidentType: string
  location: string
  severity: string
  startTime: string
  endTime: string
  duration: string
  status: string
  plantName: string
  summary: string
  events: IncidentEvent[]
  sensorReadings: SensorReading[]
  metrics: IncidentMetric[]
  actions: ReplayAction[]
  cameraClips: CameraClip[]
  notes: NoteEntry[]
}

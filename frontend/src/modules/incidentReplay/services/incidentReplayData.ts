import type { IncidentMetric, ReplayAction, ReplayShortcut, ReplayState, ReplayTab, SensorReading } from '@/modules/incidentReplay/services/incidentReplayTypes'

export const REPLAY_TABS: ReplayTab[] = ['Replay View', 'Timeline', 'Sensor Data', 'Actions Taken', 'Analysis', 'Lessons Learned']
export const REPLAY_SHORTCUTS: ReplayShortcut[] = ['Last 7 Days', 'Last 30 Days', 'All Incidents', 'Custom Range']

export const INCIDENT_REPLAY_DATA: ReplayState = {
  incidentId: 'INC-2025-0517-001',
  incidentType: 'High Temperature',
  location: 'Reactor R-101, Zone C',
  severity: 'CRITICAL',
  startTime: '10:18:02 AM',
  endTime: '10:24:15 AM',
  duration: '00:06:13',
  status: 'Closed',
  plantName: 'Jamnagar Refinery',
  summary:
    'High temperature detected in Reactor R-101 in Zone C due to abnormal cooling water flow. Immediate actions were taken to prevent escalation.',
  events: [
    { id: 'evt-1', time: '10:18:02 AM', rawSeconds: 0, label: 'High temperature detected in R-101', detail: '92°C', severity: 'critical' },
    { id: 'evt-2', time: '10:18:15 AM', rawSeconds: 13, label: 'Automatic alert triggered', detail: 'Alert escalation', severity: 'critical' },
    { id: 'evt-3', time: '10:18:45 AM', rawSeconds: 43, label: 'Field team notified', detail: 'Emergency response dispatched', severity: 'warning' },
    { id: 'evt-4', time: '10:19:12 AM', rawSeconds: 70, label: 'Evacuation initiated in Zone C', detail: 'Personnel cleared', severity: 'warning' },
    { id: 'evt-5', time: '10:19:45 AM', rawSeconds: 103, label: 'Fire hydrant system on standby', detail: 'Standby aligned', severity: 'info' },
    { id: 'evt-6', time: '10:20:10 AM', rawSeconds: 128, label: 'Cooling system activated', detail: 'Water flow restored', severity: 'info' },
    { id: 'evt-7', time: '10:20:45 AM', rawSeconds: 163, label: 'Temperature dropping', detail: 'Cooling loop stabilizing', severity: 'info' },
    { id: 'evt-8', time: '10:21:30 AM', rawSeconds: 208, label: 'Temperature stabilizing', detail: 'Trend reversing', severity: 'info' },
    { id: 'evt-9', time: '10:24:15 AM', rawSeconds: 373, label: 'Situation under control', detail: 'Incident closed', severity: 'info' },
  ],
  sensorReadings: [
    { id: 'temp', label: 'Temperature (°C)', value: '92', unit: '°C', status: 'CRITICAL', tone: 'text-red-300' },
    { id: 'pressure', label: 'Pressure (bar)', value: '6.5', unit: 'bar', status: 'HIGH', tone: 'text-amber-300' },
    { id: 'vibration', label: 'Vibration (mm/s)', value: '7.2', unit: 'mm/s', status: 'HIGH', tone: 'text-amber-300' },
    { id: 'flow', label: 'Cooling Water Flow (m³/h)', value: '180', unit: 'm³/h', status: 'STABLE', tone: 'text-cyan-300' },
  ] as SensorReading[],
  metrics: [
    { id: 'peak-temp', label: 'Peak Temp', value: '92°C', tone: 'text-red-300' },
    { id: 'peak-pressure', label: 'Peak Pressure', value: '6.5 bar', tone: 'text-amber-300' },
    { id: 'duration', label: 'Total Duration', value: '00:06:13', tone: 'text-cyan-300' },
    { id: 'people-risk', label: 'People at Risk', value: '356', tone: 'text-red-300' },
    { id: 'evacuated', label: 'Evacuated', value: '243', tone: 'text-emerald-300' },
    { id: 'remaining', label: 'Remaining', value: '113', tone: 'text-amber-300' },
  ] as IncidentMetric[],
  actions: [
    { id: 'sirens', label: 'Activate Emergency Sirens', status: 'COMPLETED' },
    { id: 'notify', label: 'Notify All Personnel', status: 'COMPLETED' },
    { id: 'isolate', label: 'Isolate Reactor R-101', status: 'COMPLETED' },
    { id: 'cooling', label: 'Start Cooling Water System', status: 'COMPLETED' },
    { id: 'firegas', label: 'Fire & Gas System On', status: 'COMPLETED' },
    { id: 'medical', label: 'Medical Team On Standby', status: 'PENDING' },
  ] as ReplayAction[],
  cameraClips: [
    { id: 'cam-101', label: 'CAM-101', time: '10:18:02 AM', status: 'live' },
    { id: 'cam-102', label: 'CAM-102', time: '10:19:12 AM', status: 'recorded' },
    { id: 'cam-103', label: 'CAM-103', time: '10:20:45 AM', status: 'recorded' },
    { id: 'cam-104', label: 'CAM-104', time: '10:21:30 AM', status: 'recorded' },
  ],
  notes: [
    { id: 'note-1', text: 'Root Cause (Preliminary): Cooling water flow reduction due to valve V-204 partial blockage.', createdAt: '10:24 AM' },
    { id: 'note-2', text: 'Corrective Action: Valve V-204 cleaned and system tested.', createdAt: '10:26 AM' },
    { id: 'note-3', text: 'Lesson Learned: Need to enhance predictive maintenance for cooling system.', createdAt: '10:28 AM' },
  ],
}

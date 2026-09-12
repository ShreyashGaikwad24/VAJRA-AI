import { AlertTriangle, BellRing, Clock3, ShieldCheck, TrendingUp } from 'lucide-react'

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
export type AlertStatus = 'Unacknowledged' | 'Acknowledged' | 'In Progress' | 'Information' | 'Resolved'

export type SafeAlert = {
  id: string
  title: string
  description: string
  area: string
  zone: string
  severity: AlertSeverity
  triggeredAt: string
  status: AlertStatus
  acknowledgedBy?: string
  acknowledgedTime?: string
  detectedBy?: string
  currentValue?: string
  threshold?: string
  recommendedAction?: string
  category?: string
}

export type NotificationItem = {
  id: string
  title: string
  detail: string
  time: string
  severity: AlertSeverity
}

export type NotificationChannel = {
  id: string
  label: string
  active: boolean
  icon: typeof BellRing
}

export type EscalationSummary = {
  total: number
  escalatedAlerts: number
  averageTime: string
}

export const alertRows: SafeAlert[] = [
  {
    id: 'ALT-2025-0517-001',
    title: 'High Temperature Detected',
    description: 'Temperature exceeded 90°C',
    area: 'Reactor R-101',
    zone: 'Zone C',
    severity: 'CRITICAL',
    triggeredAt: '17 May 2025\n10:18:02 AM',
    status: 'Unacknowledged',
    detectedBy: 'Temperature Sensor T-101',
    currentValue: '92°C',
    threshold: '90°C',
    recommendedAction: 'Initiate cooling system and\ninspect reactor',
  },
  {
    id: 'ALT-2025-0517-002',
    title: 'Gas Leak Detected',
    description: 'Methane level above threshold',
    area: 'Compressor Station',
    zone: 'Area B',
    severity: 'HIGH',
    triggeredAt: '17 May 2025\n10:15:45 AM',
    status: 'Unacknowledged',
    detectedBy: 'Gas Sensor G-204',
    currentValue: '9.7% LEL',
    threshold: '8.0% LEL',
    recommendedAction: 'Isolate line and dispatch gas team',
  },
  {
    id: 'ALT-2025-0517-003',
    title: 'Fire Sensor Activated',
    description: 'Flame detected in Pipe Rack 2',
    area: 'Pipe Rack Area',
    zone: 'Zone D',
    severity: 'HIGH',
    triggeredAt: '17 May 2025\n10:12:30 AM',
    status: 'Acknowledged',
    acknowledgedBy: 'Rajesh Kumar',
    acknowledgedTime: '10:13 AM',
    detectedBy: 'Flame Detector F-18',
    currentValue: 'Detected',
    threshold: 'Flame energy > 1.2',
    recommendedAction: 'Verify source and alert fire response crew',
  },
  {
    id: 'ALT-2025-0517-004',
    title: 'Permit Deviation',
    description: 'Hot work without valid permit',
    area: 'Maintenance Area',
    zone: 'Zone A',
    severity: 'MEDIUM',
    triggeredAt: '17 May 2025\n10:10:05 AM',
    status: 'In Progress',
    acknowledgedBy: 'Priya Sharma',
    acknowledgedTime: '10:11 AM',
    detectedBy: 'Permit Monitoring System',
    currentValue: 'Permit expired',
    threshold: 'Valid permit required',
    recommendedAction: 'Suspend work and document permit exception',
  },
  {
    id: 'ALT-2025-0517-005',
    title: 'Equipment Vibration High',
    description: 'Pump P-204 vibration above limit',
    area: 'Pump House',
    zone: 'Zone D',
    severity: 'MEDIUM',
    triggeredAt: '17 May 2025\n10:08:22 AM',
    status: 'Acknowledged',
    acknowledgedBy: 'Amit Patel',
    acknowledgedTime: '10:09 AM',
    detectedBy: 'Vibration Sensor V-17',
    currentValue: '8.4 mm/s',
    threshold: '7.0 mm/s',
    recommendedAction: 'Inspect bearing and check alignment',
  },
  {
    id: 'ALT-2025-0517-006',
    title: 'Safety Drill Scheduled',
    description: 'Quarterly evacuation drill',
    area: 'All Areas',
    zone: 'All Zones',
    severity: 'LOW',
    triggeredAt: '17 May 2025\n09:30:00 AM',
    status: 'Information',
    acknowledgedBy: 'System',
    detectedBy: 'Safety Operations',
    currentValue: 'Scheduled',
    threshold: 'No action required',
    recommendedAction: 'Inform plant teams and record drill readiness',
  },
  {
    id: 'ALT-2025-0517-007',
    title: 'Air Quality Normal',
    description: 'Air quality within safe limits',
    area: 'Control Room',
    zone: 'Area',
    severity: 'LOW',
    triggeredAt: '17 May 2025\n09:25:10 AM',
    status: 'Resolved',
    acknowledgedBy: 'System',
    detectedBy: 'Air Quality Sensor A-02',
    currentValue: 'Safe',
    threshold: 'Within limit',
    recommendedAction: 'Continue monitoring with regular checks',
  },
]

export const alertTabs = ['Active Alerts', 'Alert History', 'Notification Log', 'Escalation Matrix', 'Contact Directory', 'Alert Rules'] as const
export type AlertTab = (typeof alertTabs)[number]

export const severityOptions = ['All Severities', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
export const areaOptions = ['All Areas', 'Reactor R-101', 'Compressor Station', 'Pipe Rack Area', 'Maintenance Area', 'Pump House', 'Control Room']
export const sortOptions = ['Newest First', 'Oldest First', 'Highest Severity']

export const kpiCards = [
  { title: 'ACTIVE ALERTS', value: '7', delta: 'Critical: 3 | High: 2 | Medium: 2', tone: 'critical', trend: 'up', icon: AlertTriangle, sparkline: [12, 10, 15, 13, 19, 16, 21, 18], description: 'Immediate response required' },
  { title: 'UNACKNOWLEDGED', value: '4', delta: 'Requires attention', tone: 'warning', trend: 'up', icon: BellRing, sparkline: [5, 4, 7, 6, 8, 9, 8, 7], description: 'Pending acknowledgements' },
  { title: 'TOTAL TODAY', value: '24', delta: '↑ 20% vs yesterday', tone: 'warning', trend: 'up', icon: TrendingUp, sparkline: [11, 14, 12, 17, 15, 18, 19, 24], description: 'Total alert volume' },
  { title: 'RESOLVED TODAY', value: '17', delta: '↑ 42% vs yesterday', tone: 'success', trend: 'up', icon: ShieldCheck, sparkline: [8, 9, 11, 13, 15, 17, 16, 17], description: 'Resolved within shift' },
  { title: 'AVG RESPONSE TIME', value: '02:18 min', delta: '↓ 15% vs yesterday', tone: 'default', trend: 'down', icon: Clock3, sparkline: [4, 5, 4, 3, 4, 3, 2.5, 2.3], description: 'Time to acknowledgement' },
]

export const recentNotifications: NotificationItem[] = [
  { id: 'n-1', title: 'Emergency alert: High temperature in Reactor R-101', detail: 'All relevant personnel notified via all channels', time: '10:18 AM', severity: 'CRITICAL' },
  { id: 'n-2', title: 'Alert: Gas leak detected at Compressor Station', detail: 'Maintenance team and safety officer notified', time: '10:15 AM', severity: 'HIGH' },
  { id: 'n-3', title: 'Alert acknowledged: Fire sensor in Pipe Rack 2', detail: 'Acknowledged by Rajesh Kumar', time: '10:13 AM', severity: 'HIGH' },
  { id: 'n-4', title: 'System notification: Daily safety compliance report generated', detail: 'Report available in Analytics & Insights', time: '09:45 AM', severity: 'INFO' },
  { id: 'n-5', title: 'Alert resolved: Air quality normal in Control Room', detail: 'System auto-resolved', time: '09:25 AM', severity: 'LOW' },
]

export const notificationChannels: NotificationChannel[] = [
  { id: 'email', label: 'Email Notifications', active: true, icon: BellRing },
  { id: 'sms', label: 'SMS Alerts', active: true, icon: BellRing },
  { id: 'push', label: 'Push Notifications', active: true, icon: BellRing },
  { id: 'whatsapp', label: 'WhatsApp Alerts', active: true, icon: BellRing },
]

export const escalationSummary: EscalationSummary = {
  total: 12,
  escalatedAlerts: 5,
  averageTime: '03:25 min',
}

export const severityChartData = [
  { name: 'Critical', value: 8, percent: '33%', color: '#ef4444' },
  { name: 'High', value: 7, percent: '29%', color: '#f59e0b' },
  { name: 'Medium', value: 6, percent: '25%', color: '#facc15' },
  { name: 'Low', value: 3, percent: '13%', color: '#10b981' },
]

export const contactDirectory = [
  { name: 'Rajesh Kumar', role: 'Shift Safety Officer', phone: '+91 98765 43210' },
  { name: 'Priya Sharma', role: 'Maintenance Lead', phone: '+91 98765 43211' },
  { name: 'Amit Patel', role: 'Control Room Supervisor', phone: '+91 98765 43212' },
  { name: 'Neha Singh', role: 'Emergency Coordinator', phone: '+91 98765 43213' },
]

export const alertRules = [
  'Critical temperature breach triggers immediate containment flow',
  'Gas leaks escalate to maintenance + safety officer automatically',
  'Permit deviations require approval before hot work resumes',
  'Fire alarms notify both local crew and central command',
]

export const escalationMatrix = [
  { stage: 'Level 1', owner: 'Shift Supervisor', sla: '00:05 min' },
  { stage: 'Level 2', owner: 'Safety Officer', sla: '00:08 min' },
  { stage: 'Level 3', owner: 'Plant Manager', sla: '00:12 min' },
]

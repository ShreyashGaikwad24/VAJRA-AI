export type DashboardKpi = {
  label: string
  value: string
  delta: string
  description: string
  badge: string
  trend: 'up' | 'down' | 'flat'
  sparkline: number[]
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'critical'
}

export type PlantZone = {
  name: string
  status: string
  tone: 'success' | 'warning' | 'danger'
  cri: string
  workers: string
  sensors: string
}

export type HeatCell = {
  id: string
  label: string
  value: number
  tone: 'low' | 'medium' | 'high' | 'critical'
}

export type RiskContributor = {
  name: string
  value: number
  tone: 'success' | 'warning' | 'danger' | 'critical'
  trend: 'up' | 'down' | 'flat'
  detail: string
}

export type RecentAlert = {
  time: string
  equipment: string
  title: string
  detail: string
  category: string
  source: string
  zone: string
  priority: string
  status: string
  assigned: string
  severity: 'info' | 'warning' | 'danger' | 'critical'
}

export type Recommendation = {
  priority: string
  category: string
  title: string
  detail: string
  action: string
  impact: string
  eta: string
  zones: string[]
  confidence: string
  status: string
  riskReduction: string
  departments: string[]
  executionProgress: number
  priorityScore: number
  aiExplanation: string
  relatedEquipment: string[]
}

export type FooterStatusItem = {
  label: string
  value: string
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'critical'
}

export type WeatherStatus = {
  condition: string
  humidity: string
  wind: string
  temperature: string
}

export const executiveKpis: DashboardKpi[] = [
  {
    label: 'Critical Risk Index',
    value: '89',
    delta: '+12 from last hour',
    description: 'Critical exposure zones elevated',
    badge: 'Critical Risk',
    trend: 'up',
    sparkline: [66, 68, 71, 74, 80, 85, 87, 89],
    tone: 'critical',
  },
  {
    label: 'Predictive Risk Index',
    value: '72',
    delta: '+8 from last shift',
    description: 'Forecast indicates rising thermal load',
    badge: 'High Risk',
    trend: 'up',
    sparkline: [52, 55, 58, 61, 64, 68, 70, 72],
    tone: 'warning',
  },
  {
    label: 'Exposure Risk Index',
    value: '38',
    delta: '-5 from last hour',
    description: 'PPE coverage and routing improving',
    badge: 'Moderate Risk',
    trend: 'down',
    sparkline: [48, 45, 43, 41, 40, 39, 38, 38],
    tone: 'success',
  },
  {
    label: 'Overall Plant Health',
    value: '76%',
    delta: '+6% from yesterday',
    description: 'Operating envelope remains stable',
    badge: 'Good',
    trend: 'up',
    sparkline: [68, 70, 71, 72, 73, 74, 75, 76],
    tone: 'success',
  },
  {
    label: 'Active Workers',
    value: '356',
    delta: '+18 from last shift',
    description: 'On-site workforce currently active',
    badge: 'On Site',
    trend: 'up',
    sparkline: [290, 300, 316, 329, 338, 344, 351, 356],
    tone: 'default',
  },
  {
    label: 'Active Permits',
    value: '48',
    delta: 'No change',
    description: 'Permits under review today',
    badge: 'Today',
    trend: 'flat',
    sparkline: [45, 45, 46, 46, 47, 47, 48, 48],
    tone: 'warning',
  },
  {
    label: 'Open Incidents',
    value: '3',
    delta: '-1 from last hour',
    description: 'Requires attention',
    badge: 'Requires Attention',
    trend: 'down',
    sparkline: [7, 6, 6, 5, 4, 4, 3, 3],
    tone: 'danger',
  },
]

export const plantZones: PlantZone[] = [
  { name: 'Cooling Tower', status: 'Stable', tone: 'success', cri: '18', workers: '12', sensors: '08' },
  { name: 'Storage Tank', status: 'Elevated', tone: 'warning', cri: '41', workers: '09', sensors: '06' },
  { name: 'Processing Unit', status: 'Critical', tone: 'danger', cri: '89', workers: '36', sensors: '14' },
  { name: 'Control Room', status: 'Stable', tone: 'success', cri: '12', workers: '05', sensors: '11' },
  { name: 'Warehouse', status: 'Watch', tone: 'warning', cri: '44', workers: '22', sensors: '07' },
  { name: 'Loading Area', status: 'Elevated', tone: 'warning', cri: '52', workers: '18', sensors: '09' },
]

export const heatMapGrid: HeatCell[] = [
  { id: 'h-1', label: 'A1', value: 12, tone: 'low' },
  { id: 'h-2', label: 'A2', value: 18, tone: 'low' },
  { id: 'h-3', label: 'A3', value: 31, tone: 'medium' },
  { id: 'h-4', label: 'A4', value: 55, tone: 'high' },
  { id: 'h-5', label: 'B1', value: 91, tone: 'critical' },
  { id: 'h-6', label: 'B2', value: 21, tone: 'low' },
  { id: 'h-7', label: 'B3', value: 39, tone: 'medium' },
  { id: 'h-8', label: 'B4', value: 46, tone: 'medium' },
  { id: 'h-9', label: 'C1', value: 69, tone: 'high' },
  { id: 'h-10', label: 'C2', value: 95, tone: 'critical' },
  { id: 'h-11', label: 'D1', value: 15, tone: 'low' },
  { id: 'h-12', label: 'D2', value: 19, tone: 'low' },
  { id: 'h-13', label: 'D3', value: 42, tone: 'medium' },
  { id: 'h-14', label: 'D4', value: 61, tone: 'high' },
  { id: 'h-15', label: 'E1', value: 88, tone: 'critical' },
  { id: 'h-16', label: 'E2', value: 20, tone: 'low' },
  { id: 'h-17', label: 'E3', value: 34, tone: 'medium' },
  { id: 'h-18', label: 'E4', value: 63, tone: 'high' },
  { id: 'h-19', label: 'F1', value: 96, tone: 'critical' },
  { id: 'h-20', label: 'F2', value: 84, tone: 'critical' },
]

export const riskContributors: RiskContributor[] = [
  { name: 'Heat Load', value: 92, tone: 'critical', trend: 'up', detail: 'Thermal zones concentrated in process line' },
  { name: 'Permit Density', value: 85, tone: 'danger', trend: 'up', detail: 'Multiple overlapping work permits' },
  { name: 'Shift Fatigue', value: 75, tone: 'warning', trend: 'up', detail: 'Long shift duration and staffing pressure' },
  { name: 'Visibility Loss', value: 65, tone: 'warning', trend: 'flat', detail: 'Reduced clarity near loading area' },
  { name: 'Equipment Drift', value: 55, tone: 'success', trend: 'down', detail: 'Machine vibration still within tolerance' },
]

export const recentAlerts: RecentAlert[] = [
  { time: '10:23', equipment: 'R-101', title: 'Reactor temperature spike', detail: 'Unit R-101 crossed the safe thermal band.', category: 'Thermal', source: 'Sensor Cluster 11', zone: 'Process Area', priority: 'Critical', status: 'Active', assigned: 'Ops Lead', severity: 'critical' },
  { time: '10:18', equipment: 'PL-27A', title: 'Gas leak detection', detail: 'Perimeter sensor reported abnormal vapor trace.', category: 'Gas', source: 'Pipeline Node 27A', zone: 'Line 27A', priority: 'High', status: 'Acknowledged', assigned: 'Safety Desk', severity: 'danger' },
  { time: '10:10', equipment: 'PTW-3041', title: 'Permit deviation', detail: 'PTW-3041 overlaps with adjacent maintenance schedule.', category: 'Permit', source: 'Permit Desk', zone: 'Zone C', priority: 'Medium', status: 'Review', assigned: 'Shift Manager', severity: 'warning' },
  { time: '10:05', equipment: 'TB-02', title: 'High noise level', detail: 'Acoustic signature elevated near turbine bay.', category: 'Acoustic', source: 'Turbine Array', zone: 'Zone D', priority: 'Low', status: 'Monitored', assigned: 'Reliability', severity: 'info' },
  { time: '10:02', equipment: 'W-245', title: 'Worker in high risk zone', detail: 'Worker ID W-245 entered a restricted sector.', category: 'Access', source: 'Badge Network', zone: 'Zone C', priority: 'Critical', status: 'Escalated', assigned: 'Security', severity: 'danger' },
  { time: '09:58', equipment: 'HX-04', title: 'Heat exchanger differential rise', detail: 'Delta pressure moved above expected profile.', category: 'Pressure', source: 'HX Cluster', zone: 'Heat Exchangers', priority: 'Medium', status: 'Monitored', assigned: 'Reliability', severity: 'warning' },
  { time: '09:54', equipment: 'ST-12', title: 'Tank vent deviation', detail: 'Vent line flow pattern trending unstable.', category: 'Gas', source: 'Tank Vent Mesh', zone: 'Storage Tanks', priority: 'High', status: 'Active', assigned: 'Safety Desk', severity: 'danger' },
  { time: '09:51', equipment: 'CR-01', title: 'Control station override', detail: 'Manual override triggered for valve set B.', category: 'Control', source: 'Control Console', zone: 'Control Room', priority: 'Medium', status: 'Review', assigned: 'Ops Lead', severity: 'warning' },
  { time: '09:47', equipment: 'PH-02', title: 'Pump vibration anomaly', detail: 'Vibration exceeded baseline by 12 percent.', category: 'Mechanical', source: 'Vibration Sensor', zone: 'Pump House', priority: 'High', status: 'Acknowledged', assigned: 'Maintenance', severity: 'danger' },
  { time: '09:42', equipment: 'LB-03', title: 'Loading gate congestion', detail: 'Worker and vehicle overlap exceeded threshold.', category: 'Worker Density', source: 'Vision AI', zone: 'Loading Bay', priority: 'Medium', status: 'Monitored', assigned: 'Logistics', severity: 'warning' },
  { time: '09:38', equipment: 'UT-09', title: 'Electrical panel heat rise', detail: 'Panel temperature trend shifted upward.', category: 'Electrical', source: 'Panel Telemetry', zone: 'Utilities', priority: 'High', status: 'Active', assigned: 'Electrical', severity: 'danger' },
  { time: '09:33', equipment: 'R-102', title: 'Combustion ratio drift', detail: 'Combustion metrics deviated from optimal band.', category: 'Fire', source: 'Combustion AI', zone: 'Process Area', priority: 'Critical', status: 'Escalated', assigned: 'Ops Lead', severity: 'critical' },
  { time: '09:29', equipment: 'WH-09', title: 'Forklift route conflict', detail: 'Route path intersected restricted maintenance lane.', category: 'Logistics', source: 'Fleet Tracker', zone: 'Warehouse', priority: 'Low', status: 'Monitored', assigned: 'Warehouse', severity: 'info' },
  { time: '09:25', equipment: 'CT-01', title: 'Cooling fan speed dip', detail: 'Fan RPM dipped below baseline for 90 seconds.', category: 'Thermal', source: 'Cooling Telemetry', zone: 'Cooling Towers', priority: 'Medium', status: 'Review', assigned: 'Maintenance', severity: 'warning' },
  { time: '09:21', equipment: 'PL-14', title: 'Pressure transient spike', detail: 'Transient detected near pipeline manifold.', category: 'Pressure', source: 'Pipeline Node 14', zone: 'Process Area', priority: 'High', status: 'Acknowledged', assigned: 'Reliability', severity: 'danger' },
  { time: '09:16', equipment: 'ST-08', title: 'Flammable vapor warning', detail: 'Localized vapor concentration rose above alert threshold.', category: 'Gas', source: 'Gas Monitor 08', zone: 'Storage Tanks', priority: 'Critical', status: 'Active', assigned: 'Safety Desk', severity: 'critical' },
]

export const recommendations: Recommendation[] = [
  {
    priority: 'Priority 1',
    category: 'Thermal control',
    title: 'Reduce exposure in Reactor Unit R-101',
    detail: 'Shift one inspection team to the alternate route and recheck the thermal boundary before the next maintenance window.',
    action: 'Reroute inspection team and recheck boundary',
    impact: 'High',
    eta: '15 min',
    zones: ['Process Area', 'Zone C'],
    confidence: '92%',
    status: 'Ready',
    riskReduction: '18%',
    departments: ['Operations', 'Safety'],
    executionProgress: 22,
    priorityScore: 96,
    aiExplanation: 'Thermal trajectory and permit overlap indicate high short-term escalation probability.',
    relatedEquipment: ['R-101', 'HX-04'],
  },
  {
    priority: 'Priority 2',
    category: 'Permit control',
    title: 'Validate permit sequence',
    detail: 'Reorder active permits in the maintenance zone to minimize overlap during the next 30 minutes.',
    action: 'Reorder active permits',
    impact: 'Moderate',
    eta: '10 min',
    zones: ['Maintenance Corridor'],
    confidence: '88%',
    status: 'Queued',
    riskReduction: '11%',
    departments: ['Permit Desk', 'Maintenance'],
    executionProgress: 48,
    priorityScore: 82,
    aiExplanation: 'Permit conflict graph shows converging work fronts in adjacent sectors.',
    relatedEquipment: ['PTW-3041', 'PL-27A'],
  },
  {
    priority: 'Priority 3',
    category: 'Ventilation',
    title: 'Increase ventilation review cadence',
    detail: 'Run the next ventilation check sooner and confirm telemetry remains within safe thresholds.',
    action: 'Advance ventilation check',
    impact: 'Moderate',
    eta: '20 min',
    zones: ['Loading Area', 'Warehouse'],
    confidence: '81%',
    status: 'Available',
    riskReduction: '9%',
    departments: ['Logistics', 'HSE'],
    executionProgress: 63,
    priorityScore: 74,
    aiExplanation: 'Ventilation lag and worker density trend suggest moderate accumulation risk.',
    relatedEquipment: ['LB-03', 'WH-09'],
  },
]

export const footerStatusItems: FooterStatusItem[] = [
  { label: 'Connected Sensors', value: '1,284', tone: 'success' },
  { label: 'Active Cameras', value: '64', tone: 'success' },
  { label: 'Workers Online', value: '356', tone: 'success' },
  { label: 'AI Status', value: 'Monitoring', tone: 'default' },
  { label: 'Last Sync', value: '10:38 AM', tone: 'default' },
  { label: 'Emergency State', value: 'Clear', tone: 'success' },
]

export const weatherStatus: WeatherStatus = {
  condition: 'Clear 28°C',
  humidity: '64%',
  wind: '11 km/h',
  temperature: '28°C',
}

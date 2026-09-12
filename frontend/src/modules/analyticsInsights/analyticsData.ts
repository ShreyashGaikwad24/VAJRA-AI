import {
  Activity,
  AlertTriangle,
  BellRing,
  Clock3,
  Gauge,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'

export const analyticsTabs = [
  'Overview',
  'Incident Analytics',
  'Risk Analytics',
  'Alert Analytics',
  'Performance Analytics',
  'Predictive Insights',
] as const

export type AnalyticsTab = (typeof analyticsTabs)[number]

export const analyticsKpis = [
  {
    title: 'TOTAL INCIDENTS',
    value: '32',
    delta: '↑ 18% vs last 7 days',
    tone: 'critical',
    trend: 'up',
    icon: AlertTriangle,
    sparkline: [12, 18, 16, 22, 25, 21, 30, 32],
  },
  {
    title: 'CRITICAL INCIDENTS',
    value: '7',
    delta: '↑ 40% vs last 7 days',
    tone: 'warning',
    trend: 'up',
    icon: Zap,
    sparkline: [3, 4, 3, 5, 6, 5, 7, 7],
  },
  {
    title: 'TOTAL ALERTS',
    value: '256',
    delta: '↓ 12% vs last 7 days',
    tone: 'default',
    trend: 'down',
    icon: BellRing,
    sparkline: [32, 35, 30, 26, 29, 28, 24, 25],
  },
  {
    title: 'DOWNTIME (HOURS)',
    value: '18.6',
    delta: '↓ 8% vs last 7 days',
    tone: 'success',
    trend: 'down',
    icon: Clock3,
    sparkline: [22, 20, 19, 18, 17, 18, 19, 18.6],
  },
  {
    title: 'SAFETY COMPLIANCE',
    value: '92%',
    delta: '↑ 6% vs last 7 days',
    tone: 'success',
    trend: 'up',
    icon: ShieldCheck,
    sparkline: [80, 82, 85, 84, 87, 90, 91, 92],
  },
  {
    title: 'PEOPLE PROTECTED',
    value: '1,247',
    delta: '↑ 23% vs last 7 days',
    tone: 'default',
    trend: 'up',
    icon: Activity,
    sparkline: [900, 930, 980, 1010, 1080, 1150, 1190, 1247],
  },
]

export const incidentTrendData = [
  { day: '10 May', total: 28, critical: 5, high: 14 },
  { day: '11 May', total: 32, critical: 6, high: 18 },
  { day: '12 May', total: 29, critical: 5, high: 17 },
  { day: '13 May', total: 34, critical: 7, high: 19 },
  { day: '14 May', total: 30, critical: 6, high: 16 },
  { day: '15 May', total: 35, critical: 8, high: 21 },
  { day: '16 May', total: 31, critical: 7, high: 18 },
  { day: '17 May', total: 32, critical: 7, high: 20 },
]

export const incidentTypeData = [
  { name: 'High Temperature', value: 12, percent: '37%', color: '#ef4444' },
  { name: 'Gas Leak', value: 8, percent: '25%', color: '#3b82f6' },
  { name: 'Equipment Failure', value: 6, percent: '19%', color: '#10b981' },
  { name: 'Permit Deviation', value: 3, percent: '9%', color: '#f59e0b' },
  { name: 'Fire / Explosion', value: 2, percent: '6%', color: '#93c5fd' },
  { name: 'Others', value: 1, percent: '4%', color: '#8b5cf6' },
]

export const locationData = [
  { name: 'Reactor R-101', value: 8, fill: '#ef4444' },
  { name: 'Compressor Station', value: 5, fill: '#f59e0b' },
  { name: 'Storage Tank Farm', value: 4, fill: '#10b981' },
  { name: 'Pipeline Area C', value: 3, fill: '#3b82f6' },
  { name: 'Cooling Tower Area', value: 2, fill: '#8b5cf6' },
]

export const severityData = [
  { name: 'Critical', value: 32, percent: '13%', color: '#ef4444' },
  { name: 'High', value: 61, percent: '24%', color: '#f97316' },
  { name: 'Medium', value: 98, percent: '38%', color: '#facc15' },
  { name: 'Low', value: 65, percent: '25%', color: '#10b981' },
]

export const heatmapData = [
  { day: 'Mon', values: [1, 2, 4, 5, 3, 2] },
  { day: 'Tue', values: [2, 3, 5, 4, 3, 2] },
  { day: 'Wed', values: [3, 4, 5, 6, 4, 2] },
  { day: 'Thu', values: [2, 3, 4, 5, 3, 2] },
  { day: 'Fri', values: [2, 4, 5, 5, 4, 2] },
  { day: 'Sat', values: [1, 2, 3, 4, 3, 2] },
  { day: 'Sun', values: [1, 1, 2, 3, 2, 1] },
]

export const complianceData = [
  { day: '10 May', value: 84 },
  { day: '11 May', value: 85 },
  { day: '12 May', value: 87 },
  { day: '13 May', value: 89 },
  { day: '14 May', value: 88 },
  { day: '15 May', value: 90 },
  { day: '16 May', value: 91 },
  { day: '17 May', value: 92 },
]

export const performanceItems = [
  {
    label: 'Average Response Time',
    value: '02:18 min',
    delta: '↓ 15% vs last 7 days',
    tone: 'red',
    icon: Clock3,
  },
  {
    label: 'Evacuation Efficiency',
    value: '89%',
    delta: '↑ 7% vs last 7 days',
    tone: 'cyan',
    icon: Gauge,
  },
  {
    label: 'Drill Success Rate',
    value: '94%',
    delta: '↑ 5% vs last 7 days',
    tone: 'green',
    icon: TrendingUp,
  },
  {
    label: 'System Uptime',
    value: '99.8%',
    delta: '↑ 0.3% vs last 7 days',
    tone: 'purple',
    icon: Sparkles,
  },
]

export const recommendationCards = [
  {
    title: 'Increase in Critical Incidents',
    description: 'Critical incidents increased by 40% compared to last week. High temperature incidents are the major contributor.',
    tone: 'red',
    button: 'View Details',
  },
  {
    title: 'Reactor R-101 Risk',
    description: 'Reactor R-101 has the highest number of incidents. Recommend immediate inspection & maintenance.',
    tone: 'orange',
    button: 'View Details',
  },
  {
    title: 'Alert Volume Pattern',
    description: 'High alert volume observed between 08:00 - 16:00 hrs. Optimize monitoring during these hours.',
    tone: 'amber',
    button: 'View Details',
  },
  {
    title: 'Compliance Improving',
    description: 'Safety compliance improved by 6%. Continue following protocols to maintain the upward trend.',
    tone: 'green',
    button: 'View Details',
  },
  {
    title: 'Evacuation Efficiency Good',
    description: 'Evacuation efficiency is above industry standard. Keep up the good work!',
    tone: 'cyan',
    button: 'View Details',
  },
  {
    title: 'Downtime Reduced',
    description: 'Downtime reduced by 8%. System reliability and response times are improving.',
    tone: 'purple',
    button: 'View Details',
  },
]

export const incidentAnalyticsKpis = [
  { title: 'TOTAL INCIDENTS', value: '32', delta: '↑ 18% vs last 7 days', tone: 'critical', trend: 'up', icon: AlertTriangle, sparkline: [12, 18, 16, 22, 26, 24, 28, 32] },
  { title: 'CRITICAL INCIDENTS', value: '7', delta: '↑ 40% vs previous', tone: 'warning', trend: 'up', icon: Zap, sparkline: [3, 4, 3, 5, 6, 5, 7, 7] },
  { title: 'HIGH-RISK INCIDENTS', value: '14', delta: '↓ 9% vs previous', tone: 'default', trend: 'down', icon: AlertTriangle, sparkline: [16, 15, 14, 18, 17, 15, 14, 14] },
  { title: 'AVG RESPONSE TIME', value: '04:12', delta: '↓ 22% vs previous', tone: 'success', trend: 'down', icon: Clock3, sparkline: [7, 6.5, 6, 5.5, 5, 4.8, 4.5, 4.2] },
  { title: 'AVG RESOLUTION TIME', value: '02:48', delta: '↓ 11% vs previous', tone: 'default', trend: 'down', icon: Gauge, sparkline: [6, 5.8, 5.5, 5.2, 4.9, 4.7, 4.5, 2.8] },
  { title: 'REPEAT INCIDENTS', value: '9', delta: '↓ 6% vs previous', tone: 'success', trend: 'down', icon: TrendingUp, sparkline: [12, 11, 10, 9, 8, 8, 9, 9] },
]

export const incidentTrendSeries = [
  { day: '10', total: 21, critical: 4, high: 9 },
  { day: '11', total: 25, critical: 5, high: 11 },
  { day: '12', total: 22, critical: 4, high: 10 },
  { day: '13', total: 29, critical: 6, high: 12 },
  { day: '14', total: 26, critical: 5, high: 11 },
  { day: '15', total: 31, critical: 7, high: 14 },
  { day: '16', total: 28, critical: 6, high: 12 },
  { day: '17', total: 32, critical: 7, high: 14 },
]

export const incidentByTypeData = [
  { type: 'High Temp', value: 12, fill: '#ef4444' },
  { type: 'Gas Leak', value: 8, fill: '#3b82f6' },
  { type: 'Equipment', value: 6, fill: '#10b981' },
  { type: 'Permit', value: 3, fill: '#f59e0b' },
  { type: 'Fire', value: 2, fill: '#8b5cf6' },
]

export const incidentSeverityData = [
  { name: 'Critical', value: 7, color: '#ef4444' },
  { name: 'High', value: 14, color: '#f59e0b' },
  { name: 'Medium', value: 9, color: '#facc15' },
  { name: 'Low', value: 2, color: '#10b981' },
]

export const incidentLocationData = [
  { name: 'R-101', value: 8 },
  { name: 'C-Deck', value: 7 },
  { name: 'Tank Farm', value: 5 },
  { name: 'Pipeline C', value: 4 },
  { name: 'Cooling Tower', value: 3 },
]

export const responseTimeData = [
  { name: '00:00', value: 24 },
  { name: '03:00', value: 19 },
  { name: '06:00', value: 16 },
  { name: '09:00', value: 13 },
  { name: '12:00', value: 12 },
  { name: '15:00', value: 9 },
  { name: '18:00', value: 11 },
]

export const incidentDurationData = [
  { name: '0-30m', value: 8 },
  { name: '30-60m', value: 7 },
  { name: '1-3h', value: 9 },
  { name: '3-6h', value: 4 },
  { name: '6+h', value: 2 },
]

export const incidentTableRows = [
  ['INC-017', 'High Temperature', 'Reactor R-101', 'Critical', '15 May 09:12', '03:42', '00:12', 'Closed'],
  ['INC-014', 'Gas Leak', 'Compressor Station', 'High', '15 May 07:18', '02:05', '00:08', 'Monitoring'],
  ['INC-011', 'Equipment Failure', 'Pipeline Area C', 'High', '14 May 18:42', '04:24', '00:16', 'Escalated'],
  ['INC-009', 'Permit Deviation', 'Cooling Tower', 'Medium', '13 May 15:10', '01:40', '00:11', 'Resolved'],
  ['INC-003', 'Pressure Spike', 'Tank Farm', 'Critical', '12 May 22:50', '06:05', '00:20', 'Closed'],
]

export const riskAnalyticsKpis = [
  { title: 'OVERALL RISK SCORE', value: '68/100', delta: '↓ 6 pts vs last 7 days', tone: 'warning', trend: 'down', icon: Gauge, sparkline: [72, 75, 71, 69, 68, 66, 70, 68] },
  { title: 'HIGH RISK ASSETS', value: '14', delta: '↑ 2 vs prior', tone: 'critical', trend: 'up', icon: AlertTriangle, sparkline: [10, 11, 12, 12, 13, 14, 14, 14] },
  { title: 'CRITICAL RISK ZONES', value: '5', delta: 'Stable', tone: 'default', trend: 'flat', icon: ShieldCheck, sparkline: [5, 5, 5, 5, 5, 6, 5, 5] },
  { title: 'OPEN RISK EVENTS', value: '23', delta: '↓ 7% vs prior', tone: 'default', trend: 'down', icon: BellRing, sparkline: [29, 27, 26, 25, 24, 23, 22, 23] },
  { title: 'RISK REDUCTION', value: '18%', delta: '↑ 5 pts', tone: 'success', trend: 'up', icon: TrendingUp, sparkline: [8, 9, 11, 12, 13, 16, 18, 18] },
  { title: 'PREDICTED RISK', value: '71', delta: '↑ 3 pts next 10d', tone: 'warning', trend: 'up', icon: Sparkles, sparkline: [60, 63, 62, 64, 66, 68, 70, 71] },
]

export const riskTrendData = [
  { day: '10', score: 58 },
  { day: '11', score: 62 },
  { day: '12', score: 65 },
  { day: '13', score: 67 },
  { day: '14', score: 69 },
  { day: '15', score: 64 },
  { day: '16', score: 66 },
  { day: '17', score: 68 },
]

export const riskByZoneData = [
  { zone: 'R-101', value: 86 },
  { zone: 'Tank Farm', value: 81 },
  { zone: 'Compressor', value: 74 },
  { zone: 'Pipeline C', value: 68 },
  { zone: 'Cooling Tower', value: 63 },
]

export const topRiskLocationsData = [
  { name: 'Reactor R-101', value: 86, fill: '#ef4444' },
  { name: 'Compressor Station', value: 74, fill: '#f59e0b' },
  { name: 'Storage Tank Farm', value: 81, fill: '#f97316' },
  { name: 'Pipeline Area C', value: 68, fill: '#3b82f6' },
  { name: 'Cooling Tower Area', value: 63, fill: '#8b5cf6' },
]

export const riskSeverityData = [
  { name: 'High Risk', value: 14, color: '#ef4444' },
  { name: 'Medium Risk', value: 19, color: '#f59e0b' },
  { name: 'Low Risk', value: 31, color: '#10b981' },
]

export const riskHeatmapData = [
  { day: 'Mon', values: [2, 2, 3, 4, 5, 4] },
  { day: 'Tue', values: [3, 4, 4, 5, 5, 3] },
  { day: 'Wed', values: [2, 3, 4, 5, 5, 4] },
  { day: 'Thu', values: [3, 4, 5, 5, 5, 4] },
  { day: 'Fri', values: [2, 3, 4, 4, 5, 5] },
  { day: 'Sat', values: [2, 2, 3, 4, 4, 3] },
]

export const riskRankingRows = [
  ['R-101 Reactor', 'High Risk', '86', 'Cooling system, pressure drift', 'Immediate inspection'],
  ['Storage Tank Farm', 'High Risk', '81', 'Temperature / venting anomaly', 'Scheduled inspection'],
  ['Compressor Station', 'Medium Risk', '74', 'Vibration and maintenance backlog', 'Monitor weekly'],
  ['Pipeline Area-C', 'Medium Risk', '68', 'Corrosion indicators', 'Inspection next shift'],
  ['Cooling Tower', 'Low Risk', '63', 'Seasonal degradation', 'Flagged for routine review'],
]

export const alertAnalyticsKpis = [
  { title: 'TOTAL ALERTS', value: '256', delta: '↓ 12% vs prior', tone: 'default', trend: 'down', icon: BellRing, sparkline: [310, 300, 290, 270, 260, 250, 255, 256] },
  { title: 'CRITICAL ALERTS', value: '32', delta: '↓ 18% vs prior', tone: 'critical', trend: 'down', icon: AlertTriangle, sparkline: [48, 44, 41, 38, 35, 34, 33, 32] },
  { title: 'ACKNOWLEDGED', value: '212', delta: '↑ 9% vs prior', tone: 'success', trend: 'up', icon: ShieldCheck, sparkline: [180, 185, 195, 200, 205, 210, 212, 212] },
  { title: 'UNRESOLVED', value: '44', delta: '↓ 3% vs prior', tone: 'warning', trend: 'down', icon: Gauge, sparkline: [55, 52, 50, 48, 47, 45, 45, 44] },
  { title: 'AVG ALERT RESPONSE', value: '03:41', delta: '↓ 14% vs prior', tone: 'default', trend: 'down', icon: Clock3, sparkline: [6, 5.8, 5.4, 5.1, 4.8, 4.4, 3.9, 3.7] },
  { title: 'FALSE POSITIVE RATE', value: '4.8%', delta: '↑ 0.6 pts', tone: 'warning', trend: 'up', icon: Activity, sparkline: [5.8, 5.3, 5.1, 5.0, 4.9, 4.8, 4.7, 4.8] },
]

export const alertVolumeData = [
  { day: '10', value: 30 },
  { day: '11', value: 25 },
  { day: '12', value: 32 },
  { day: '13', value: 28 },
  { day: '14', value: 36 },
  { day: '15', value: 33 },
  { day: '16', value: 27 },
  { day: '17', value: 31 },
]

export const alertSeverityData = [
  { name: 'Critical', value: 32, color: '#ef4444' },
  { name: 'High', value: 68, color: '#f97316' },
  { name: 'Medium', value: 97, color: '#facc15' },
  { name: 'Low', value: 59, color: '#10b981' },
]

export const alertSourceData = [
  { source: 'SCADA', value: 92 },
  { source: 'Gas Grid', value: 74 },
  { source: 'Camera AI', value: 48 },
  { source: 'Fire & Gas', value: 26 },
  { source: 'Safety Loop', value: 16 },
]

export const alertAssetData = [
  { asset: 'R-101', value: 41 },
  { asset: 'Tank Farm', value: 32 },
  { asset: 'Compressor', value: 27 },
  { asset: 'Pipeline C', value: 22 },
  { asset: 'Cooling Tower', value: 18 },
]

export const alertTimeHeatmap = [
  { day: 'Mon', values: [2, 2, 4, 5, 5, 3] },
  { day: 'Tue', values: [3, 2, 3, 6, 5, 4] },
  { day: 'Wed', values: [2, 3, 5, 5, 4, 2] },
  { day: 'Thu', values: [3, 4, 5, 6, 4, 3] },
  { day: 'Fri', values: [2, 3, 4, 5, 5, 4] },
  { day: 'Sat', values: [1, 2, 3, 4, 3, 2] },
]

export const alertTableRows = [
  ['ALT-148', 'High Temperature', 'SCADA', 'Critical', '15 May 09:12', '00:08', 'Closed'],
  ['ALT-163', 'Gas Leak', 'Gas Grid', 'High', '15 May 07:58', '00:12', 'Acknowledged'],
  ['ALT-157', 'Fire / Gas', 'Fire & Gas', 'Critical', '14 May 18:11', '00:05', 'Escalated'],
  ['ALT-144', 'Permit Deviation', 'Safety Loop', 'Medium', '13 May 16:44', '00:21', 'Resolved'],
  ['ALT-132', 'Asset Noise', 'Camera AI', 'Low', '12 May 13:17', '00:31', 'Monitoring'],
]

export const performanceAnalyticsKpis = [
  { title: 'AVG RESPONSE TIME', value: '02:18', delta: '↓ 15% vs prior', tone: 'critical', trend: 'down', icon: Clock3, sparkline: [3.6, 3.4, 3.1, 3.0, 2.8, 2.5, 2.3, 2.3] },
  { title: 'EVACUATION EFFICIENCY', value: '89%', delta: '↑ 7% vs prior', tone: 'default', trend: 'up', icon: Gauge, sparkline: [78, 80, 81, 82, 84, 84, 87, 89] },
  { title: 'DRILL SUCCESS RATE', value: '94%', delta: '↑ 5% vs prior', tone: 'success', trend: 'up', icon: TrendingUp, sparkline: [88, 89, 89, 91, 92, 93, 94, 94] },
  { title: 'SAFETY COMPLIANCE', value: '92%', delta: '↑ 6% vs prior', tone: 'success', trend: 'up', icon: ShieldCheck, sparkline: [84, 85, 86, 88, 89, 90, 91, 92] },
  { title: 'SYSTEM UPTIME', value: '99.8%', delta: '↑ 0.3 pts', tone: 'default', trend: 'up', icon: Sparkles, sparkline: [98.9, 99.1, 99.2, 99.3, 99.5, 99.6, 99.7, 99.8] },
  { title: 'RESOLUTION RATE', value: '91%', delta: '↑ 4% vs prior', tone: 'warning', trend: 'up', icon: Activity, sparkline: [84, 85, 86, 88, 88, 89, 90, 91] },
]

export const responseTrendData = [
  { day: '10', value: 4.1 },
  { day: '11', value: 3.9 },
  { day: '12', value: 3.8 },
  { day: '13', value: 3.3 },
  { day: '14', value: 3.1 },
  { day: '15', value: 2.9 },
  { day: '16', value: 2.8 },
  { day: '17', value: 2.3 },
]

export const evacuationTrendData = [
  { day: '10', value: 76 },
  { day: '11', value: 79 },
  { day: '12', value: 80 },
  { day: '13', value: 83 },
  { day: '14', value: 86 },
  { day: '15', value: 88 },
  { day: '16', value: 89 },
  { day: '17', value: 89 },
]

export const complianceTrendData = [
  { day: '10', value: 84 },
  { day: '11', value: 85 },
  { day: '12', value: 87 },
  { day: '13', value: 88 },
  { day: '14', value: 90 },
  { day: '15', value: 91 },
  { day: '16', value: 91 },
  { day: '17', value: 92 },
]

export const drillPerformanceData = [
  { area: 'Zone A', value: 96 },
  { area: 'Zone B', value: 92 },
  { area: 'Zone C', value: 88 },
  { area: 'Tank Farm', value: 94 },
  { area: 'Pipeline', value: 90 },
]

export const uptimeComparisonData = [
  { metric: 'System Uptime', current: 99.8, previous: 99.4 },
  { metric: 'Evacuation Time', current: 89, previous: 82 },
  { metric: 'Safety Compliance', current: 92, previous: 86 },
  { metric: 'Resolution Rate', current: 91, previous: 87 },
]

export const predictiveAnalyticsKpis = [
  { title: 'PREDICTED INCIDENTS', value: '28', delta: 'Next 14 days', tone: 'warning', trend: 'up', icon: AlertTriangle, sparkline: [18, 19, 20, 22, 24, 26, 27, 28] },
  { title: 'PREDICTED RISK', value: '71', delta: '↑ 3 pts', tone: 'default', trend: 'up', icon: Gauge, sparkline: [60, 62, 63, 65, 67, 68, 70, 71] },
  { title: 'FORECAST ACCURACY', value: '93%', delta: 'Improving model fit', tone: 'success', trend: 'up', icon: ShieldCheck, sparkline: [88, 89, 90, 91, 92, 92, 93, 93] },
  { title: 'PREVENTABLE INCIDENTS', value: '11', delta: 'Probable by action', tone: 'default', trend: 'down', icon: Sparkles, sparkline: [14, 13, 12, 12, 11, 10, 10, 11] },
  { title: 'PREDICTED DOWNTIME', value: '14.2h', delta: '−3.8h vs prior', tone: 'success', trend: 'down', icon: Clock3, sparkline: [22, 21, 20, 18, 17, 16, 15, 14.2] },
  { title: 'RECOMMENDED ACTIONS', value: '8', delta: 'High priority', tone: 'critical', trend: 'up', icon: Zap, sparkline: [3, 4, 5, 5, 6, 6, 7, 8] },
]

export const incidentForecastData = [
  { day: 'Mon', predicted: 18, observed: 16 },
  { day: 'Tue', predicted: 22, observed: 20 },
  { day: 'Wed', predicted: 24, observed: 23 },
  { day: 'Thu', predicted: 27, observed: 25 },
  { day: 'Fri', predicted: 26, observed: 24 },
  { day: 'Sat', predicted: 29, observed: 28 },
  { day: 'Sun', predicted: 31, observed: 30 },
]

export const riskForecastData = [
  { day: 'Mon', risk: 63 },
  { day: 'Tue', risk: 66 },
  { day: 'Wed', risk: 68 },
  { day: 'Thu', risk: 69 },
  { day: 'Fri', risk: 71 },
  { day: 'Sat', risk: 72 },
  { day: 'Sun', risk: 74 },
]

export const highRiskAssets = [
  { asset: 'Reactor R-101', score: 86, status: 'Critical' },
  { asset: 'Tank Farm', score: 81, status: 'High' },
  { asset: 'Compressor Station', score: 74, status: 'Medium' },
  { asset: 'Cooling Tower', score: 69, status: 'Medium' },
  { asset: 'Pipeline C', score: 66, status: 'Medium' },
]

export const aiRecommendations = [
  'Inspect Reactor R-101 cooling loop and isolate unstable branch valve.',
  'Increase cooling-system monitoring during 08:00–16:00 high-load periods.',
  'Schedule preventive maintenance for compressor vibration anomalies.',
  'Increase monitoring around Tank Farm venting and thermal build-up points.',
  'Review high-risk staffing deployment in Zone C during maintenance windows.',
]

export const predictiveMaintenanceData = [
  { asset: 'R-101', nextDue: 'Within 5 days', confidence: 91 },
  { asset: 'Compressor', nextDue: 'Within 8 days', confidence: 88 },
  { asset: 'Cooling Tower', nextDue: 'Within 12 days', confidence: 85 },
  { asset: 'Pipeline C', nextDue: 'Within 15 days', confidence: 82 },
]

export const forecastConfidenceData = [
  { name: 'High Confidence', value: 52, color: '#10b981' },
  { name: 'Medium Confidence', value: 31, color: '#3b82f6' },
  { name: 'Low Confidence', value: 17, color: '#f59e0b' },
]

export const overviewRecommendationCards = recommendationCards

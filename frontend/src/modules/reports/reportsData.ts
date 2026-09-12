import {
  AlertTriangle,
  BellRing,
  BookCheck,
  FileText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

export const reportTabs = ['Overview', 'Incident Reports', 'Alert Reports', 'Compliance Reports', 'Performance Reports', 'Custom Reports'] as const

export type ReportTab = (typeof reportTabs)[number]

export const reportsKpis = [
  {
    title: 'TOTAL REPORTS',
    value: '128',
    delta: '↑ 15% vs last 7 days',
    tone: 'default',
    trend: 'up',
    icon: FileText,
    sparkline: [70, 76, 82, 79, 88, 96, 110, 128],
  },
  {
    title: 'INCIDENT REPORTS',
    value: '32',
    delta: '↑ 18% vs last 7 days',
    tone: 'critical',
    trend: 'up',
    icon: AlertTriangle,
    sparkline: [14, 17, 18, 21, 24, 25, 28, 32],
  },
  {
    title: 'ALERT REPORTS',
    value: '256',
    delta: '↓ 12% vs last 7 days',
    tone: 'warning',
    trend: 'down',
    icon: BellRing,
    sparkline: [260, 255, 250, 244, 238, 230, 240, 256],
  },
  {
    title: 'COMPLIANCE REPORTS',
    value: '48',
    delta: '↑ 8% vs last 7 days',
    tone: 'success',
    trend: 'up',
    icon: ShieldCheck,
    sparkline: [22, 25, 28, 31, 33, 36, 41, 48],
  },
  {
    title: 'PERFORMANCE REPORTS',
    value: '16',
    delta: '↑ 6% vs last 7 days',
    tone: 'default',
    trend: 'up',
    icon: TrendingUp,
    sparkline: [8, 9, 10, 11, 12, 13, 15, 16],
  },
  {
    title: 'CUSTOM REPORTS',
    value: '12',
    delta: '↓ 5% vs last 7 days',
    tone: 'warning',
    trend: 'down',
    icon: BookCheck,
    sparkline: [15, 14, 13, 14, 12, 11, 13, 12],
  },
]

export const reportTrendData = [
  { day: '10 May', total: 70, incident: 18, alert: 32, compliance: 12, performance: 8 },
  { day: '11 May', total: 74, incident: 20, alert: 31, compliance: 15, performance: 9 },
  { day: '12 May', total: 68, incident: 19, alert: 28, compliance: 13, performance: 8 },
  { day: '13 May', total: 81, incident: 24, alert: 35, compliance: 14, performance: 8 },
  { day: '14 May', total: 78, incident: 22, alert: 33, compliance: 12, performance: 9 },
  { day: '15 May', total: 86, incident: 25, alert: 38, compliance: 13, performance: 10 },
  { day: '16 May', total: 82, incident: 23, alert: 34, compliance: 15, performance: 10 },
  { day: '17 May', total: 128, incident: 32, alert: 56, compliance: 48, performance: 16 },
]

export const reportTypeData = [
  { name: 'Incident Reports', value: 32, percent: '25%', color: '#ef4444' },
  { name: 'Alert Reports', value: 56, percent: '44%', color: '#f59e0b' },
  { name: 'Compliance Reports', value: 24, percent: '19%', color: '#10b981' },
  { name: 'Performance Reports', value: 16, percent: '12%', color: '#3b82f6' },
]

export const reportCategoriesData = [
  { name: 'High Temperature', value: 28, fill: '#ef4444' },
  { name: 'Gas Leak', value: 22, fill: '#f97316' },
  { name: 'Permit Deviation', value: 18, fill: '#f59e0b' },
  { name: 'Equipment Failure', value: 16, fill: '#10b981' },
  { name: 'Fire / Explosion', value: 12, fill: '#3b82f6' },
  { name: 'Others', value: 10, fill: '#8b5cf6' },
]

export const recentReports = [
  {
    id: 'REP-2025-0517-128',
    type: 'Incident Report',
    title: 'High temperature in Reactor R-101',
    area: 'Zone C - Hot Work Area',
    reportedBy: 'AI System',
    date: '17 May 2025, 10:18 AM',
    severity: 'CRITICAL',
    status: 'Closed',
  },
  {
    id: 'REP-2025-0517-127',
    type: 'Alert Report',
    title: 'Gas leak detected - Line 27A',
    area: 'Near Compressor Station',
    reportedBy: 'AI System',
    date: '17 May 2025, 10:10 AM',
    severity: 'HIGH',
    status: 'Closed',
  },
  {
    id: 'REP-2025-0517-126',
    type: 'Compliance Report',
    title: 'Daily safety compliance check',
    area: 'All Areas',
    reportedBy: 'Safety Team',
    date: '17 May 2025, 09:45 AM',
    severity: 'MEDIUM',
    status: 'Completed',
  },
  {
    id: 'REP-2025-0517-125',
    type: 'Performance Report',
    title: 'Weekly safety performance summary',
    area: 'All Areas',
    reportedBy: 'System',
    date: '17 May 2025, 09:00 AM',
    severity: 'LOW',
    status: 'Completed',
  },
  {
    id: 'REP-2025-0517-124',
    type: 'Incident Report',
    title: 'Equipment vibration - Pump P-204',
    area: 'Zone D',
    reportedBy: 'AI System',
    date: '17 May 2025, 08:55 AM',
    severity: 'HIGH',
    status: 'In Progress',
  },
]

export const reportStatusData = [
  { name: 'Completed', value: 72, percent: '56%', color: '#10b981' },
  { name: 'Closed', value: 32, percent: '25%', color: '#3b82f6' },
  { name: 'In Progress', value: 16, percent: '12%', color: '#f59e0b' },
  { name: 'Pending', value: 8, percent: '7%', color: '#8b5cf6' },
]

export const exportHistory = [
  {
    title: 'Weekly Report (10 May - 17 May 2025)',
    format: 'PDF',
    date: '17 May 2025, 10:20 PM',
    user: 'Downloaded by Safety Head',
  },
  {
    title: 'Monthly Report (April 2025)',
    format: 'PDF',
    date: '01 May 2025, 09:30 AM',
    user: 'Downloaded by Safety Head',
  },
  {
    title: 'Compliance Report (April 2025)',
    format: 'Excel',
    date: '30 Apr 2025, 04:15 PM',
    user: 'Downloaded by Safety Head',
  },
]

export const reportTypeFilterOptions = ['All Reports', 'Incident Reports', 'Alert Reports', 'Compliance Reports', 'Performance Reports', 'Custom Reports']
export const shiftOptions = ['All Shifts', 'Shift A', 'Shift B', 'Shift C']
export const areaOptions = ['All Areas', 'Zone A', 'Zone B', 'Zone C', 'Zone D', 'All Areas']

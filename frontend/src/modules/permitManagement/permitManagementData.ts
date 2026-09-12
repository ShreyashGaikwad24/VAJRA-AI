import {
  AlertTriangle,
  BellRing,
  CalendarRange,
  CheckCheck,
  Clock3,
  FileCheck2,
  FileText,
  ShieldAlert,
  ShieldX,
  Sparkles,
  UserRound,
} from 'lucide-react'

export type PermitStatus = 'Active' | 'Pending' | 'Expired' | 'Cancelled' | 'Completed'
export type PermitType = 'Hot Work Permit' | 'Confined Space Entry' | 'Electrical Work Permit' | 'Excavation Permit' | 'Scaffolding Permit' | 'Others'

export type Permit = {
  id: string
  type: PermitType
  description: string
  area: string
  requestedBy: string
  validFrom: string
  validTo: string
  status: PermitStatus
  viewLabel?: string
}

export const permitTabs = ['Overview', 'All Permits', 'My Permits', 'Permit Register', 'Approvals', 'Permit Types', 'Templates', 'Settings'] as const
export type PermitTab = (typeof permitTabs)[number]

export const permitKpis = [
  {
    title: 'TOTAL PERMITS',
    value: '128',
    delta: '↑ 18% vs last 7 days',
    tone: 'default',
    trend: 'up',
    icon: FileText,
    sparkline: [70, 76, 80, 94, 88, 98, 116, 128],
  },
  {
    title: 'ACTIVE PERMITS',
    value: '45',
    delta: '↑ 12% vs last 7 days',
    tone: 'success',
    trend: 'up',
    icon: FileCheck2,
    sparkline: [17, 22, 24, 28, 30, 36, 40, 45],
  },
  {
    title: 'PENDING APPROVAL',
    value: '16',
    delta: '↓ 8% vs last 7 days',
    tone: 'warning',
    trend: 'down',
    icon: Clock3,
    sparkline: [25, 24, 20, 18, 17, 16, 18, 16],
  },
  {
    title: 'EXPIRED PERMITS',
    value: '3',
    delta: '↑ 3 vs last 7 days',
    tone: 'danger',
    trend: 'up',
    icon: ShieldAlert,
    sparkline: [1, 1, 2, 2, 2, 2, 3, 3],
  },
  {
    title: 'CANCELLED PERMITS',
    value: '10',
    delta: '↓ 5% vs last 7 days',
    tone: 'warning',
    trend: 'down',
    icon: ShieldX,
    sparkline: [16, 15, 14, 13, 12, 11, 10, 10],
  },
  {
    title: 'PERMITS TODAY',
    value: '12',
    delta: '↑ 20% vs yesterday',
    tone: 'default',
    trend: 'up',
    icon: CalendarRange,
    sparkline: [3, 4, 4, 5, 7, 8, 10, 12],
  },
] as const

export const permitStatusData = [
  { name: 'Active', value: 45, percent: '35%', color: '#3b82f6' },
  { name: 'Pending Approval', value: 16, percent: '13%', color: '#f59e0b' },
  { name: 'Expired', value: 3, percent: '2%', color: '#ef4444' },
  { name: 'Cancelled', value: 10, percent: '8%', color: '#a855f7' },
  { name: 'Completed', value: 54, percent: '42%', color: '#10b981' },
]

export const permitTrendData = [
  { day: '11 May', created: 24, approved: 11, closed: 15, cancelled: 4 },
  { day: '12 May', created: 35, approved: 16, closed: 21, cancelled: 6 },
  { day: '13 May', created: 31, approved: 11, closed: 17, cancelled: 4 },
  { day: '14 May', created: 38, approved: 14, closed: 20, cancelled: 8 },
  { day: '15 May', created: 33, approved: 17, closed: 24, cancelled: 11 },
  { day: '16 May', created: 34, approved: 14, closed: 20, cancelled: 7 },
  { day: '17 May', created: 38, approved: 14, closed: 23, cancelled: 6 },
]

export const permitTypeSummary = [
  { name: 'Hot Work Permit', value: 32, percent: '25%', color: '#ef4444' },
  { name: 'Confined Space Entry', value: 24, percent: '19%', color: '#a855f7' },
  { name: 'Electrical Work Permit', value: 18, percent: '14%', color: '#f59e0b' },
  { name: 'Excavation Permit', value: 16, percent: '13%', color: '#f97316' },
  { name: 'Scaffolding Permit', value: 12, percent: '9%', color: '#10b981' },
  { name: 'Others', value: 26, percent: '20%', color: '#a1a1aa' },
]

export const permitRows: Permit[] = [
  {
    id: 'PRM-2025-0517-128',
    type: 'Hot Work Permit',
    description: 'Welding on pipe line',
    area: 'Reactor Area - Zone C',
    requestedBy: 'Rajesh Kumar',
    validFrom: '17 May 2025\n08:00 AM',
    validTo: '17 May 2025\n06:00 PM',
    status: 'Active',
  },
  {
    id: 'PRM-2025-0517-127',
    type: 'Confined Space Entry',
    description: 'Inspection of storage tank',
    area: 'Tank Farm - T-101',
    requestedBy: 'Amit Patel',
    validFrom: '17 May 2025\n09:00 AM',
    validTo: '17 May 2025\n05:00 PM',
    status: 'Pending',
  },
  {
    id: 'PRM-2025-0517-126',
    type: 'Electrical Work Permit',
    description: 'Cable tray installation',
    area: 'Utility Area',
    requestedBy: 'Priya Sharma',
    validFrom: '17 May 2025\n10:00 AM',
    validTo: '17 May 2025\n04:00 PM',
    status: 'Active',
  },
  {
    id: 'PRM-2025-0517-125',
    type: 'Excavation Permit',
    description: 'Excavation for drain line',
    area: 'Offsite Area - Gate 2',
    requestedBy: 'Suresh Yadav',
    validFrom: '16 May 2025\n08:00 AM',
    validTo: '18 May 2025\n06:00 PM',
    status: 'Active',
  },
  {
    id: 'PRM-2025-0517-124',
    type: 'Scaffolding Permit',
    description: 'Scaffolding erection',
    area: 'Compressor Station',
    requestedBy: 'Vikram Singh',
    validFrom: '16 May 2025\n09:00 AM',
    validTo: '17 May 2025\n06:00 PM',
    status: 'Expired',
  },
  {
    id: 'PRM-2025-0517-123',
    type: 'Hot Work Permit',
    description: 'Pipeline repair and inspection',
    area: 'Reactor Area - Zone B',
    requestedBy: 'Rakesh Verma',
    validFrom: '15 May 2025\n07:00 AM',
    validTo: '15 May 2025\n03:00 PM',
    status: 'Completed',
  },
  {
    id: 'PRM-2025-0517-122',
    type: 'Electrical Work Permit',
    description: 'Panel maintenance',
    area: 'Utility Area',
    requestedBy: 'Nisha Singh',
    validFrom: '14 May 2025\n11:00 AM',
    validTo: '14 May 2025\n05:00 PM',
    status: 'Cancelled',
  },
]

export const permitTasks = [
  {
    id: 'PRM-2025-0517-127',
    title: 'Confined Space Entry - Tank T-101',
    status: 'Pending Approval',
    submittedOn: '17 May 2025, 09:15 AM',
    dueIn: '2h 35m',
  },
  {
    id: 'PRM-2025-0517-130',
    title: 'Hot Work Permit - Pipeline Repair',
    status: 'Approval Required',
    submittedOn: '17 May 2025, 10:05 AM',
    dueIn: '4h 10m',
  },
  {
    id: 'PRM-2025-0517-129',
    title: 'Electrical Work - Cable Installation',
    status: 'Expiring Soon',
    submittedOn: '17 May 2025, 06:00 PM',
    dueIn: '7h 35m',
  },
]

export const permitTemplates = [
  { id: 'TPL-01', title: 'Hot Work Permit', category: 'Hot Work', owner: 'Safety Team' },
  { id: 'TPL-02', title: 'Confined Space Entry', category: 'Entry', owner: 'Maintenance Team' },
  { id: 'TPL-03', title: 'Electrical Isolation Permit', category: 'Electrical', owner: 'Electrical Team' },
  { id: 'TPL-04', title: 'Excavation Permit', category: 'Civil', owner: 'Site Works Team' },
]

export const permitSettings = [
  'Approval workflow',
  'Expiry rules',
  'Notification rules',
  'Required fields',
  'Permit escalation thresholds',
  'Audit log retention',
]

export const statusOptions = ['All Status', 'Active', 'Pending', 'Expired', 'Cancelled', 'Completed']
export const areaOptions = ['All Areas', 'Reactor Area - Zone C', 'Tank Farm - T-101', 'Utility Area', 'Offsite Area - Gate 2', 'Compressor Station']
export const permitTypeFilterOptions = ['All Types', 'Hot Work Permit', 'Confined Space Entry', 'Electrical Work Permit', 'Excavation Permit', 'Scaffolding Permit', 'Others']

export const quickActionIcons = [
  Sparkles,
  FileText,
  CheckCheck,
  UserRound,
  AlertTriangle,
  BellRing,
]

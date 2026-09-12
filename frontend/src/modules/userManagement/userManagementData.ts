import {
  Activity,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileLock2,
  Lock,
  ShieldCheck,
  ShieldPlus,
  Users,
} from 'lucide-react'

export type UserRole = 'Administrator' | 'Safety Head' | 'Safety Officer' | 'Maintenance' | 'Operations' | 'Contractor' | 'Others'
export type UserStatus = 'Active' | 'Inactive' | 'Locked'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  status: UserStatus
  lastLogin: string
  avatar: string
}

export type AccessRequest = {
  id: string
  requester: string
  module: string
  priority: 'High' | 'Medium' | 'Low'
  requestedAt: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export type UserGroup = {
  id: string
  name: string
  members: number
  lead: string
  description: string
}

export type ActivityLog = {
  id: string
  user: string
  action: string
  module: string
  timestamp: string
  status: 'Success' | 'Warning' | 'Info'
}

export type Permission = {
  id: string
  name: string
  scope: string
  risk: 'High' | 'Medium' | 'Low'
}

export const userTabs = ['Overview', 'All Users', 'Roles & Permissions', 'User Groups', 'Access Requests', 'Activity Log', 'Settings'] as const
export type UserTab = (typeof userTabs)[number]

export const userKpis = [
  {
    title: 'TOTAL USERS',
    value: '248',
    delta: '↑ 12% vs last 7 days',
    tone: 'default',
    trend: 'up',
    icon: Users,
    sparkline: [160, 170, 177, 190, 206, 220, 238, 248],
  },
  {
    title: 'ACTIVE USERS',
    value: '198',
    delta: '↑ 15% vs last 7 days',
    tone: 'success',
    trend: 'up',
    icon: CheckCircle2,
    sparkline: [120, 130, 142, 155, 169, 181, 190, 198],
  },
  {
    title: 'INACTIVE USERS',
    value: '25',
    delta: '↓ 8% vs last 7 days',
    tone: 'warning',
    trend: 'down',
    icon: Activity,
    sparkline: [32, 31, 29, 28, 26, 25, 24, 25],
  },
  {
    title: 'LOCKED USERS',
    value: '8',
    delta: '↓ 20% vs last 7 days',
    tone: 'danger',
    trend: 'down',
    icon: Lock,
    sparkline: [10, 9, 9, 8, 8, 8, 8, 8],
  },
  {
    title: 'NEW USERS (THIS WEEK)',
    value: '16',
    delta: '↑ 20% vs last week',
    tone: 'default',
    trend: 'up',
    icon: ShieldPlus,
    sparkline: [4, 5, 5, 7, 8, 10, 12, 16],
  },
  {
    title: 'PENDING REQUESTS',
    value: '7',
    delta: 'Requires approval',
    tone: 'warning',
    trend: 'flat',
    icon: BellRing,
    sparkline: [2, 3, 3, 4, 5, 5, 6, 7],
  },
] as const

export const userTrendData = [
  { day: '11 May', users: 175 },
  { day: '12 May', users: 195 },
  { day: '13 May', users: 203 },
  { day: '14 May', users: 214 },
  { day: '15 May', users: 237 },
  { day: '16 May', users: 238 },
  { day: '17 May', users: 248 },
]

export const userRoleData = [
  { name: 'Administrator', value: 24, percent: '10%', color: '#8b5cf6' },
  { name: 'Safety Head', value: 32, percent: '13%', color: '#3b82f6' },
  { name: 'Safety Officer', value: 56, percent: '23%', color: '#22d3ee' },
  { name: 'Maintenance', value: 48, percent: '19%', color: '#f59e0b' },
  { name: 'Operations', value: 40, percent: '16%', color: '#10b981' },
  { name: 'Contractor', value: 28, percent: '11%', color: '#f97316' },
  { name: 'Others', value: 20, percent: '8%', color: '#94a3b8' },
]

export const userStatusData = [
  { name: 'Active', value: 198, percent: '80%', color: '#22c55e' },
  { name: 'Inactive', value: 25, percent: '10%', color: '#a1a1aa' },
  { name: 'Locked', value: 8, percent: '3%', color: '#ef4444' },
]

export const roleOptions = ['All Roles', 'Administrator', 'Safety Head', 'Safety Officer', 'Maintenance', 'Operations', 'Contractor']
export const statusOptions = ['All Status', 'Active', 'Inactive', 'Locked']

export const users: User[] = [
  { id: 'USR-2025-001', name: 'Rajesh Kumar', email: 'rajesh.kumar@jamref.com', role: 'Administrator', department: 'Safety', status: 'Active', lastLogin: '17 May 2025, 09:45 AM', avatar: 'RK' },
  { id: 'USR-2025-002', name: 'Priya Sharma', email: 'priya.sharma@jamref.com', role: 'Safety Head', department: 'Safety', status: 'Active', lastLogin: '17 May 2025, 09:20 AM', avatar: 'PS' },
  { id: 'USR-2025-003', name: 'Amit Patel', email: 'amit.patel@jamref.com', role: 'Safety Officer', department: 'Safety', status: 'Active', lastLogin: '17 May 2025, 08:50 AM', avatar: 'AP' },
  { id: 'USR-2025-004', name: 'Vikram Singh', email: 'vikram.singh@jamref.com', role: 'Maintenance', department: 'Maintenance', status: 'Active', lastLogin: '17 May 2025, 08:15 AM', avatar: 'VS' },
  { id: 'USR-2025-005', name: 'Suresh Yadav', email: 'suresh.yadav@jamref.com', role: 'Operations', department: 'Operations', status: 'Inactive', lastLogin: '15 May 2025, 04:30 PM', avatar: 'SY' },
  { id: 'USR-2025-006', name: 'Mohammed Danish', email: 'danish@jamref.com', role: 'Contractor', department: 'Contractor', status: 'Active', lastLogin: '17 May 2025, 07:10 AM', avatar: 'MD' },
  { id: 'USR-2025-007', name: 'Neha Pillai', email: 'neha.pillai@jamref.com', role: 'Safety Officer', department: 'Safety', status: 'Locked', lastLogin: '10 May 2025, 11:20 AM', avatar: 'NP' },
  { id: 'USR-2025-008', name: 'Arun Rao', email: 'arun.rao@jamref.com', role: 'Maintenance', department: 'Maintenance', status: 'Active', lastLogin: '17 May 2025, 09:05 AM', avatar: 'AR' },
  { id: 'USR-2025-009', name: 'Rohit Verma', email: 'rohit.verma@jamref.com', role: 'Operations', department: 'Emergency', status: 'Active', lastLogin: '16 May 2025, 04:40 PM', avatar: 'RV' },
  { id: 'USR-2025-010', name: 'Karan Mehta', email: 'karan.mehta@jamref.com', role: 'Safety Officer', department: 'Safety', status: 'Active', lastLogin: '16 May 2025, 07:15 AM', avatar: 'KM' },
  { id: 'USR-2025-011', name: 'Imran Sheikh', email: 'imran.sheikh@jamref.com', role: 'Operations', department: 'Analytics', status: 'Inactive', lastLogin: '12 May 2025, 09:00 AM', avatar: 'IS' },
  { id: 'USR-2025-012', name: 'Pooja Nair', email: 'pooja.nair@jamref.com', role: 'Safety Head', department: 'Permit Management', status: 'Active', lastLogin: '17 May 2025, 10:10 AM', avatar: 'PN' },
]

export const pendingRequests: AccessRequest[] = [
  { id: 'REQ-2041', requester: 'Rohit Verma', module: 'Emergency Mode', priority: 'High', requestedAt: '17 May 2025, 09:15 AM', status: 'Pending' },
  { id: 'REQ-2042', requester: 'Karan Mehta', module: 'Incident Replay', priority: 'Medium', requestedAt: '17 May 2025, 08:50 AM', status: 'Pending' },
  { id: 'REQ-2043', requester: 'Imran Sheikh', module: 'Analytics & Insights', priority: 'Medium', requestedAt: '17 May 2025, 08:10 AM', status: 'Pending' },
  { id: 'REQ-2044', requester: 'Pooja Nair', module: 'Permit Management', priority: 'Low', requestedAt: '16 May 2025, 05:30 PM', status: 'Pending' },
]

export const rolePermissions: Array<{ name: UserRole; users: number; permissions: string[] }> = [
  { name: 'Administrator', users: 24, permissions: ['Full system access', 'User lifecycle', 'Security policy'] },
  { name: 'Safety Head', users: 32, permissions: ['Management approvals', 'Safety dashboards', 'Audit review'] },
  { name: 'Safety Officer', users: 56, permissions: ['Incident response', 'Safety logs', 'Ward checks'] },
  { name: 'Maintenance', users: 48, permissions: ['Maintenance logs', 'Asset access', 'Permit workflows'] },
  { name: 'Operations', users: 40, permissions: ['Shift dashboards', 'Planner tasks', 'Runtime controls'] },
  { name: 'Contractor', users: 28, permissions: ['Limited site access', 'Permit approvals', 'Restricted modules'] },
]

export const userGroups: UserGroup[] = [
  { id: 'GRP-01', name: 'Safety Team', members: 42, lead: 'Priya Sharma', description: 'Emergency response and safety operations' },
  { id: 'GRP-02', name: 'Operations Team', members: 38, lead: 'Suresh Yadav', description: 'Production monitoring and shift coordination' },
  { id: 'GRP-03', name: 'Maintenance Team', members: 27, lead: 'Vikram Singh', description: 'Equipment checks and scheduled maintenance' },
  { id: 'GRP-04', name: 'Emergency Response Team', members: 15, lead: 'Rajesh Kumar', description: 'Critical response and incident escalation' },
  { id: 'GRP-05', name: 'Contractors', members: 18, lead: 'Mohammed Danish', description: 'External workforce with limited access' },
]

export const activityLogs: ActivityLog[] = [
  { id: 'ACT-401', user: 'Rajesh Kumar', action: 'Approved access request', module: 'Emergency Mode', timestamp: '17 May 2025, 10:15 AM', status: 'Success' },
  { id: 'ACT-402', user: 'Priya Sharma', action: 'Updated role permissions', module: 'User Management', timestamp: '17 May 2025, 09:42 AM', status: 'Info' },
  { id: 'ACT-403', user: 'Vikram Singh', action: 'Reset password', module: 'User Management', timestamp: '17 May 2025, 09:10 AM', status: 'Warning' },
  { id: 'ACT-404', user: 'Suresh Yadav', action: 'Locked account', module: 'User Management', timestamp: '15 May 2025, 04:00 PM', status: 'Warning' },
  { id: 'ACT-405', user: 'Neha Pillai', action: 'Requested module access', module: 'Analytics & Insights', timestamp: '10 May 2025, 11:20 AM', status: 'Info' },
]

export const accessRequestRows: AccessRequest[] = [
  { id: 'REQ-2041', requester: 'Rohit Verma', module: 'Emergency Mode', priority: 'High', requestedAt: '17 May 2025, 09:15 AM', status: 'Pending' },
  { id: 'REQ-2042', requester: 'Karan Mehta', module: 'Incident Replay', priority: 'Medium', requestedAt: '17 May 2025, 08:50 AM', status: 'Pending' },
  { id: 'REQ-2043', requester: 'Imran Sheikh', module: 'Analytics & Insights', priority: 'Medium', requestedAt: '17 May 2025, 08:10 AM', status: 'Approved' },
  { id: 'REQ-2044', requester: 'Pooja Nair', module: 'Permit Management', priority: 'Low', requestedAt: '16 May 2025, 05:30 PM', status: 'Rejected' },
]

export const userSettings = [
  'Password Policy',
  'Session Timeout',
  'Account Lockout',
  'Approval Requirements',
  'Notification Settings',
]

export const userPermissions: Permission[] = [
  { id: 'P-101', name: 'Emergency Access', scope: 'Emergency Mode', risk: 'High' },
  { id: 'P-102', name: 'Safety Review', scope: 'Incident Replay', risk: 'Medium' },
  { id: 'P-103', name: 'Permit Approval', scope: 'Permit Management', risk: 'High' },
  { id: 'P-104', name: 'Asset Monitoring', scope: 'Digital Twin', risk: 'Low' },
]

export const quickActions = ['Add New User', 'Add New Role', 'Create Group', 'Import Users']

export const userRoleBadgeClasses: Record<UserRole, string> = {
  Administrator: 'border-violet-500/35 bg-violet-500/10 text-violet-200',
  'Safety Head': 'border-blue-500/35 bg-blue-500/10 text-blue-200',
  'Safety Officer': 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200',
  Maintenance: 'border-orange-500/35 bg-orange-500/10 text-orange-200',
  Operations: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
  Contractor: 'border-amber-500/35 bg-amber-500/10 text-amber-200',
  Others: 'border-slate-500/35 bg-slate-500/10 text-slate-200',
}

export const userStatusBadgeClasses: Record<UserStatus, string> = {
  Active: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
  Inactive: 'border-slate-500/35 bg-slate-500/10 text-slate-200',
  Locked: 'border-red-500/35 bg-red-500/10 text-red-200',
}

export const priorityClasses = {
  High: 'border-red-500/35 bg-red-500/10 text-red-200',
  Medium: 'border-orange-500/35 bg-orange-500/10 text-orange-200',
  Low: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
} as const

export const accentIcons = [ShieldCheck, BriefcaseBusiness, ClipboardCheck, FileLock2, CalendarClock]

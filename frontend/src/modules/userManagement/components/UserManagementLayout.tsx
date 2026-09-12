import { useMemo, useState } from 'react'

import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  Download,
  Edit3,
  Eye,
  Filter,
  Lock,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import { MetricCard } from '@/components/cards/MetricCard'
import { Panel } from '@/components/cards/Panel'
import { SearchBox } from '@/components/common/SearchBox'
import { SelectField } from '@/components/common/SelectField'
import {
  accessRequestRows,
  activityLogs,
  pendingRequests,
  priorityClasses,
  roleOptions,
  rolePermissions,
  statusOptions,
  userGroups,
  userKpis,
  userRoleBadgeClasses,
  userRoleData,
  userSettings,
  userStatusBadgeClasses,
  userStatusData,
  userTabs,
  userTrendData,
  users,
  type User,
  type UserStatus,
  type UserTab,
} from '@/modules/userManagement/userManagementData'
import { cn } from '@/utils/cn'

const roleFilterOptions = roleOptions
const statusFilterOptions = statusOptions

function getUserInitials(name: string) {
  return name
    .split(' ')
    .map((token) => token[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function UserActionMenu({
  user,
  onClose,
  onView,
  onEdit,
  onToggleLock,
}: {
  user: User
  onClose: () => void
  onView: (value: User) => void
  onEdit: (value: User) => void
  onToggleLock: (value: User) => void
}) {
  return (
    <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-md border border-border/70 bg-slate-950/95 p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.8)]">
      <button type="button" onClick={() => { onView(user); onClose() }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-200 hover:bg-background/70">
        <Eye className="size-3" /> View
      </button>
      <button type="button" onClick={() => { onEdit(user); onClose() }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-200 hover:bg-background/70">
        <Edit3 className="size-3" /> Edit
      </button>
      <button type="button" onClick={() => { onToggleLock(user); onClose() }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-200 hover:bg-background/70">
        <Lock className="size-3" /> {user.status === 'Locked' ? 'Unlock' : 'Lock'}
      </button>
      <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-200 hover:bg-background/70">
        <Trash2 className="size-3" /> Deactivate
      </button>
    </div>
  )
}

function UserTable({
  data,
  onView,
  onEdit,
  onToggleLock,
}: {
  data: User[]
  onView: (value: User) => void
  onEdit: (value: User) => void
  onToggleLock: (value: User) => void
}) {
  const [menuUserId, setMenuUserId] = useState<string | null>(null)

  return (
    <div className="overflow-hidden rounded border border-border/70 bg-background/35">
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-collapse text-[9px]">
          <thead>
            <tr className="border-b border-border/70 bg-background/55 text-left">
              {['User ID', 'User Name', 'Email', 'Role', 'Department', 'Status', 'Last Login', 'Actions'].map((header) => (
                <th key={header} className="px-2 py-2 font-semibold uppercase tracking-[0.12em] text-muted-foreground">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id} className="border-b border-border/70 last:border-b-0 hover:bg-primary/5">
                <td className="px-2 py-2 text-slate-200">{user.id}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full border border-border/70 bg-slate-800 text-[8px] font-bold text-foreground" style={{ backgroundColor: user.id.endsWith('001') ? '#4338ca22' : user.id.endsWith('002') ? '#1d4ed822' : user.id.endsWith('003') ? '#0f766e22' : user.id.endsWith('004') ? '#c2410c22' : user.id.endsWith('005') ? '#374151' : user.id.endsWith('006') ? '#7c3aed22' : user.id.endsWith('007') ? '#0f172a' : '#1d4ed822' }}>
                      {getUserInitials(user.name)}
                    </div>
                    <span className="text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-slate-200">{user.email}</td>
                <td className="px-2 py-2"><span className={cn('inline-flex rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]', userRoleBadgeClasses[user.role])}>{user.role}</span></td>
                <td className="px-2 py-2 text-slate-200">{user.department}</td>
                <td className="px-2 py-2"><span className={cn('inline-flex rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]', userStatusBadgeClasses[user.status])}>{user.status}</span></td>
                <td className="px-2 py-2 text-slate-200">{user.lastLogin}</td>
                <td className="px-2 py-2">
                  <div className="relative flex items-center gap-1.5">
                    <button type="button" onClick={() => onView(user)} className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                      <Eye className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => onEdit(user)} className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                      <Edit3 className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => setMenuUserId((current) => (current === user.id ? null : user.id))} className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                      <MoreHorizontal className="size-3.5" />
                    </button>
                    {menuUserId === user.id ? (
                      <UserActionMenu user={user} onClose={() => setMenuUserId(null)} onView={onView} onEdit={onEdit} onToggleLock={onToggleLock} />
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OverviewView({
  filteredUsers,
  onView,
  onEdit,
  onToggleLock,
}: {
  filteredUsers: User[]
  onView: (value: User) => void
  onEdit: (value: User) => void
  onToggleLock: (value: User) => void
}) {
  return (
    <div className="space-y-2.5">
      <div className="grid gap-2.5 xl:grid-cols-6">
        {userKpis.map((item, index) => (
          <MetricCard
            key={item.title}
            label={item.title}
            value={item.value}
            delta={item.delta}
            tone={item.tone as 'default' | 'success' | 'warning' | 'danger' | 'critical'}
            trend={item.trend as 'up' | 'down' | 'flat'}
            icon={item.icon}
            sparkline={Array.from(item.sparkline)}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">USERS OVER TIME</div>
              <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
                Last 7 Days <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userTrendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Line type="monotone" dataKey="users" stroke="#38bdf8" strokeWidth={2.2} dot={{ r: 2.2, fill: '#38bdf8' }} name="Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">USERS BY ROLE</div>
              <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
                This Week <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[170px] w-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={userRoleData} dataKey="value" innerRadius={42} outerRadius={66} paddingAngle={2} stroke="transparent">
                      {userRoleData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[22px] font-black text-foreground">248</div>
                    <div className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1.5 text-[9px] text-muted-foreground">
              {userRoleData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-foreground">{item.value} ({item.percent})</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">USERS BY STATUS</div>
              <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
                This Week <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[120px] w-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={userStatusData} dataKey="value" innerRadius={30} outerRadius={50} paddingAngle={2} stroke="transparent">
                      {userStatusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[18px] font-black text-foreground">248</div>
                    <div className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1.5 text-[9px] text-muted-foreground">
              {userStatusData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-foreground">{item.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
                    <div className="h-full rounded-full" style={{ width: `${Math.min((item.value / 248) * 100, 100)}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.9fr)_minmax(250px,0.9fr)]">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENT USERS</div>
            <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View All</button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-border/70 bg-background/35 p-2">
            <div className="min-w-[200px] flex-1">
              <SearchBox placeholder="Search users..." className="h-9 border-border/70 bg-[#0f1725] text-[10px]" />
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
              All Roles <ChevronDown className="size-3" />
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
              All Status <ChevronDown className="size-3" />
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-foreground">
              <Filter className="size-3" /> Filters
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-primary">
              <Plus className="size-3" /> Add New User
            </button>
          </div>

          {filteredUsers.length > 0 ? (
            <>
              <UserTable data={filteredUsers.slice(0, 8)} onView={onView} onEdit={onEdit} onToggleLock={onToggleLock} />
              <div className="mt-3 flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                <span>Showing 1 to {Math.min(filteredUsers.length, 8)} of {filteredUsers.length} users</span>
                <div className="flex items-center gap-1">
                  <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">&lt;</button>
                  <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-primary/40 bg-primary/10 text-primary">1</button>
                  <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">2</button>
                  <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">3</button>
                  <span className="px-1 text-slate-300">...</span>
                  <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">31</button>
                  <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">&gt;</button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded border border-border/70 bg-background/35 p-6 text-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              No matching users found
            </div>
          )}
        </Panel>

        <div className="space-y-2.5">
          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PENDING ACCESS REQUESTS</div>
              <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View All</button>
            </div>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div key={request.id} className="rounded border border-border/70 bg-background/35 p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full border border-border/70 bg-slate-800 text-[8px] font-bold text-foreground">{getUserInitials(request.requester)}</div>
                      <div>
                        <div className="text-[9px] font-medium text-foreground">{request.requester}</div>
                        <div className="mt-1 text-[8px] text-muted-foreground">Requesting access to {request.module}</div>
                      </div>
                    </div>
                    <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', priorityClasses[request.priority])}>{request.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">QUICK ACTIONS</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add New User', icon: Users },
                { label: 'Add New Role', icon: ShieldCheck },
                { label: 'Create Group', icon: BriefcaseBusiness },
                { label: 'Import Users', icon: Download },
              ].map(({ label, icon: Icon }) => (
                <button key={label} type="button" className="flex min-h-[72px] flex-col items-center justify-center gap-2 rounded border border-border/70 bg-background/35 px-2 py-2 text-center text-[9px] font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5">
                  <span className="flex size-7 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-200">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="leading-3">{label}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function AllUsersTab({
  usersList,
  onView,
  onEdit,
  onToggleLock,
}: {
  usersList: User[]
  onView: (value: User) => void
  onEdit: (value: User) => void
  onToggleLock: (value: User) => void
}) {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALL USERS</div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-foreground">
          <Plus className="size-3" /> Add New User
        </button>
      </div>
      <UserTable data={usersList} onView={onView} onEdit={onEdit} onToggleLock={onToggleLock} />
    </Panel>
  )
}

function RolesPermissionsTab() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ROLES &amp; PERMISSIONS</div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {rolePermissions.map((role) => (
          <div key={role.name} className="rounded border border-border/70 bg-background/35 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', userRoleBadgeClasses[role.name])}>{role.name}</span>
              <span className="text-[8px] text-muted-foreground">{role.users} users</span>
            </div>
            <ul className="space-y-1.5 text-[9px] text-muted-foreground">
              {role.permissions.map((permission) => (
                <li key={permission} className="flex items-center gap-2"><span className="inline-flex size-1.5 rounded-full bg-cyan-300" /> {permission}</li>
              ))}
            </ul>
            <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[8px] uppercase tracking-[0.12em] text-foreground">
              Edit role <ArrowRight className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function UserGroupsTab() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">USER GROUPS</div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-foreground">
          <Plus className="size-3" /> New Group
        </button>
      </div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {userGroups.map((group) => (
          <div key={group.id} className="rounded border border-border/70 bg-background/35 p-3">
            <div className="mb-1 text-[8px] uppercase tracking-[0.12em] text-cyan-300">{group.id}</div>
            <div className="text-[10px] font-semibold text-foreground">{group.name}</div>
            <div className="mt-2 text-[8px] text-muted-foreground">{group.members} members · Lead: {group.lead}</div>
            <div className="mt-2 text-[8px] text-muted-foreground">{group.description}</div>
            <div className="mt-3 flex items-center gap-2">
              <button type="button" className="rounded border border-border/70 bg-background/40 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-foreground">View</button>
              <button type="button" className="rounded border border-primary/40 bg-primary/10 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-primary">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function AccessRequestsTab() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ACCESS REQUESTS</div>
      <div className="space-y-2">
        {accessRequestRows.map((request) => (
          <div key={request.id} className="flex items-center justify-between gap-3 rounded border border-border/70 bg-background/35 p-2.5">
            <div>
              <div className="text-[9px] font-semibold text-foreground">{request.requester}</div>
              <div className="text-[8px] text-muted-foreground">{request.module} · {request.requestedAt}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', priorityClasses[request.priority])}>{request.priority}</span>
              <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', request.status === 'Pending' ? 'border-amber-500/35 bg-amber-500/10 text-amber-200' : request.status === 'Approved' ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200' : 'border-red-500/35 bg-red-500/10 text-red-200')}>{request.status}</span>
              <button type="button" className="rounded border border-border/70 bg-background/40 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-foreground">Review</button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function ActivityLogTab() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ACTIVITY LOG</div>
      <div className="space-y-2">
        {activityLogs.map((log) => (
          <div key={log.id} className="flex items-center justify-between gap-3 rounded border border-border/70 bg-background/35 p-2.5">
            <div>
              <div className="text-[9px] font-semibold text-foreground">{log.user}</div>
              <div className="text-[8px] text-muted-foreground">{log.action} · {log.module}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', log.status === 'Success' ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200' : log.status === 'Warning' ? 'border-amber-500/35 bg-amber-500/10 text-amber-200' : 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200')}>{log.status}</span>
              <span className="text-[8px] text-muted-foreground">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function SettingsTab() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">SETTINGS</div>
      <div className="grid gap-2 md:grid-cols-2">
        {userSettings.map((setting) => (
          <div key={setting} className="flex items-center justify-between gap-3 rounded border border-border/70 bg-background/35 p-2.5">
            <span className="text-[9px] font-medium text-foreground">{setting}</span>
            <button type="button" className="text-[8px] uppercase tracking-[0.12em] text-cyan-300">Configure</button>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function UserManagementLayout() {
  const [allUsers, setAllUsers] = useState<User[]>(users)
  const [activeTab, setActiveTab] = useState<UserTab>('Overview')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedUser, setSelectedUser] = useState<User | null>(users[0])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Safety Officer' as User['role'], department: 'Safety', status: 'Active' as UserStatus })

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const query = search.trim().toLowerCase()
      const matchesQuery =
        query.length === 0 ||
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)

      const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
      const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [allUsers, search, roleFilter, statusFilter])

  const handleToggleLock = (user: User) => {
    setAllUsers((current) => current.map((entry) => entry.id === user.id ? { ...entry, status: entry.status === 'Locked' ? 'Active' : 'Locked' } : entry))
  }

  const handleAddUser = () => {
    if (!formData.name.trim() || !formData.email.trim()) return

    const nextUser: User = {
      id: `USR-${new Date().getFullYear()}-${String(allUsers.length + 1).padStart(3, '0')}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department,
      status: formData.status,
      lastLogin: 'Just now',
      avatar: getUserInitials(formData.name.trim()),
    }

    setAllUsers((current) => [nextUser, ...current])
    setFormData({ name: '', email: '', role: 'Safety Officer', department: 'Safety', status: 'Active' })
    setIsAddUserOpen(false)
    setActiveTab('All Users')
  }

  const renderTabView = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewView filteredUsers={filteredUsers} onView={setSelectedUser} onEdit={setEditingUser} onToggleLock={handleToggleLock} />
      case 'All Users':
        return <AllUsersTab usersList={filteredUsers} onView={setSelectedUser} onEdit={setEditingUser} onToggleLock={handleToggleLock} />
      case 'Roles & Permissions':
        return <RolesPermissionsTab />
      case 'User Groups':
        return <UserGroupsTab />
      case 'Access Requests':
        return <AccessRequestsTab />
      case 'Activity Log':
        return <ActivityLogTab />
      case 'Settings':
        return <SettingsTab />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-0.5">
      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">USER MANAGEMENT</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Manage Users, Roles, Permissions &amp; Access Control</div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <div className="rounded border border-border/70 bg-background/35 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Plant: Jamnagar Refinery</div>
            <div className="rounded border border-border/70 bg-background/35 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Date &amp; Time: 17 May 2025, 10:24:35 AM</div>
            <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-red-200">System Status: EMERGENCY</div>
          </div>
        </div>

        <nav className="mt-2 flex flex-wrap items-center gap-1.5">
          {userTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all',
                activeTab === tab ? 'border-red-500/50 bg-red-500/10 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.12)]' : 'border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-background/60 hover:text-foreground',
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Overview' && (
        <div className="rounded-md border border-border/80 bg-card/80 p-2">
          <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto]">
            <SearchBox value={search} onChange={setSearch} placeholder="Search users..." className="h-9 border-border/70 bg-[#0f1725] text-[10px]" />
            <SelectField label="Role" value={roleFilter} options={roleFilterOptions} onChange={setRoleFilter} className="min-w-[140px]" />
            <SelectField label="Status" value={statusFilter} options={statusFilterOptions} onChange={setStatusFilter} className="min-w-[150px]" />
            <button type="button" onClick={() => setActiveTab('All Users')} className="inline-flex items-center justify-center gap-2 rounded-md border border-border/70 bg-background/40 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground hover:border-red-500/40 hover:text-red-200">
              <Filter className="size-3.5" /> Filters
            </button>
          </div>
        </div>
      )}

      {renderTabView()}

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-xl rounded-xl border border-border/80 bg-[#081722] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">USER DETAILS</div>
              <button type="button" onClick={() => setSelectedUser(null)} className="rounded border border-border/70 bg-background/40 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-foreground">Close</button>
            </div>
            <div className="rounded border border-border/70 bg-background/35 p-3">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-slate-800 text-[10px] font-bold text-foreground">{getUserInitials(selectedUser.name)}</div>
                <div>
                  <div className="text-[11px] font-semibold text-foreground">{selectedUser.name}</div>
                  <div className="text-[9px] text-muted-foreground">{selectedUser.id}</div>
                </div>
              </div>
              <div className="grid gap-2 text-[9px] text-muted-foreground md:grid-cols-2">
                <div><span className="text-foreground">Email:</span> {selectedUser.email}</div>
                <div><span className="text-foreground">Role:</span> {selectedUser.role}</div>
                <div><span className="text-foreground">Department:</span> {selectedUser.department}</div>
                <div><span className="text-foreground">Status:</span> {selectedUser.status}</div>
                <div className="md:col-span-2"><span className="text-foreground">Last Login:</span> {selectedUser.lastLogin}</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => { setEditingUser(selectedUser); setSelectedUser(null) }} className="rounded border border-border/70 bg-background/40 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-foreground">Edit</button>
              <button type="button" onClick={() => handleToggleLock(selectedUser)} className="rounded border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-red-200">{selectedUser.status === 'Locked' ? 'Unlock' : 'Lock'}</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border/80 bg-[#081722] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">EDIT USER</div>
              <button type="button" onClick={() => setEditingUser(null)} className="rounded border border-border/70 bg-background/40 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-foreground">Close</button>
            </div>
            <div className="space-y-2.5">
              <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Full Name
                <input value={editingUser.name} onChange={(event) => setEditingUser({ ...editingUser, name: event.target.value })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none" />
              </label>
              <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Email
                <input value={editingUser.email} onChange={(event) => setEditingUser({ ...editingUser, email: event.target.value })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none" />
              </label>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  Role
                  <select value={editingUser.role} onChange={(event) => setEditingUser({ ...editingUser, role: event.target.value as User['role'] })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none">
                    {roleOptions.filter((option) => option !== 'All Roles').map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  Department
                  <input value={editingUser.department} onChange={(event) => setEditingUser({ ...editingUser, department: event.target.value })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none" />
                </label>
              </div>
              <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Status
                <select value={editingUser.status} onChange={(event) => setEditingUser({ ...editingUser, status: event.target.value as UserStatus })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none">
                  {statusOptions.filter((option) => option !== 'All Status').map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setEditingUser(null)} className="rounded border border-border/70 bg-background/40 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-foreground">Cancel</button>
              <button type="button" onClick={() => {
                setAllUsers((current) => current.map((user) => user.id === editingUser.id ? { ...editingUser, avatar: getUserInitials(editingUser.name) } : user))
                setEditingUser(null)
              }} className="rounded border border-primary/40 bg-primary/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border/80 bg-[#081722] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">ADD NEW USER</div>
              <button type="button" onClick={() => setIsAddUserOpen(false)} className="rounded border border-border/70 bg-background/40 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-foreground">Close</button>
            </div>
            <div className="space-y-2.5">
              <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Full Name
                <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none" />
              </label>
              <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Email
                <input value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none" />
              </label>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  Role
                  <select value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value as User['role'] })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none">
                    {roleOptions.filter((option) => option !== 'All Roles').map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  Department
                  <input value={formData.department} onChange={(event) => setFormData({ ...formData, department: event.target.value })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none" />
                </label>
              </div>
              <label className="block text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                Status
                <select value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value as UserStatus })} className="mt-1 w-full rounded border border-border/70 bg-background/35 px-2 py-2 text-[10px] text-foreground outline-none">
                  {statusOptions.filter((option) => option !== 'All Status').map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddUserOpen(false)} className="rounded border border-border/70 bg-background/40 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-foreground">Cancel</button>
              <button type="button" onClick={handleAddUser} className="rounded border border-primary/40 bg-primary/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-primary">Create User</button>
            </div>
          </div>
        </div>
      )}

      {!isAddUserOpen && activeTab === 'Overview' && (
        <button type="button" onClick={() => setIsAddUserOpen(true)} className="hidden" aria-hidden="true" />
      )}
    </div>
  )
}

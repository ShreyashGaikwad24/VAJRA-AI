import { useMemo, useState } from 'react'

import {
  ArrowRight,
  BellRing,
  CheckCheck,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  ShieldAlert,
  UserRound,
} from 'lucide-react'
import {
  CartesianGrid,
  Cell,
  Legend,
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
import { SelectField } from '@/components/common/SelectField'
import { SearchBox } from '@/components/common/SearchBox'
import {
  areaOptions,
  permitKpis,
  permitRows,
  permitSettings,
  permitStatusData,
  permitTabs,
  permitTasks,
  permitTemplates,
  permitTrendData,
  permitTypeSummary,
  statusOptions,
  type Permit,
  type PermitTab,
} from '@/modules/permitManagement/permitManagementData'
import { cn } from '@/utils/cn'

function getPermitStatusClasses(status: Permit['status']) {
  switch (status) {
    case 'Active':
      return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
    case 'Pending':
      return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
    case 'Expired':
      return 'border-red-500/35 bg-red-500/10 text-red-200'
    case 'Cancelled':
      return 'border-violet-500/35 bg-violet-500/10 text-violet-200'
    default:
      return 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200'
  }
}

function getTaskStatusClasses(status: string) {
  if (status === 'Pending Approval') return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
  if (status === 'Approval Required') return 'border-orange-500/35 bg-orange-500/10 text-orange-200'
  if (status === 'Expiring Soon') return 'border-red-500/35 bg-red-500/10 text-red-200'
  return 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200'
}

function formatValuesForTable(row: Permit) {
  return row.validFrom.split('\n')
}

function OverviewView({
  filteredPermits,
  onSelectPermit,
  handleQuickAction,
}: {
  filteredPermits: Permit[]
  onSelectPermit: (permit: Permit) => void
  handleQuickAction: (action: string) => void
}) {
  return (
    <div className="space-y-2.5">
      <div className="grid gap-2.5 xl:grid-cols-6">
        {permitKpis.map((item, index) => (
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
        <div className="xl:col-span-4">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PERMIT STATUS DISTRIBUTION</div>
              <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
                This Week <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[170px] w-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={permitStatusData} dataKey="value" innerRadius={42} outerRadius={66} paddingAngle={2} stroke="transparent">
                      {permitStatusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[22px] font-black text-foreground">128</div>
                    <div className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1.5 text-[9px] text-muted-foreground">
              {permitStatusData.map((item) => (
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

        <div className="xl:col-span-5">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PERMITS OVER TIME</div>
              <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
                Last 7 Days <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={permitTrendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Legend wrapperStyle={{ fontSize: 9, paddingTop: 6 }} />
                  <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2.2} dot={{ r: 2.2, fill: '#3b82f6' }} name="Created" />
                  <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981' }} name="Approved" />
                  <Line type="monotone" dataKey="closed" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2, fill: '#f59e0b' }} name="Closed" />
                  <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} dot={{ r: 2, fill: '#ef4444' }} name="Cancelled" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PERMIT SUMMARY BY TYPE</div>
              <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
                This Week <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="space-y-2 pt-2 text-[9px]">
              {permitTypeSummary.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-foreground">{item.value} ({item.percent})</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
                    <div className="h-full rounded-full" style={{ width: `${Math.max((item.value / 32) * 100, 12)}%`, backgroundColor: item.color }} />
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
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENT PERMITS</div>
            <div className="flex items-center gap-2">
              <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View All</button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-border/70 bg-background/35 p-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
              All Status <ChevronDown className="size-3" />
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
              All Areas <ChevronDown className="size-3" />
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-foreground">
              <Filter className="size-3" /> Filters
            </button>
          </div>

          <div className="overflow-hidden rounded border border-border/70 bg-background/35">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse text-[9px]">
                <thead>
                  <tr className="border-b border-border/70 bg-background/55 text-left">
                    {['Permit ID', 'Permit Type', 'Work Description', 'Area / Unit', 'Requested By', 'Valid From', 'Valid To', 'Status', 'Actions'].map((header) => (
                      <th key={header} className="px-2 py-2 font-semibold uppercase tracking-[0.12em] text-muted-foreground">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPermits.slice(0, 5).map((permit) => {
                    const from = formatValuesForTable(permit)
                    return (
                      <tr key={permit.id} className="border-b border-border/70 last:border-b-0 hover:bg-primary/5">
                        <td className="px-2 py-2 text-slate-200">{permit.id}</td>
                        <td className="px-2 py-2 text-foreground">{permit.type}</td>
                        <td className="px-2 py-2 text-slate-200">{permit.description}</td>
                        <td className="px-2 py-2 text-slate-200">{permit.area}</td>
                        <td className="px-2 py-2 text-slate-200">{permit.requestedBy}</td>
                        <td className="px-2 py-2">
                          <div>{from[0]}</div>
                          <div className="text-[8px] text-muted-foreground">{from[1]}</div>
                        </td>
                        <td className="px-2 py-2">
                          <div>{permit.validTo.split('\n')[0]}</div>
                          <div className="text-[8px] text-muted-foreground">{permit.validTo.split('\n')[1]}</div>
                        </td>
                        <td className="px-2 py-2">
                          <span className={cn('inline-flex rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]', getPermitStatusClasses(permit.status))}>{permit.status}</span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => onSelectPermit(permit)} className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                              <Eye className="size-3.5" />
                            </button>
                            <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                              <Download className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>Showing 1 to {Math.min(filteredPermits.length, 5)} of {filteredPermits.length} permits</span>
            <div className="flex items-center gap-1">
              <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">&lt;</button>
              <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-primary/40 bg-primary/10 text-primary">1</button>
              <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">2</button>
              <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">3</button>
              <span className="px-1 text-slate-300">...</span>
              <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">26</button>
              <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">&gt;</button>
            </div>
          </div>
        </Panel>

        <div className="space-y-2.5">
          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">MY PERMIT TASKS</div>
              <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View All</button>
            </div>
            <div className="space-y-2">
              {permitTasks.map((task) => (
                <div key={task.id} className="rounded border border-border/70 bg-background/35 p-2.5">
                  <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-cyan-300">{task.id}</div>
                  <div className="text-[9px] font-medium text-foreground">{task.title}</div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', getTaskStatusClasses(task.status))}>{task.status}</span>
                    <span className="text-[8px] text-muted-foreground">Due in {task.dueIn}</span>
                  </div>
                  <div className="mt-2 text-[8px] text-muted-foreground">Submitted on: {task.submittedOn}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">QUICK ACTIONS</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Create New Permit', icon: Plus, action: 'Create New Permit' },
                { label: 'Permit Templates', icon: FileText, action: 'Templates' },
                { label: 'Permit Register', icon: CheckCheck, action: 'Permit Register' },
                { label: 'My Permits', icon: UserRound, action: 'My Permits' },
                { label: 'Expired Permits', icon: ShieldAlert, action: 'Expired Permits' },
                { label: 'Approval Dashboard', icon: BellRing, action: 'Approvals' },
              ].map(({ label, icon: Icon, action }) => (
                <button key={label} type="button" onClick={() => handleQuickAction(action)} className="flex min-h-[72px] flex-col items-center justify-center gap-2 rounded border border-border/70 bg-background/35 px-2 py-2 text-center text-[9px] font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5">
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

function AllPermitsView({
  filteredPermits,
  onSelectPermit,
}: {
  filteredPermits: Permit[]
  onSelectPermit: (permit: Permit) => void
}) {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALL PERMITS</div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
            All Status <ChevronDown className="size-3" />
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
            All Areas <ChevronDown className="size-3" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-border/70 bg-background/35">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-[9px]">
            <thead>
              <tr className="border-b border-border/70 bg-background/55 text-left">
                {['Permit ID', 'Permit Type', 'Work Description', 'Area / Unit', 'Requested By', 'Valid From', 'Valid To', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-2 py-2 font-semibold uppercase tracking-[0.12em] text-muted-foreground">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPermits.map((permit) => (
                <tr key={permit.id} className="border-b border-border/70 last:border-b-0 hover:bg-primary/5">
                  <td className="px-2 py-2 text-slate-200">{permit.id}</td>
                  <td className="px-2 py-2 text-foreground">{permit.type}</td>
                  <td className="px-2 py-2 text-slate-200">{permit.description}</td>
                  <td className="px-2 py-2 text-slate-200">{permit.area}</td>
                  <td className="px-2 py-2 text-slate-200">{permit.requestedBy}</td>
                  <td className="px-2 py-2">
                    <div>{permit.validFrom.split('\n')[0]}</div>
                    <div className="text-[8px] text-muted-foreground">{permit.validFrom.split('\n')[1]}</div>
                  </td>
                  <td className="px-2 py-2">
                    <div>{permit.validTo.split('\n')[0]}</div>
                    <div className="text-[8px] text-muted-foreground">{permit.validTo.split('\n')[1]}</div>
                  </td>
                  <td className="px-2 py-2"><span className={cn('inline-flex rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]', getPermitStatusClasses(permit.status))}>{permit.status}</span></td>
                  <td className="px-2 py-2"><button type="button" onClick={() => onSelectPermit(permit)} className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-primary"><Eye className="size-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  )
}

function PermitRegisterView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PERMIT REGISTER</div>
      <div className="grid gap-2 md:grid-cols-2">
        {permitTemplates.map((template) => (
          <div key={template.id} className="rounded border border-border/70 bg-background/35 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-cyan-300">{template.id}</span>
              <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-cyan-200">{template.category}</span>
            </div>
            <div className="text-[10px] font-semibold text-foreground">{template.title}</div>
            <div className="mt-2 text-[8px] text-muted-foreground">Owner: {template.owner}</div>
            <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[8px] uppercase tracking-[0.12em] text-foreground hover:border-primary/40 hover:text-primary">
              Create from Template <ArrowRight className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function ApprovalsView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">APPROVALS</div>
      <div className="space-y-2">
        {permitRows.slice(0, 4).map((permit) => (
          <div key={permit.id} className="flex items-center justify-between gap-3 rounded border border-border/70 bg-background/35 p-2.5">
            <div>
              <div className="text-[9px] font-semibold text-foreground">{permit.id}</div>
              <div className="text-[8px] text-muted-foreground">{permit.type} · {permit.area}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', getPermitStatusClasses(permit.status))}>{permit.status}</span>
              <button type="button" className="rounded border border-success/40 bg-success/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-success">Approve</button>
              <button type="button" className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-red-200">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function PermitTypesView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PERMIT TYPES</div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {permitTypeSummary.map((item) => (
          <div key={item.name} className="rounded border border-border/70 bg-background/35 p-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground">{item.percent}</span>
            </div>
            <div className="mt-2 text-[10px] font-semibold text-foreground">{item.name}</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/60">
              <div className="h-full rounded-full" style={{ width: `${Math.max((item.value / 32) * 100, 12)}%`, backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function TemplatesView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">TEMPLATES</div>
      <div className="space-y-2">
        {permitTemplates.map((template) => (
          <div key={template.id} className="flex items-center justify-between gap-3 rounded border border-border/70 bg-background/35 p-2.5">
            <div>
              <div className="text-[9px] uppercase tracking-[0.12em] text-cyan-300">{template.id}</div>
              <div className="text-[10px] font-semibold text-foreground">{template.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded border border-border/70 bg-background/40 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-foreground">View</button>
              <button type="button" className="rounded border border-border/70 bg-background/40 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-foreground">Edit</button>
              <button type="button" className="rounded border border-primary/40 bg-primary/10 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-primary">Create</button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function SettingsView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">SETTINGS</div>
      <div className="grid gap-2 md:grid-cols-2">
        {permitSettings.map((setting) => (
          <div key={setting} className="flex items-center justify-between gap-3 rounded border border-border/70 bg-background/35 p-2.5">
            <span className="text-[9px] font-medium text-foreground">{setting}</span>
            <button type="button" className="text-[8px] uppercase tracking-[0.12em] text-cyan-300">Configure</button>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function PermitManagementLayout() {
  const [activeTab, setActiveTab] = useState<PermitTab>('Overview')
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(permitRows[0])
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [areaFilter, setAreaFilter] = useState('All Areas')
  const filteredPermits = useMemo(() => {
    return permitRows.filter((permit) => {
      const matchesStatus = statusFilter === 'All Status' || permit.status === statusFilter
      const matchesArea = areaFilter === 'All Areas' || permit.area === areaFilter
      return matchesStatus && matchesArea
    })
  }, [statusFilter, areaFilter])

  const handleQuickAction = (action: string) => {
    if (action === 'Create New Permit') {
      setSelectedPermit(permitRows[0])
      return
    }
    if (action === 'Templates') {
      setActiveTab('Templates')
      return
    }
    if (action === 'Permit Register') {
      setActiveTab('Permit Register')
      return
    }
    if (action === 'My Permits') {
      setActiveTab('My Permits')
      return
    }
    if (action === 'Expired Permits') {
      setStatusFilter('Expired')
      setActiveTab('All Permits')
      return
    }
    if (action === 'Approvals') {
      setActiveTab('Approvals')
    }
  }

  const renderTabView = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewView filteredPermits={filteredPermits} onSelectPermit={setSelectedPermit} handleQuickAction={handleQuickAction} />
      case 'All Permits':
        return <AllPermitsView filteredPermits={filteredPermits} onSelectPermit={setSelectedPermit} />
      case 'My Permits':
        return <AllPermitsView filteredPermits={permitRows.filter((permit) => ['Rajesh Kumar', 'Amit Patel', 'Priya Sharma'].includes(permit.requestedBy))} onSelectPermit={setSelectedPermit} />
      case 'Permit Register':
        return <PermitRegisterView />
      case 'Approvals':
        return <ApprovalsView />
      case 'Permit Types':
        return <PermitTypesView />
      case 'Templates':
        return <TemplatesView />
      case 'Settings':
        return <SettingsView />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-0.5">
      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">PERMIT MANAGEMENT</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Manage Work Permits, Approvals &amp; Compliance</div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <div className="rounded border border-border/70 bg-background/35 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Plant: Jamnagar Refinery</div>
            <div className="rounded border border-border/70 bg-background/35 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Date &amp; Time: 17 May 2025, 10:24:35 AM</div>
            <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-red-200">System Status: EMERGENCY</div>
          </div>
        </div>

        <nav className="mt-2 flex flex-wrap items-center gap-1.5">
          {permitTabs.map((tab) => (
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
            <SearchBox placeholder="Search permits..." className="h-9 border-border/70 bg-[#0f1725] text-[10px]" />
            <SelectField label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="min-w-[140px]" />
            <SelectField label="Area" value={areaFilter} options={areaOptions} onChange={setAreaFilter} className="min-w-[150px]" />
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border border-border/70 bg-background/40 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground hover:border-red-500/40 hover:text-red-200">
              <Filter className="size-3.5" /> Filters
            </button>
          </div>
        </div>
      )}

      {renderTabView()}

      {selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-xl rounded-xl border border-border/80 bg-[#081722] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">PERMIT DETAILS</div>
              <button type="button" onClick={() => setSelectedPermit(null)} className="rounded border border-border/70 bg-background/40 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-foreground">Close</button>
            </div>
            <div className="rounded border border-border/70 bg-background/35 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-[11px] font-semibold text-foreground">{selectedPermit.id}</div>
                <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', getPermitStatusClasses(selectedPermit.status))}>{selectedPermit.status}</span>
              </div>
              <div className="grid gap-2 text-[9px] text-muted-foreground md:grid-cols-2">
                <div><span className="text-foreground">Permit Type:</span> {selectedPermit.type}</div>
                <div><span className="text-foreground">Area:</span> {selectedPermit.area}</div>
                <div><span className="text-foreground">Requested By:</span> {selectedPermit.requestedBy}</div>
                <div><span className="text-foreground">Work:</span> {selectedPermit.description}</div>
                <div><span className="text-foreground">Valid From:</span> {selectedPermit.validFrom.replace('\n', ' ')}</div>
                <div><span className="text-foreground">Valid To:</span> {selectedPermit.validTo.replace('\n', ' ')}</div>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" className="rounded border border-border/70 bg-background/40 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-foreground">Edit</button>
              <button type="button" className="rounded border border-success/40 bg-success/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-success">Approve</button>
              <button type="button" className="rounded border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-red-200">Reject</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

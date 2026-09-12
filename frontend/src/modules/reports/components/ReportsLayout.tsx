import { useMemo, useState } from 'react'

import {
  AlertTriangle,
  Bell,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Filter,
  Gauge,
  ListFilter,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { MetricCard } from '@/components/cards/MetricCard'
import { Panel } from '@/components/cards/Panel'
import {
  alertAnalyticsKpis,
  alertSeverityData,
  alertSourceData,
  alertTableRows,
  alertVolumeData,
  complianceData,
  complianceTrendData,
  drillPerformanceData,
  evacuationTrendData,
  incidentAnalyticsKpis,
  incidentLocationData,
  incidentSeverityData,
  incidentTableRows,
  incidentTrendSeries,
  incidentTypeData,
  performanceAnalyticsKpis,
  responseTrendData,
  uptimeComparisonData,
} from '@/modules/analyticsInsights/analyticsData'
import {
  exportHistory,
  recentReports,
  reportCategoriesData,
  reportStatusData,
  reportTabs,
  reportTrendData,
  reportTypeData,
  reportsKpis,
  type ReportTab,
} from '@/modules/reports/reportsData'
import { cn } from '@/utils/cn'

function getStatusClass(value: string) {
  if (value === 'Completed' || value === 'Closed') return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
  if (value === 'In Progress') return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
  if (value === 'Pending') return 'border-violet-500/35 bg-violet-500/10 text-violet-200'
  return 'border-border bg-background/50 text-slate-200'
}

function getSeverityClass(value: string) {
  if (value === 'CRITICAL') return 'border-red-500/35 bg-red-500/10 text-red-200'
  if (value === 'HIGH') return 'border-orange-500/35 bg-orange-500/10 text-orange-200'
  if (value === 'MEDIUM') return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
  return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
}

function KpiGrid({ items }: { items: Array<{ title: string; value: string; delta: string; tone: string; trend: string; icon: typeof AlertTriangle; sparkline: number[] }> }) {
  return (
    <div className="grid gap-2.5 xl:grid-cols-6">
      {items.map((item, index) => (
        <MetricCard
          key={item.title}
          label={item.title}
          value={item.value}
          delta={item.delta}
          tone={item.tone as 'default' | 'success' | 'warning' | 'danger' | 'critical'}
          trend={item.trend as 'up' | 'down' | 'flat'}
          icon={item.icon}
          sparkline={item.sparkline}
          index={index}
        />
      ))}
    </div>
  )
}

function OverviewContent() {
  return (
    <>
      <div className="grid gap-2.5 xl:grid-cols-6">
        {reportsKpis.map((item, index) => (
          <MetricCard
            key={item.title}
            label={item.title}
            value={item.value}
            delta={item.delta}
            tone={item.tone as 'default' | 'success' | 'warning' | 'danger' | 'critical'}
            trend={item.trend as 'up' | 'down' | 'flat'}
            icon={item.icon}
            sparkline={item.sparkline}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">REPORTS OVER TIME</div>
              <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
                This Week
                <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportTrendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Legend wrapperStyle={{ fontSize: 9, paddingTop: 6 }} />
                  <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2.2} dot={{ r: 2.4, fill: '#ef4444' }} name="Total Reports" />
                  <Line type="monotone" dataKey="incident" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.2, fill: '#3b82f6' }} name="Incident Reports" />
                  <Line type="monotone" dataKey="alert" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2.2, fill: '#f59e0b' }} name="Alert Reports" />
                  <Line type="monotone" dataKey="compliance" stroke="#10b981" strokeWidth={2} dot={{ r: 2.2, fill: '#10b981' }} name="Compliance Reports" />
                  <Line type="monotone" dataKey="performance" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 2.2, fill: '#8b5cf6' }} name="Performance Reports" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">REPORTS BY TYPE</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="flex h-[210px] items-center justify-center">
              <div className="relative h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reportTypeData} dataKey="value" innerRadius={46} outerRadius={70} paddingAngle={2} stroke="transparent">
                      {reportTypeData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[22px] font-black text-white">128</div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1.5 text-[9px] text-muted-foreground">
              {reportTypeData.map((item) => (
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
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">TOP REPORT CATEGORIES</div>
              <button type="button" className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">This Week</button>
            </div>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportCategoriesData} layout="vertical" margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} width={110} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {reportCategoriesData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.9fr)_minmax(280px,0.9fr)]">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENT REPORTS</div>
            <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View All Reports</button>
          </div>

          <div className="overflow-hidden rounded border border-border/70 bg-background/40">
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full border-collapse text-[9px] text-slate-200">
                <thead>
                  <tr className="border-b border-border/70 bg-background/60">
                    {['Report ID', 'Report Type', 'Title / Description', 'Area / Unit', 'Reported By', 'Date & Time', 'Severity', 'Status', 'Action'].map((column) => (
                      <th key={column} className="px-2 py-2 text-left font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((row) => (
                    <tr key={row.id} className="border-b border-border/60 last:border-b-0">
                      <td className="px-2 py-2 text-slate-200">{row.id}</td>
                      <td className="px-2 py-2 text-slate-200">{row.type}</td>
                      <td className="px-2 py-2 text-slate-200">{row.title}</td>
                      <td className="px-2 py-2 text-slate-200">{row.area}</td>
                      <td className="px-2 py-2 text-slate-200">{row.reportedBy}</td>
                      <td className="px-2 py-2 text-slate-200">{row.date}</td>
                      <td className="px-2 py-2">
                        <span className={cn('inline-flex rounded-md border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', getSeverityClass(row.severity))}>{row.severity}</span>
                      </td>
                      <td className="px-2 py-2">
                        <span className={cn('inline-flex rounded-md border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', getStatusClass(row.status))}>{row.status}</span>
                      </td>
                      <td className="px-2 py-2">
                        <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                          <Eye className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>Showing 1 to 5 of 128 reports</span>
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
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">REPORT STATUS DISTRIBUTION</div>
              <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
                This Week
                <ChevronDown className="size-3" />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[150px] w-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reportStatusData} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={2} stroke="transparent">
                      {reportStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[20px] font-black text-white">128</div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1.5 text-[9px] text-muted-foreground">
              {reportStatusData.map((item) => (
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

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">REPORT EXPORT HISTORY</div>
              <button type="button" className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">View All</button>
            </div>

            <div className="space-y-2">
              {exportHistory.map((entry) => (
                <div key={entry.title} className="flex items-start gap-2 rounded border border-border/70 bg-background/40 p-2">
                  <div className="mt-0.5 flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/50 text-cyan-300">
                    <FileText className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-[9px] font-semibold text-foreground">{entry.title}</div>
                      <span className="rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-primary">{entry.format}</span>
                    </div>
                    <div className="mt-1 text-[8px] text-muted-foreground">{entry.date}</div>
                    <div className="mt-0.5 text-[8px] text-muted-foreground">{entry.user}</div>
                  </div>
                  <button type="button" className="mt-0.5 inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-muted-foreground hover:text-primary">
                    <Download className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

function IncidentReportsContent() {
  return (
    <>
      <KpiGrid items={incidentAnalyticsKpis} />

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENT TREND</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 Days</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidentTrendSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Legend wrapperStyle={{ fontSize: 9, paddingTop: 6 }} />
                  <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} dot={{ r: 2.2, fill: '#ef4444' }} name="Total" />
                  <Line type="monotone" dataKey="critical" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2.2, fill: '#f59e0b' }} name="Critical" />
                  <Line type="monotone" dataKey="high" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.2, fill: '#3b82f6' }} name="High" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-5">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENT SEVERITY DISTRIBUTION</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="flex h-[210px] items-center justify-center">
              <div className="relative h-[170px] w-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incidentSeverityData} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="transparent">
                      {incidentSeverityData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[22px] font-black text-white">32</div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Incidents</div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <Panel className="h-[260px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">TOP INCIDENT CATEGORIES</div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentTypeData} layout="vertical" margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} width={100} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {incidentTypeData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-6">
          <Panel className="h-[260px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">TOP INCIDENT LOCATIONS</div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentLocationData} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#ef4444" barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.8fr)_minmax(270px,0.9fr)]">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENT INCIDENT REPORTS</div>
          <div className="overflow-x-auto">
            <table className="min-w-[620px] w-full border-collapse text-[9px] text-slate-200">
              <thead>
                <tr className="border-b border-border/70 bg-background/60">
                  {['Incident ID', 'Type', 'Location', 'Severity', 'Date', 'Duration', 'Response', 'Status'].map((column) => (
                    <th key={column} className="px-2 py-2 text-left font-semibold uppercase tracking-[0.12em] text-muted-foreground">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidentTableRows.map((row) => (
                  <tr key={row[0]} className="border-b border-border/60 last:border-b-0">
                    {row.map((cell, idx) => (
                      <td key={`${row[0]}-${idx}`} className="px-2 py-2 align-middle text-slate-200">
                        {idx === 3 || idx === 7 ? (
                          <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', {
                            Critical: 'border-red-500/40 bg-red-500/10 text-red-200',
                            High: 'border-orange-500/40 bg-orange-500/10 text-orange-200',
                            Medium: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
                            Low: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                            Closed: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                            Monitoring: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
                            Escalated: 'border-red-500/40 bg-red-500/10 text-red-200',
                            Resolved: 'border-green-500/40 bg-green-500/10 text-green-200',
                          }[cell] ?? 'border-border bg-background/50 text-slate-200')}>{cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENT EXPORT HISTORY</div>
          <div className="space-y-2">
            {exportHistory.map((entry) => (
              <div key={entry.title} className="flex items-start gap-2 rounded border border-border/70 bg-background/40 p-2">
                <div className="mt-0.5 flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/50 text-cyan-300"><FileText className="size-3.5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[9px] font-semibold text-foreground">{entry.title}</div>
                    <span className="rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-primary">{entry.format}</span>
                  </div>
                  <div className="mt-1 text-[8px] text-muted-foreground">{entry.date}</div>
                  <div className="mt-0.5 text-[8px] text-muted-foreground">{entry.user}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

function AlertReportsContent() {
  return (
    <>
      <KpiGrid items={alertAnalyticsKpis} />

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT TREND</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 Days</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertVolumeData} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2.2, fill: '#f59e0b' }} name="Alerts" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-5">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT SEVERITY DISTRIBUTION</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="flex h-[210px] items-center justify-center">
              <div className="relative h-[170px] w-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={alertSeverityData} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="transparent">
                      {alertSeverityData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[22px] font-black text-white">256</div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Alerts</div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <Panel className="h-[260px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT CATEGORIES</div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertSourceData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="source" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#3b82f6" barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-6">
          <Panel className="h-[260px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERTS BY TIME</div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertSourceData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="source" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#10b981" barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.8fr)_minmax(270px,0.9fr)]">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENT ALERT REPORTS</div>
          <div className="overflow-x-auto">
            <table className="min-w-[620px] w-full border-collapse text-[9px] text-slate-200">
              <thead>
                <tr className="border-b border-border/70 bg-background/60">
                  {['Alert ID', 'Source', 'Category', 'Severity', 'Date', 'Response', 'Status'].map((column) => (
                    <th key={column} className="px-2 py-2 text-left font-semibold uppercase tracking-[0.12em] text-muted-foreground">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alertTableRows.map((row) => (
                  <tr key={row[0]} className="border-b border-border/60 last:border-b-0">
                    {row.map((cell, idx) => (
                      <td key={`${row[0]}-${idx}`} className="px-2 py-2 align-middle text-slate-200">
                        {idx === 3 || idx === 6 ? (
                          <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', {
                            Critical: 'border-red-500/40 bg-red-500/10 text-red-200',
                            High: 'border-orange-500/40 bg-orange-500/10 text-orange-200',
                            Medium: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
                            Low: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                            Closed: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                            Acknowledged: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
                            Escalated: 'border-red-500/40 bg-red-500/10 text-red-200',
                            Resolved: 'border-green-500/40 bg-green-500/10 text-green-200',
                            Monitoring: 'border-violet-500/40 bg-violet-500/10 text-violet-200',
                          }[cell] ?? 'border-border bg-background/50 text-slate-200')}>{cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT EXPORT HISTORY</div>
          <div className="space-y-2">
            {exportHistory.map((entry) => (
              <div key={entry.title} className="flex items-start gap-2 rounded border border-border/70 bg-background/40 p-2">
                <div className="mt-0.5 flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/50 text-cyan-300"><FileText className="size-3.5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[9px] font-semibold text-foreground">{entry.title}</div>
                    <span className="rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-primary">{entry.format}</span>
                  </div>
                  <div className="mt-1 text-[8px] text-muted-foreground">{entry.date}</div>
                  <div className="mt-0.5 text-[8px] text-muted-foreground">{entry.user}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

function ComplianceReportsContent() {
  return (
    <>
      <div className="grid gap-2.5 xl:grid-cols-6">
        {[
          { title: 'TOTAL COMPLIANCE REPORTS', value: '48', delta: '↑ 8% vs last 7 days', tone: 'success', trend: 'up', icon: ShieldAlert, sparkline: [18, 20, 22, 24, 26, 31, 42, 48] },
          { title: 'COMPLIANCE SCORE', value: '92%', delta: '↑ 6% vs last 7 days', tone: 'success', trend: 'up', icon: Gauge, sparkline: [84, 85, 86, 88, 89, 90, 91, 92] },
          { title: 'COMPLIANT AREAS', value: '18', delta: '↑ 2 vs prior', tone: 'default', trend: 'up', icon: AlertTriangle, sparkline: [12, 14, 14, 15, 16, 17, 18, 18] },
          { title: 'NON-COMPLIANT AREAS', value: '4', delta: '↓ 1 vs prior', tone: 'warning', trend: 'down', icon: Filter, sparkline: [8, 7, 6, 6, 5, 4, 4, 4] },
          { title: 'OPEN FINDINGS', value: '11', delta: '↓ 3 vs prior', tone: 'default', trend: 'down', icon: FileText, sparkline: [15, 14, 13, 12, 12, 11, 11, 11] },
          { title: 'RESOLVED FINDINGS', value: '24', delta: '↑ 7 vs prior', tone: 'success', trend: 'up', icon: Download, sparkline: [12, 14, 16, 18, 19, 21, 23, 24] },
        ].map((item, index) => (
          <MetricCard key={item.title} label={item.title} value={item.value} delta={item.delta} tone={item.tone as 'default' | 'success' | 'warning' | 'danger' | 'critical'} trend={item.trend as 'up' | 'down' | 'flat'} icon={item.icon} sparkline={item.sparkline} index={index} />
        ))}
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">COMPLIANCE TREND</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 Days</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceTrendData} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 2.2, fill: '#10b981' }} name="Compliance Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-5">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">COMPLIANCE STATUS</div>
            <div className="space-y-3 pt-2">
              {[
                { label: 'Compliant', value: '82%', color: '#10b981' },
                { label: 'Needs Attention', value: '12%', color: '#f59e0b' },
                { label: 'Non-Compliant', value: '6%', color: '#ef4444' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-[9px] text-muted-foreground">
                    <span>{item.label}</span>
                    <span className="text-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 rounded bg-background/60">
                    <div className="h-full rounded" style={{ width: item.value, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.9fr)]">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENT COMPLIANCE REPORTS</div>
          <div className="overflow-x-auto">
            <table className="min-w-[620px] w-full border-collapse text-[9px] text-slate-200">
              <thead>
                <tr className="border-b border-border/70 bg-background/60">
                  {['Report ID', 'Area', 'Finding', 'Status', 'Date', 'Owner'].map((column) => (
                    <th key={column} className="px-2 py-2 text-left font-semibold uppercase tracking-[0.12em] text-muted-foreground">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complianceData.map((row, index) => (
                  <tr key={`${row.day}-${index}`} className="border-b border-border/60 last:border-b-0">
                    <td className="px-2 py-2">CMP-{String(index + 1).padStart(3, '0')}</td>
                    <td className="px-2 py-2">Zone {String.fromCharCode(65 + index)}</td>
                    <td className="px-2 py-2">{index % 2 === 0 ? 'Safety Inspection' : 'Permit Review'}</td>
                    <td className="px-2 py-2"><span className="inline-flex rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-200">{index % 3 === 0 ? 'Closed' : 'Open'}</span></td>
                    <td className="px-2 py-2">{row.day}</td>
                    <td className="px-2 py-2">Safety Team</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">COMPLIANCE EXPORT HISTORY</div>
          <div className="space-y-2">
            {exportHistory.map((entry) => (
              <div key={entry.title} className="flex items-start gap-2 rounded border border-border/70 bg-background/40 p-2">
                <div className="mt-0.5 flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/50 text-cyan-300"><FileText className="size-3.5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[9px] font-semibold text-foreground">{entry.title}</div>
                    <span className="rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.12em] text-primary">{entry.format}</span>
                  </div>
                  <div className="mt-1 text-[8px] text-muted-foreground">{entry.date}</div>
                  <div className="mt-0.5 text-[8px] text-muted-foreground">{entry.user}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

function PerformanceReportsContent() {
  return (
    <>
      <KpiGrid items={performanceAnalyticsKpis} />

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PERFORMANCE TREND</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Response Time</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTrendData} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.2, fill: '#3b82f6' }} name="Response Time (min)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-5">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PERFORMANCE SUMMARY</div>
            <div className="space-y-3 pt-2">
              {uptimeComparisonData.map((item) => (
                <div key={item.metric}>
                  <div className="mb-1 flex items-center justify-between text-[9px] text-muted-foreground">
                    <span>{item.metric}</span>
                    <span className="text-foreground">{item.current}</span>
                  </div>
                  <div className="h-2 rounded bg-background/60">
                    <div className="h-full rounded bg-cyan-500" style={{ width: `${Math.min((item.current / 100) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <Panel className="h-[260px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">DRILL PERFORMANCE BY AREA</div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drillPerformanceData} layout="vertical" margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis type="category" dataKey="area" tick={{ fill: '#cbd5e1', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} width={80} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#10b981" barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-6">
          <Panel className="h-[260px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">EVACUATION EFFICIENCY</div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evacuationTrendData} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ r: 2.2, fill: '#22c55e' }} name="Efficiency %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

function CustomReportsContent() {
  return (
    <>
      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">CUSTOM REPORT BUILDER</div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['Report Name', 'Daily Safety Summary'],
              ['Report Type', 'Incident Report'],
              ['Date Range', '10 May 2025 - 17 May 2025'],
              ['Shift', 'All Shifts'],
              ['Area / Unit', 'All Areas'],
              ['Severity', 'All Levels'],
              ['Status', 'Open & Closed'],
            ].map(([label, value]) => (
              <label key={label} className="space-y-1 text-[9px] text-muted-foreground">
                <span className="block uppercase tracking-[0.14em]">{label}</span>
                <input value={value} readOnly className="w-full rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-[10px] text-foreground outline-none" />
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">Generate Report</button>
            <button type="button" className="rounded-md border border-border/70 bg-background/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground">Save Template</button>
            <button type="button" className="rounded-md border border-border/70 bg-background/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground">Export Report</button>
          </div>
        </Panel>

        <div className="space-y-2.5">
          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">SAVED CUSTOM REPORTS</div>
            <div className="space-y-2 text-[9px] text-muted-foreground">
              {['Daily Safety Summary', 'Shift Compliance Snapshot', 'Emergency Drill Summary'].map((item) => (
                <div key={item} className="rounded border border-border/70 bg-background/40 px-2 py-1.5 text-foreground">{item}</div>
              ))}
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">CUSTOM REPORT TEMPLATES</div>
            <div className="space-y-2 text-[9px] text-muted-foreground">
              {['Safety Overview', 'Incident Summary', 'Compliance Review'].map((item) => (
                <div key={item} className="rounded border border-border/70 bg-background/40 px-2 py-1.5 text-foreground">{item}</div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

export function ReportsLayout() {
  const [activeTab, setActiveTab] = useState<ReportTab>('Overview')
  const [reportType, setReportType] = useState('All Reports')
  const [shift, setShift] = useState('All Shifts')
  const [area, setArea] = useState('All Areas')
  const rightDate = useMemo(() => '10 May 2025 - 17 May 2025', [])

  const content =
    activeTab === 'Overview' ? (
      <OverviewContent />
    ) : activeTab === 'Incident Reports' ? (
      <IncidentReportsContent />
    ) : activeTab === 'Alert Reports' ? (
      <AlertReportsContent />
    ) : activeTab === 'Compliance Reports' ? (
      <ComplianceReportsContent />
    ) : activeTab === 'Performance Reports' ? (
      <PerformanceReportsContent />
    ) : (
      <CustomReportsContent />
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-3.5">
      <div className="rounded-lg border border-border/80 bg-card/85 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-red-500/40 bg-red-500/10 text-red-300">
              <ShieldAlert className="size-4" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-red-300">SAFE.AI</div>
              <div className="text-[7px] uppercase tracking-[0.14em] text-muted-foreground">Reports</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="rounded border border-border/70 bg-background/40 px-2 py-1">Plant: Jamnagar Refinery</div>
            <div className="rounded border border-border/70 bg-background/40 px-2 py-1">Date &amp; Time: 17 May 2025, 10:24:35 AM</div>
            <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 font-semibold uppercase tracking-[0.14em] text-red-300">System Status: EMERGENCY</div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground">
              <Bell className="size-3.5" />
            </button>
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground">
              <Gauge className="size-3.5" />
            </button>
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground">
              <Sparkles className="size-3.5" />
            </button>
            <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5">
              <div className="flex size-6 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-[8px] font-bold text-primary">SH</div>
              <div className="leading-none">
                <div className="text-[9px] font-semibold text-foreground">Safety Head</div>
                <div className="text-[8px] text-muted-foreground">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[16px] font-bold uppercase tracking-[0.18em] text-foreground">REPORTS</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Comprehensive Safety &amp; Emergency Reporting</div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground hover:border-primary/40 hover:text-primary">
              <ListFilter className="size-3.5" />
              Schedule Report
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-primary/60">
              <Download className="size-3.5" />
              Export Report
              <ChevronDown className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <nav className="flex flex-wrap items-center gap-1.5">
          {reportTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all',
                activeTab === tab
                  ? 'border-red-500/50 bg-red-500/10 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.12)]'
                  : 'border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-background/60 hover:text-foreground',
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-lg border border-border/80 bg-card/80 px-3 py-2.5">
        <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-5">
          <div className="space-y-1">
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Report Type</div>
            <div className="relative">
              <select value={reportType} onChange={(event) => setReportType(event.target.value)} className="w-full appearance-none rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 pr-8 text-[10px] text-foreground outline-none focus:border-primary/50">
                {['All Reports', 'Incident Reports', 'Alert Reports', 'Compliance Reports', 'Performance Reports', 'Custom Reports'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Date Range</div>
            <div className="relative">
              <button type="button" className="flex w-full items-center justify-between rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 text-[10px] text-foreground">
                <span>{rightDate}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Shift</div>
            <div className="relative">
              <select value={shift} onChange={(event) => setShift(event.target.value)} className="w-full appearance-none rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 pr-8 text-[10px] text-foreground outline-none focus:border-primary/50">
                {['All Shifts', 'Shift A', 'Shift B', 'Shift C'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Area / Unit</div>
            <div className="relative">
              <select value={area} onChange={(event) => setArea(event.target.value)} className="w-full appearance-none rounded-md border border-border/70 bg-background/40 px-2.5 py-1.5 pr-8 text-[10px] text-foreground outline-none focus:border-primary/50">
                {['All Areas', 'Zone A', 'Zone B', 'Zone C', 'Zone D'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-end justify-end">
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground hover:border-primary/40 hover:text-primary">
              <Filter className="size-3.5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {content}
    </div>
  )
}

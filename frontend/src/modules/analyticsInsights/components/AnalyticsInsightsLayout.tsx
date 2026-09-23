import { useMemo, useState } from 'react'

import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Download,
  Gauge,
  MapPinned,
  ShieldAlert,
  Sparkles,
  TrendingUp,
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
  aiRecommendations,
  alertAnalyticsKpis,
  alertAssetData,
  alertSeverityData,
  alertSourceData,
  alertTableRows,
  alertTimeHeatmap,
  alertVolumeData,
  analyticsKpis,
  analyticsTabs,
  complianceData,
  complianceTrendData,
  drillPerformanceData,
  evacuationTrendData,
  forecastConfidenceData,
  heatmapData,
  highRiskAssets,
  incidentAnalyticsKpis,
  incidentByTypeData,
  incidentDurationData,
  incidentForecastData,
  incidentLocationData,
  incidentSeverityData,
  incidentTableRows,
  incidentTrendData,
  incidentTrendSeries,
  incidentTypeData,
  locationData,
  performanceAnalyticsKpis,
  performanceItems,
  predictiveAnalyticsKpis,
  predictiveMaintenanceData,
  recommendationCards,
  responseTimeData,
  responseTrendData,
  riskAnalyticsKpis,
  riskByZoneData,
  riskHeatmapData,
  riskRankingRows,
  riskSeverityData,
  riskTrendData,
  severityData,
  topRiskLocationsData,
  type AnalyticsTab,
  uptimeComparisonData,
} from '@/modules/analyticsInsights/analyticsData'
import { cn } from '@/utils/cn'
import { riskLevelFromScore } from '@/data/plant/types'
import { usePlantSimulation } from '@/modules/situationRoom/hooks/usePlantSimulation'
import { usePlantStore } from '@/store/usePlantStore'

const heatColorMap = ['#071d31', '#0f3259', '#145992', '#1a7dc8', '#f59e0b', '#ef4444']

type KpiItem = {
  title: string
  value: string
  delta: string
  tone: string
  trend: string
  icon: LucideIcon
  sparkline: number[]
}

function KpiGrid({ items }: { items: KpiItem[] }) {
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

function TableCard({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">{title}</div>
        <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 Days</span>
      </div>

      <div className="overflow-hidden rounded border border-border/70 bg-background/40">
        <table className="w-full border-collapse text-[9px] text-slate-200">
          <thead>
            <tr className="border-b border-border/70 bg-background/60">
              {columns.map((column) => (
                <th key={column} className="px-2 py-1.5 text-left font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-border/60 last:border-b-0">
                {row.map((cell, idx) => (
                  <td key={`${row[0]}-${idx}`} className="px-2 py-1.5 align-middle text-slate-200">
                    {idx === 3 || idx === 7 ? (
                      <span
                        className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', {
                          Critical: 'border-red-500/40 bg-red-500/10 text-red-200',
                          High: 'border-orange-500/40 bg-orange-500/10 text-orange-200',
                          Medium: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
                          Low: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                          Closed: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                          Monitoring: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
                          Escalated: 'border-red-500/40 bg-red-500/10 text-red-200',
                          Resolved: 'border-green-500/40 bg-green-500/10 text-green-200',
                          Acknowledged: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
                        }[cell] ?? 'border-border bg-background/50 text-slate-200')}
                      >
                        {cell}
                      </span>
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
  )
}

function OverviewContent() {
  return (
    <>
      <KpiGrid items={analyticsKpis} />

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENT TREND ANALYSIS</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 Days</div>
              </div>
              <button type="button" className="text-[9px] text-muted-foreground hover:text-foreground">This Week</button>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidentTrendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Legend wrapperStyle={{ fontSize: 9, paddingTop: 6 }} />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.2, fill: '#3b82f6' }} activeDot={{ r: 4 }} name="Total Incidents" />
                  <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} dot={{ r: 2.2, fill: '#ef4444' }} activeDot={{ r: 4 }} name="Critical Incidents" />
                  <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2.2, fill: '#f59e0b' }} activeDot={{ r: 4 }} name="High Risk Alerts" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENTS BY TYPE</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="flex h-[220px] items-center justify-center">
              <div className="relative h-[170px] w-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incidentTypeData} dataKey="value" innerRadius={52} outerRadius={72} paddingAngle={2} stroke="transparent">
                      {incidentTypeData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[22px] font-black text-white">32</div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1.5 text-[9px] text-muted-foreground">
              {incidentTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-foreground">{item.value} ({item.percent})</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">TOP RISK LOCATIONS</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={locationData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} width={92} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {locationData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT SEVERITY DISTRIBUTION</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="flex h-[220px] items-center justify-center">
              <div className="relative h-[150px] w-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={severityData} dataKey="value" innerRadius={44} outerRadius={68} paddingAngle={2} stroke="transparent">
                      {severityData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[20px] font-black text-white">256</div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-1.5 text-[9px] text-muted-foreground">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-foreground">{item.value} ({item.percent})</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERTS BY TIME OF DAY</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="space-y-1.5">
              <div className="grid grid-cols-[40px_repeat(6,minmax(0,1fr))] gap-1 text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                <div />
                {['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'].map((column) => (
                  <div key={column} className="text-center">{column}</div>
                ))}
              </div>
              {heatmapData.map((row) => (
                <div key={row.day} className="grid grid-cols-[40px_repeat(6,minmax(0,1fr))] gap-1 text-[8px]">
                  <div className="flex items-center text-muted-foreground">{row.day}</div>
                  {row.values.map((value, index) => (
                    <div key={`${row.day}-${index}`} className="h-6 rounded-sm border border-border/50" style={{ backgroundColor: heatColorMap[value] ?? '#0f172a' }} />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>Low</span>
              <div className="flex gap-1">
                {heatColorMap.map((color) => (
                  <span key={color} className="h-2.5 w-4 rounded-sm border border-border/50" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span>High</span>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">SAFETY COMPLIANCE OVER TIME</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 Days</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis domain={[80, 95]} tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.6} dot={{ r: 2.6, fill: '#10b981' }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PERFORMANCE SUMMARY</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 Days</span>
            </div>
            <div className="space-y-3 pt-2 text-[10px] text-muted-foreground">
              {performanceItems.map(({ label, value, delta, tone, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between gap-2 rounded border border-border/70 bg-background/40 px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-md border', {
                      red: 'border-red-500/40 bg-red-500/10 text-red-300',
                      cyan: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
                      green: 'border-green-500/40 bg-green-500/10 text-green-300',
                      purple: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
                    }[tone])}>
                      <Icon className="size-3.5" />
                    </span>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.12em] text-slate-300">{label}</div>
                      <div className="mt-0.5 text-[12px] font-bold text-white">{value}</div>
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.12em]', {
                    red: 'text-red-300',
                    cyan: 'text-cyan-300',
                    green: 'text-green-300',
                    purple: 'text-violet-300',
                  }[tone])}>
                    {tone === 'red' ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
                    {delta}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="border-border/80 bg-card/80 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">KEY INSIGHTS & RECOMMENDATIONS</div>
          <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View All</button>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-6">
          {recommendationCards.map((item) => (
            <div key={item.title} className={cn('rounded-lg border p-3', { red: 'border-red-500/35 bg-red-500/8', orange: 'border-orange-500/35 bg-orange-500/8', amber: 'border-yellow-500/35 bg-yellow-500/8', green: 'border-green-500/35 bg-green-500/8', cyan: 'border-cyan-500/35 bg-cyan-500/8', purple: 'border-violet-500/35 bg-violet-500/8' }[item.tone])}>
              <div className="mb-2 flex items-center justify-between">
                <div className={cn('inline-flex rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', { red: 'border-red-500/40 bg-red-500/10 text-red-200', orange: 'border-orange-500/40 bg-orange-500/10 text-orange-200', amber: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-200', green: 'border-green-500/40 bg-green-500/10 text-green-200', cyan: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200', purple: 'border-violet-500/40 bg-violet-500/10 text-violet-200' }[item.tone])}>
                  {item.tone === 'red' ? 'Critical' : item.tone === 'orange' ? 'Risk' : item.tone === 'amber' ? 'Alert' : item.tone === 'green' ? 'Compliance' : item.tone === 'cyan' ? 'Evacuation' : 'Downtime'}
                </div>
                <Sparkles className="size-4 text-slate-300" />
              </div>
              <div className="text-[11px] font-semibold text-foreground">{item.title}</div>
              <p className="mt-2 text-[10px] leading-5 text-muted-foreground">{item.description}</p>
              <button type="button" className="mt-3 rounded border border-border/70 bg-background/40 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-foreground hover:border-primary/40 hover:text-primary">{item.button}</button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

function IncidentAnalyticsContent() {
  return (
    <>
      <KpiGrid items={incidentAnalyticsKpis} />
      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENT TREND OVER TIME</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 days</span>
                  <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1 py-px text-[7px] font-bold uppercase tracking-[0.12em] text-amber-300">Sim</span>
                </div>
              </div>
              <button type="button" className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">This Week</button>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidentTrendSeries} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Legend wrapperStyle={{ fontSize: 9, paddingTop: 6 }} />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2.2, fill: '#3b82f6' }} name="Total" />
                  <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} dot={{ r: 2.2, fill: '#ef4444' }} name="Critical" />
                  <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2.2, fill: '#f59e0b' }} name="High Risk" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENT COUNT BY TYPE</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentByTypeData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={26}>
                    {incidentByTypeData.map((entry) => <Cell key={entry.type} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-2">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">SEVERITY</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">This Week</span>
            </div>
            <div className="flex h-[215px] items-center justify-center">
              <div className="relative h-[150px] w-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incidentSeverityData} dataKey="value" innerRadius={42} outerRadius={62} stroke="transparent">
                      {incidentSeverityData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[18px] font-black text-white">32</div>
                    <div className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENTS BY LOCATION</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentLocationData} layout="vertical" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} width={76} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RESPONSE-TIME ANALYSIS</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 2.5, fill: '#22d3ee' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENT-DURATION ANALYSIS</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentDurationData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <TableCard title="INCIDENT DETAIL TABLE" columns={['Incident ID', 'Type', 'Location', 'Severity', 'Start Time', 'Duration', 'Response Time', 'Status']} rows={incidentTableRows} />
    </>
  )
}

function RiskAnalyticsContent() {
  const backendConnected = usePlantStore(
    (state) => state.backendConnected,
  )
  const riskScores = usePlantStore((state) => state.riskScores)
  const riskTrendHistory = usePlantStore(
    (state) => state.riskTrendHistory,
  )
  const zones = usePlantStore((state) => state.zones)

  const liveRiskTrend = useMemo(() => {
    if (riskTrendHistory.length === 0) return null

    return riskTrendHistory.map((point) => ({
      day: new Date(point.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      score: point.cri,
    }))
  }, [riskTrendHistory])

  const riskTrendActive =
    backendConnected &&
    liveRiskTrend !== null &&
    liveRiskTrend.length > 0

  const liveRiskKpis = useMemo<KpiItem[]>(() => {
    if (!backendConnected) return riskAnalyticsKpis

    const criticalZoneCount = zones.filter(
      (zone) => riskLevelFromScore(zone.riskScore) === 'critical',
    ).length

    return riskAnalyticsKpis.map((kpi) => {
      if (kpi.title === 'OVERALL RISK SCORE') {
        return { ...kpi, value: `${riskScores.cri}/100` }
      }

      if (kpi.title === 'CRITICAL RISK ZONES') {
        return { ...kpi, value: String(criticalZoneCount) }
      }

      return kpi
    })
  }, [backendConnected, riskScores, zones])

  const liveRiskByZone = useMemo(
    () =>
      zones
        .filter((zone) => zone.riskScore > 0)
        .map((zone) => ({ zone: zone.name, value: zone.riskScore }))
        .sort((a, b) => b.value - a.value),
    [zones],
  )

  const riskByZoneActive =
    backendConnected && liveRiskByZone.length > 0

  return (
    <>
      <KpiGrid items={liveRiskKpis} />
      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RISK TREND</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Last 7 days</span>
                  {riskTrendActive ? (
                    <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1 py-px text-[7px] font-bold uppercase tracking-[0.12em] text-emerald-300">Live</span>
                  ) : (
                    <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1 py-px text-[7px] font-bold uppercase tracking-[0.12em] text-amber-300">Sim</span>
                  )}
                </div>
              </div>
              <button type="button" className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">Forecast</button>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendActive ? (liveRiskTrend ?? riskTrendData) : riskTrendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis domain={[50, 90]} tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 2.2, fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RISK BY ZONE</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskByZoneActive ? liveRiskByZone : riskByZoneData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="zone" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">TOP RISK LOCATIONS</div>
            <div className="flex h-[220px] items-center justify-center">
              <div className="relative h-[170px] w-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topRiskLocationsData} dataKey="value" innerRadius={46} outerRadius={68} stroke="transparent">
                      {topRiskLocationsData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RISK SEVERITY DISTRIBUTION</div>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskSeverityData} dataKey="value" innerRadius={42} outerRadius={62} stroke="transparent">
                    {riskSeverityData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RISK HEATMAP</div>
            <div className="space-y-1.5">
              {riskHeatmapData.map((row) => (
                <div key={row.day} className="grid grid-cols-6 gap-1">
                  <div className="flex items-center text-[8px] text-muted-foreground">{row.day}</div>
                  {row.values.map((value, index) => (
                    <div key={`${row.day}-${index}`} className="h-6 rounded-sm border border-border/50" style={{ backgroundColor: heatColorMap[value] ?? '#0f172a' }} />
                  ))}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RISK RANKING</div>
              <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Updated</span>
            </div>
            <div className="space-y-2">
              {riskRankingRows.map((row) => (
                <div key={row[0]} className="flex items-center justify-between rounded border border-border/70 bg-background/40 px-2 py-1.5">
                  <div>
                    <div className="text-[10px] font-semibold text-foreground">{row[0]}</div>
                    <div className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-muted-foreground">{row[3]}</div>
                  </div>
                  <div className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', row[1] === 'High Risk' ? 'border-red-500/40 bg-red-500/10 text-red-200' : row[1] === 'Medium Risk' ? 'border-amber-500/40 bg-amber-500/10 text-amber-200' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200')}>
                    {row[1]}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

function AlertAnalyticsContent() {
  return (
    <>
      <KpiGrid items={alertAnalyticsKpis} />
      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT VOLUME OVER TIME</div>
              <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1 py-px text-[7px] font-bold uppercase tracking-[0.12em] text-amber-300">Sim</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertVolumeData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 2.2, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-3">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT SEVERITY</div>
            <div className="flex h-[220px] items-center justify-center">
              <div className="relative h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={alertSeverityData} dataKey="value" innerRadius={44} outerRadius={66} stroke="transparent">
                      {alertSeverityData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERTS BY SOURCE</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertSourceData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="source" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERTS BY ASSET</div>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertAssetData} layout="vertical" margin={{ top: 8, right: 8, left: 6, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis type="category" dataKey="asset" tick={{ fill: '#cbd5e1', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} width={70} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERTS BY TIME OF DAY</div>
            <div className="space-y-1.5">
              {alertTimeHeatmap.map((row) => (
                <div key={row.day} className="grid grid-cols-6 gap-1">
                  <div className="flex items-center text-[8px] text-muted-foreground">{row.day}</div>
                  {row.values.map((value, index) => (
                    <div key={`${row.day}-${index}`} className="h-6 rounded-sm border border-border/50" style={{ backgroundColor: heatColorMap[value] ?? '#0f172a' }} />
                  ))}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[270px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ACKNOWLEDGED VS UNRESOLVED</div>
            <div className="space-y-3 pt-4 text-[10px] text-muted-foreground">
              <div className="rounded border border-border/70 bg-background/40 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Acknowledged</span>
                  <span className="text-[12px] font-bold text-emerald-300">212</span>
                </div>
                <div className="mt-2 h-2 rounded bg-border/80">
                  <div className="h-full w-[83%] rounded bg-emerald-500" />
                </div>
              </div>
              <div className="rounded border border-border/70 bg-background/40 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Unresolved</span>
                  <span className="text-[12px] font-bold text-amber-300">44</span>
                </div>
                <div className="mt-2 h-2 rounded bg-border/80">
                  <div className="h-full w-[17%] rounded bg-amber-500" />
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <TableCard title="ALERT DETAIL TABLE" columns={['Alert ID', 'Alert Type', 'Source', 'Severity', 'Time', 'Response Time', 'Status']} rows={alertTableRows} />
    </>
  )
}

function PerformanceAnalyticsContent() {
  return (
    <>
      <KpiGrid items={performanceAnalyticsKpis} />
      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RESPONSE TIME TREND</div>
              <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1 py-px text-[7px] font-bold uppercase tracking-[0.12em] text-amber-300">Sim</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTrendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 2.2, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">EVACUATION EFFICIENCY</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evacuationTrendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 2.2, fill: '#22d3ee' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">COMPLIANCE TREND</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceTrendData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis domain={[80, 95]} tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2.2, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">DRILL PERFORMANCE</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drillPerformanceData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="area" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#22d3ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-7">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">SYSTEM UPTIME & PERFORMANCE</div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={uptimeComparisonData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Legend wrapperStyle={{ fontSize: 9, paddingTop: 6 }} />
                  <Bar dataKey="current" name="Current" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="previous" name="Previous" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

function PredictiveInsightsContent() {
  const backendConnected = usePlantStore(
    (state) => state.backendConnected,
  )
  const forecast = usePlantStore((state) => state.forecast)

  const liveRiskForecast = useMemo(
    () =>
      forecast.points.map((point) => ({
        day: `${point.minute}m`,
        predicted: point.risk,
      })),
    [forecast],
  )

  const riskForecastActive =
    backendConnected && liveRiskForecast.length > 0

  return (
    <>
      <KpiGrid items={predictiveAnalyticsKpis} />
      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">INCIDENT FORECAST</div>
              <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1 py-px text-[7px] font-bold uppercase tracking-[0.12em] text-amber-300">Sim</span>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidentForecastData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Legend wrapperStyle={{ fontSize: 9, paddingTop: 6 }} />
                  <Line dataKey="predicted" stroke="#f59e0b" strokeWidth={2.2} dot={{ r: 2, fill: '#f59e0b' }} name="Predicted" />
                  <Line dataKey="observed" stroke="#10b981" strokeWidth={2.2} dot={{ r: 2, fill: '#10b981' }} name="Observed" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-6">
          <Panel className="h-[290px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RISK FORECAST</div>
              {riskForecastActive ? (
                <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1 py-px text-[7px] font-bold uppercase tracking-[0.12em] text-emerald-300">Live</span>
              ) : (
                <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1 py-px text-[7px] font-bold uppercase tracking-[0.12em] text-amber-300">Sim</span>
              )}
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskForecastActive ? liveRiskForecast : incidentForecastData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 4" stroke="#1f3147" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={{ stroke: '#1f3147' }} />
                  <Tooltip contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: '8px', fontSize: 10 }} labelStyle={{ color: '#dfeaf5', fontSize: 9 }} />
                  <Line type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 2, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">HIGH-RISK ASSETS</div>
            <div className="space-y-2">
              {highRiskAssets.map((item) => (
                <div key={item.asset} className="rounded border border-border/70 bg-background/40 p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-foreground">{item.asset}</span>
                    <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', item.status === 'Critical' ? 'border-red-500/40 bg-red-500/10 text-red-200' : item.status === 'High' ? 'border-orange-500/40 bg-orange-500/10 text-orange-200' : 'border-amber-500/40 bg-amber-500/10 text-amber-200')}>{item.status}</span>
                  </div>
                  <div className="mt-2 h-2 rounded bg-border/80">
                    <div className="h-full rounded bg-gradient-to-r from-red-500 to-amber-400" style={{ width: `${item.score}%` }} />
                  </div>
                  <div className="mt-1 text-right text-[8px] uppercase tracking-[0.12em] text-muted-foreground">{item.score}/100</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">AI RECOMMENDATIONS</div>
            <div className="space-y-2">
              {aiRecommendations.map((item, index) => (
                <div key={item} className="rounded border border-border/70 bg-background/40 p-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-[8px] font-bold text-cyan-200">{index + 1}</span>
                    <span className="text-[9px] leading-5 text-slate-200">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-4">
          <Panel className="h-[280px] border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">FORECAST CONFIDENCE</div>
            <div className="flex h-[220px] items-center justify-center">
              <div className="relative h-[160px] w-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={forecastConfidenceData} dataKey="value" innerRadius={46} outerRadius={62} stroke="transparent">
                      {forecastConfidenceData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[18px] font-black text-white">93%</div>
                    <div className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="border-border/80 bg-card/80 p-3">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">PREDICTIVE MAINTENANCE</div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {predictiveMaintenanceData.map((item) => (
            <div key={item.asset} className="rounded border border-border/70 bg-background/40 p-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-foreground">{item.asset}</span>
                <span className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground">{item.nextDue}</span>
              </div>
              <div className="mt-2 h-2 rounded bg-border/80">
                <div className="h-full rounded bg-cyan-500" style={{ width: `${item.confidence}%` }} />
              </div>
              <div className="mt-1 text-right text-[8px] uppercase tracking-[0.12em] text-muted-foreground">{item.confidence}%</div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

export function AnalyticsInsightsLayout() {
  usePlantSimulation(true)

  const [activeTab, setActiveTab] = useState<AnalyticsTab>('Overview')
  const rightDate = useMemo(() => '10 May 2025 – 17 May 2025', [])

  const content =
    activeTab === 'Overview' ? (
      <OverviewContent />
    ) : activeTab === 'Incident Analytics' ? (
      <IncidentAnalyticsContent />
    ) : activeTab === 'Risk Analytics' ? (
      <RiskAnalyticsContent />
    ) : activeTab === 'Alert Analytics' ? (
      <AlertAnalyticsContent />
    ) : activeTab === 'Performance Analytics' ? (
      <PerformanceAnalyticsContent />
    ) : (
      <PredictiveInsightsContent />
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-3.5">
      <header className="rounded-lg border border-border/80 bg-card/80 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
              <ShieldAlert className="size-4" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-primary">SAFE.AI</div>
              <div className="text-[7px] uppercase tracking-[0.14em] text-muted-foreground">Analytics & Insights</div>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 text-[10px] lg:flex">
            <div className="rounded border border-border/70 bg-background/40 px-2 py-1 text-muted-foreground">Plant: Jamnagar Refinery</div>
            <div className="rounded border border-border/70 bg-background/40 px-2 py-1 text-muted-foreground">Date &amp; Time: 17 May 2025, 10:24:35 AM</div>
            <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 font-semibold uppercase tracking-[0.14em] text-red-300">System Status: EMERGENCY</div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground">
              <Bell className="size-3.5" />
            </button>
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground">
              <AlertTriangle className="size-3.5" />
            </button>
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground">
              <Gauge className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-2.5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">ANALYTICS &amp; INSIGHTS</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Transforming Safety Data into Actionable Insights</div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-2 rounded border border-border/70 bg-background/40 px-2 py-1 text-[10px] text-muted-foreground">
              <MapPinned className="size-3.5 text-cyan-400" />
              Jamnagar Refinery
            </div>
            <div className="flex items-center gap-2 rounded border border-border/70 bg-background/40 px-2 py-1 text-[10px] text-muted-foreground">
              <TrendingUp className="size-3.5 text-success" />
              17 May 2025
            </div>
          </div>
        </div>
      </header>

      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <nav className="flex flex-wrap items-center gap-1.5">
          {analyticsTabs.map((tab) => (
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

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-card/80 px-3 py-2">
        <div className="hidden items-center gap-2 text-[10px] text-muted-foreground md:flex">
          <span className="rounded border border-border/70 bg-background/40 px-2 py-1">Range</span>
          <span className="inline-flex items-center gap-1 rounded border border-border/70 bg-background/40 px-2 py-1 text-foreground">
            {rightDate}
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </span>
        </div>
        <button type="button" className="ml-auto inline-flex items-center gap-2 rounded border border-border/70 bg-background/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground hover:border-primary/40 hover:text-primary">
          <Download className="size-3.5" />
          Export Report
        </button>
      </div>

      {content}
    </div>
  )
}

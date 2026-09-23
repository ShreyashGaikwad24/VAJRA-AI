import { useMemo, useState } from 'react'

import {
  AlertTriangle,
  Bell,
  BellRing,
  ChevronDown,
  Clock3,
  Download,
  Eye,
  Filter,
  HelpCircle,
  Mail,
  Phone,
  ShieldAlert,
  Siren,
  Smartphone,
  UserRound,
  Wifi,
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { MetricCard } from '@/components/cards/MetricCard'
import { Panel } from '@/components/cards/Panel'
import { SelectField } from '@/components/common/SelectField'
import { SearchBox } from '@/components/common/SearchBox'
import { severityChartData, type AlertTab, type SafeAlert } from '@/modules/alertsNotifications/alertsData'
import { alertRows, alertTabs, areaOptions, escalationMatrix, escalationSummary, kpiCards, notificationChannels, recentNotifications, severityOptions, sortOptions, alertRules, contactDirectory } from '@/modules/alertsNotifications/alertsData'
import { cn } from '@/utils/cn'
import { riskLevelFromScore } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'

const getSeverityClasses = (severity: SafeAlert['severity']) => {
  if (severity === 'CRITICAL') return 'border-red-500/35 bg-red-500/10 text-red-200'
  if (severity === 'HIGH') return 'border-orange-500/35 bg-orange-500/10 text-orange-200'
  if (severity === 'MEDIUM') return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
  if (severity === 'LOW') return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
  return 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200'
}

const getStatusClasses = (status: SafeAlert['status']) => {
  if (status === 'Unacknowledged') return 'border-red-500/35 bg-red-500/10 text-red-200'
  if (status === 'Acknowledged') return 'border-orange-500/35 bg-orange-500/10 text-orange-200'
  if (status === 'In Progress') return 'border-amber-500/35 bg-amber-500/10 text-amber-200'
  if (status === 'Information') return 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200'
  return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
}

function ActiveAlertsView({
  selectedAlert,
  onSelectAlert,
}: {
  selectedAlert: SafeAlert
  onSelectAlert: (alert: SafeAlert) => void
}) {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('All Severities')
  const [area, setArea] = useState('All Areas')
  const [sort, setSort] = useState('Newest First')

  const filteredAlerts = useMemo(() => {
    let rows = [...alertRows]

    if (search.trim()) {
      const query = search.trim().toLowerCase()
      rows = rows.filter((row) => `${row.id} ${row.title} ${row.description} ${row.area} ${row.zone}`.toLowerCase().includes(query))
    }

    if (severity !== 'All Severities') {
      rows = rows.filter((row) => row.severity === severity)
    }

    if (area !== 'All Areas') {
      rows = rows.filter((row) => row.area === area)
    }

    if (sort === 'Oldest First') {
      rows.reverse()
    }

    if (sort === 'Highest Severity') {
      const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, INFO: 0 }
      rows.sort((a, b) => order[b.severity] - order[a.severity])
    }

    return rows
  }, [search, severity, area, sort])

  return (
    <div className="grid gap-2.5 xl:grid-cols-[minmax(0,2fr)_minmax(250px,0.9fr)]">
      <div className="space-y-2.5">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-3 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ACTIVE ALERTS</div>
            <div className="flex flex-wrap items-center gap-2">
              <SelectField label="Severity" value={severity} options={severityOptions} onChange={setSeverity} className="min-w-[130px]" />
              <SelectField label="Area" value={area} options={areaOptions} onChange={setArea} className="min-w-[130px]" />
              <SelectField label="Sort" value={sort} options={sortOptions} onChange={setSort} className="min-w-[150px]" />
              <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground">
                <Filter className="size-3.5" />
              </button>
              <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground">
                <Bell className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="mb-3">
            <SearchBox value={search} onChange={setSearch} placeholder="Search alerts..." className="h-9 border-border/70 bg-background/35 text-[10px]" />
          </div>

          <div className="overflow-hidden rounded border border-border/70 bg-background/30">
            <div className="overflow-x-auto">
              <table className="min-w-[860px] w-full border-collapse text-[9px] text-slate-200">
                <thead>
                  <tr className="border-b border-border/70 bg-background/55 text-left">
                    {['Alert ID', 'Alert Title', 'Area / Unit', 'Severity', 'Triggered At', 'Status', 'Acknowledged By', 'Actions'].map((header) => (
                      <th key={header} className="px-2 py-2 font-semibold uppercase tracking-[0.12em] text-muted-foreground">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((alert) => {
                    const dateParts = alert.triggeredAt.split('\n')
                    return (
                      <tr key={alert.id} className={cn('border-b border-border/70 last:border-b-0', selectedAlert.id === alert.id && 'bg-primary/5')}>
                        <td className="px-2 py-2 text-slate-200">{alert.id}</td>
                        <td className="px-2 py-2">
                          <div className="font-medium text-foreground">{alert.title}</div>
                          <div className="mt-0.5 text-[8px] text-muted-foreground">{alert.description}</div>
                        </td>
                        <td className="px-2 py-2">
                          <div className="text-slate-200">{alert.area}</div>
                          <div className="text-[8px] text-muted-foreground">{alert.zone}</div>
                        </td>
                        <td className="px-2 py-2">
                          <span className={cn('inline-flex rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]', getSeverityClasses(alert.severity))}>{alert.severity}</span>
                        </td>
                        <td className="px-2 py-2">
                          <div>{dateParts[0]}</div>
                          <div className="text-[8px] text-muted-foreground">{dateParts[1]}</div>
                        </td>
                        <td className="px-2 py-2">
                          <span className={cn('inline-flex rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]', getStatusClasses(alert.status))}>{alert.status}</span>
                        </td>
                        <td className="px-2 py-2">
                          {alert.acknowledgedBy ? (
                            <>
                              <div>{alert.acknowledgedBy}</div>
                              {alert.acknowledgedTime ? <div className="text-[8px] text-muted-foreground">{alert.acknowledgedTime}</div> : null}
                            </>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => onSelectAlert(alert)} className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
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
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENT NOTIFICATIONS</div>
            <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View All Notifications</button>
          </div>
          <div className="space-y-2">
            {recentNotifications.map((item) => (
              <div key={item.id} className="flex items-start gap-2 rounded border border-border/70 bg-background/35 p-2.5">
                <span className={cn('mt-0.5 inline-flex size-5 items-center justify-center rounded-md border', getSeverityClasses(item.severity))}>
                  {item.severity === 'CRITICAL' ? <AlertTriangle className="size-3" /> : item.severity === 'HIGH' ? <BellRing className="size-3" /> : item.severity === 'LOW' ? <ShieldAlert className="size-3" /> : <BellRing className="size-3" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-medium text-foreground">{item.title}</div>
                  <div className="mt-1 text-[8px] text-muted-foreground">{item.detail}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[8px] text-muted-foreground">{item.time}</span>
                  <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', getSeverityClasses(item.severity))}>{item.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-2.5">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT DETAILS</div>
            <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View Full Details →</button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-semibold text-foreground">{selectedAlert.title}</div>
              <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', getSeverityClasses(selectedAlert.severity))}>{selectedAlert.severity}</span>
            </div>

            <div className="rounded border border-border/70 bg-background/35 p-2.5 text-[9px] text-muted-foreground">
              <div className="mb-1 text-[8px] uppercase tracking-[0.14em] text-cyan-300">Alert ID</div>
              <div className="text-[10px] font-medium text-foreground">{selectedAlert.id}</div>
            </div>

            <div className="text-[9px] leading-5 text-muted-foreground">
              <div className="mb-2 font-medium text-foreground">{selectedAlert.description}</div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2"><span>Area / Unit</span><span className="text-right text-foreground">{selectedAlert.area}, {selectedAlert.zone}</span></div>
                <div className="flex items-center justify-between gap-2"><span>Triggered At</span><span className="text-right text-foreground">{selectedAlert.triggeredAt.replace('\n', ', ')}</span></div>
                <div className="flex items-center justify-between gap-2"><span>Detected By</span><span className="text-right text-foreground">{selectedAlert.detectedBy}</span></div>
                <div className="flex items-center justify-between gap-2"><span>Current Value</span><span className="text-right text-foreground">{selectedAlert.currentValue}</span></div>
                <div className="flex items-center justify-between gap-2"><span>Threshold</span><span className="text-right text-foreground">{selectedAlert.threshold}</span></div>
                <div className="flex items-center justify-between gap-2"><span>Recommended Action</span><span className="max-w-[120px] text-right text-foreground">{selectedAlert.recommendedAction}</span></div>
              </div>
            </div>

            <button type="button" className="w-full rounded-md border border-red-500/40 bg-red-500/15 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-red-100 hover:bg-red-500/20">
              View on Digital Twin ↗
            </button>
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERTS BY SEVERITY</div>
            <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">This Week <ChevronDown className="size-3" /></button>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-[118px] w-[118px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={severityChartData} dataKey="value" innerRadius={32} outerRadius={52} paddingAngle={2} stroke="transparent">
                    {severityChartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[22px] font-black text-foreground">24</div>
                  <div className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
            <div className="w-full space-y-1.5 text-[9px] text-muted-foreground">
              {severityChartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-foreground">{item.value} ({item.percent})</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">NOTIFICATION CHANNELS</div>
            <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">Manage Channels</button>
          </div>
          <div className="space-y-2">
            {notificationChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between gap-3 rounded border border-border/70 bg-background/35 px-2.5 py-2 text-[9px]">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-200">
                    {channel.label.includes('Email') ? <Mail className="size-3.5" /> : channel.label.includes('SMS') ? <Phone className="size-3.5" /> : channel.label.includes('Push') ? <Wifi className="size-3.5" /> : <Smartphone className="size-3.5" />}
                  </span>
                  <span className="font-medium text-foreground">{channel.label}</span>
                </div>
                <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-200">{channel.active ? 'Active' : 'Inactive'}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ESCALATION SUMMARY</div>
            <button type="button" className="flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">This Week <ChevronDown className="size-3" /></button>
          </div>
          <div className="space-y-2 text-[9px]">
            {[
              { label: 'Total Escalations', value: escalationSummary.total, icon: Siren },
              { label: 'Escalated Alerts', value: `${escalationSummary.escalatedAlerts} (${Math.round((escalationSummary.escalatedAlerts / escalationSummary.total) * 100)}%)`, icon: AlertTriangle },
              { label: 'Avg Escalation Time', value: escalationSummary.averageTime, icon: Clock3 },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center justify-between rounded border border-border/70 bg-background/35 px-2.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-200"><Icon className="size-3" /></span>
                    <span className="text-foreground">{item.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function AlertHistoryView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT HISTORY</div>
      <div className="overflow-hidden rounded border border-border/70 bg-background/35">
        <table className="min-w-full w-full border-collapse text-[9px]">
          <thead>
            <tr className="border-b border-border/70 bg-background/55 text-left">
              {['Alert ID', 'Title', 'Severity', 'Triggered At', 'State', 'Owner'].map((header) => (
                <th key={header} className="px-2 py-2 font-semibold uppercase tracking-[0.12em] text-muted-foreground">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alertRows.map((alert, index) => (
              <tr key={`${alert.id}-${index}`} className="border-b border-border/70 last:border-b-0">
                <td className="px-2 py-2 text-slate-200">{alert.id}</td>
                <td className="px-2 py-2 text-foreground">{alert.title}</td>
                <td className="px-2 py-2"><span className={cn('inline-flex rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]', getSeverityClasses(alert.severity))}>{alert.severity}</span></td>
                <td className="px-2 py-2 text-slate-200">{alert.triggeredAt.replace('\n', ' ')}</td>
                <td className="px-2 py-2"><span className={cn('inline-flex rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]', getStatusClasses(alert.status))}>{alert.status}</span></td>
                <td className="px-2 py-2 text-slate-200">{alert.acknowledgedBy ?? 'System'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function NotificationLogView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">NOTIFICATION LOG</div>
      <div className="space-y-2">
        {recentNotifications.map((item) => (
          <div key={item.id} className="flex items-start gap-2 rounded border border-border/70 bg-background/35 p-2.5">
            <span className={cn('mt-0.5 inline-flex size-5 items-center justify-center rounded-md border', getSeverityClasses(item.severity))}>{item.severity === 'INFO' ? <BellRing className="size-3" /> : <AlertTriangle className="size-3" />}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-medium text-foreground">{item.title}</div>
              <div className="mt-1 text-[8px] text-muted-foreground">{item.detail}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[8px] text-muted-foreground">{item.time}</span>
              <span className={cn('inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', getSeverityClasses(item.severity))}>{item.severity}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function EscalationMatrixView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ESCALATION MATRIX</div>
      <div className="overflow-hidden rounded border border-border/70 bg-background/35">
        <table className="min-w-full w-full border-collapse text-[9px]">
          <thead>
            <tr className="border-b border-border/70 bg-background/55 text-left">
              {['Level', 'Owner', 'SLA'].map((header) => (
                <th key={header} className="px-2 py-2 font-semibold uppercase tracking-[0.12em] text-muted-foreground">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {escalationMatrix.map((row) => (
              <tr key={row.stage} className="border-b border-border/70 last:border-b-0">
                <td className="px-2 py-2 text-foreground">{row.stage}</td>
                <td className="px-2 py-2 text-slate-200">{row.owner}</td>
                <td className="px-2 py-2 text-slate-200">{row.sla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function ContactDirectoryView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">CONTACT DIRECTORY</div>
      <div className="space-y-2">
        {contactDirectory.map((person) => (
          <div key={person.name} className="flex items-center justify-between gap-3 rounded border border-border/70 bg-background/35 px-2.5 py-2">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-200"><UserRound className="size-3.5" /></span>
              <div>
                <div className="text-[9px] font-medium text-foreground">{person.name}</div>
                <div className="text-[8px] text-muted-foreground">{person.role}</div>
              </div>
            </div>
            <div className="text-right text-[8px] text-muted-foreground">{person.phone}</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function AlertRulesView() {
  return (
    <Panel className="border-border/80 bg-card/80 p-3">
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">ALERT RULES</div>
      <div className="space-y-2">
        {alertRules.map((rule) => (
          <div key={rule} className="flex items-start gap-2 rounded border border-border/70 bg-background/35 px-2.5 py-2">
            <span className="mt-0.5 flex size-5 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-200"><HelpCircle className="size-3" /></span>
            <div className="text-[9px] leading-5 text-foreground">{rule}</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function AlertsNotificationsLayout() {
  const plantName = usePlantStore((state) => state.plantName)
  const riskScores = usePlantStore((state) => state.riskScores)
  const backendConnected = usePlantStore((state) => state.backendConnected)

  const currentRiskLevel = riskLevelFromScore(riskScores.cri)

  const [activeTab, setActiveTab] = useState<AlertTab>('Active Alerts')
  const [selectedAlert, setSelectedAlert] = useState<SafeAlert>(alertRows[0])

  const view =
    activeTab === 'Alert History' ? (
      <AlertHistoryView />
    ) : activeTab === 'Notification Log' ? (
      <NotificationLogView />
    ) : activeTab === 'Escalation Matrix' ? (
      <EscalationMatrixView />
    ) : activeTab === 'Contact Directory' ? (
      <ContactDirectoryView />
    ) : activeTab === 'Alert Rules' ? (
      <AlertRulesView />
    ) : (
      <ActiveAlertsView selectedAlert={selectedAlert} onSelectAlert={setSelectedAlert} />
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-0.5">
      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">ALERTS &amp; NOTIFICATIONS</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Real-time Alerts, Notifications &amp; Escalation Management</div>
          </div>
<div className="hidden items-center gap-2 md:flex">
  <div className="rounded border border-border/70 bg-background/35 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
    Plant: {plantName || 'Unknown Plant'}
  </div>

  <div className="rounded border border-border/70 bg-background/35 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
    Date &amp; Time: {new Date().toLocaleString()}
  </div>

  <div
    className={cn(
      'rounded border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em]',
      currentRiskLevel === 'critical'
        ? 'border-red-500/40 bg-red-500/10 text-red-200'
        : currentRiskLevel === 'high'
          ? 'border-orange-500/40 bg-orange-500/10 text-orange-200'
          : currentRiskLevel === 'medium'
            ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    )}
  >
    System Status: {backendConnected ? currentRiskLevel.toUpperCase() : 'OFFLINE'}
  </div>
</div>
        </div>

        <nav className="mt-2 flex flex-wrap items-center gap-1.5">
          {alertTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all',
                activeTab === tab
                  ? 'border-red-500/50 bg-red-500/10 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.12)]'
                  : 'border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-background/60 hover:text-foreground',
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-5">
        {kpiCards.map((item, index) => (
          <MetricCard
            key={item.title}
            label={item.title}
            value={item.value}
            delta={item.delta}
            description={item.description}
            tone={item.tone as 'default' | 'success' | 'warning' | 'danger' | 'critical'}
            trend={item.trend as 'up' | 'down' | 'flat'}
            icon={item.icon}
            sparkline={item.sparkline as number[]}
            index={index}
          />
        ))}
      </div>

      {view}
    </div>
  )
}

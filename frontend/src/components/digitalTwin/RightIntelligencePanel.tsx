import { Card } from '@/components/cards/Card'

const riskContributors = [
  { label: 'Thermal Drift', value: '82%', tone: 'text-critical' },
  { label: 'Permit Overlap', value: '67%', tone: 'text-warning' },
  { label: 'Worker Congestion', value: '54%', tone: 'text-danger' },
]

const zoneRisk = [
  { zone: 'Zone A', value: 28, tone: 'bg-success' },
  { zone: 'Zone B', value: 46, tone: 'bg-warning' },
  { zone: 'Zone C', value: 79, tone: 'bg-danger' },
  { zone: 'Zone D', value: 63, tone: 'bg-warning' },
  { zone: 'Zone E', value: 38, tone: 'bg-success' },
]

export function RightIntelligencePanel() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-auto pr-0.5">
      <Card title="Plant Health Overview" subtitle="Real-time condition snapshot">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Health</p>
            <p className="text-[16px] font-semibold text-success">76%</p>
          </div>
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Uptime</p>
            <p className="text-[16px] font-semibold text-foreground">99.2%</p>
          </div>
        </div>
      </Card>

      <Card title="Risk Contributors" subtitle="Top factors impacting risk">
        <div className="space-y-1">
          {riskContributors.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-md border border-border/70 bg-background/55 px-2 py-1 text-[11px]">
              <span className="text-foreground">{item.label}</span>
              <span className={`font-semibold ${item.tone}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Zone Risk Summary" subtitle="Current zone exposure levels">
        <div className="space-y-1.5">
          {zoneRisk.map((item) => (
            <div key={item.zone}>
              <div className="mb-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{item.zone}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-background/60">
                <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Active Alerts" subtitle="Priority event queue">
        <div className="space-y-1">
          {[
            'Gas concentration rise near Zone C',
            'Permit overlap in maintenance corridor',
            'Camera C-12 heartbeat lag detected',
          ].map((alert) => (
            <p key={alert} className="rounded-md border border-border/70 bg-background/55 px-2 py-1 text-[11px] text-foreground">
              {alert}
            </p>
          ))}
        </div>
      </Card>

      <Card title="AI Insights" subtitle="Spatial behavior highlights">
        <p className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5 text-[11px] text-muted-foreground">
          AI predicts a 14% risk reduction if high-density worker paths are shifted east of Zone C within the next 20 minutes.
        </p>
      </Card>

      <Card title="Worker Distribution" subtitle="Current field allocation">
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Ops</p>
            <p className="text-[13px] font-semibold text-foreground">148</p>
          </div>
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Safety</p>
            <p className="text-[13px] font-semibold text-foreground">86</p>
          </div>
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Maint</p>
            <p className="text-[13px] font-semibold text-foreground">122</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

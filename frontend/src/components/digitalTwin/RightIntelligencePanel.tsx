import { Card } from '@/components/cards/Card'
import { usePlantStore } from '@/store/usePlantStore'

export function RightIntelligencePanel() {
  const equipment = usePlantStore((state) => state.equipment)
  const zones = usePlantStore((state) => state.zones)
  const riskScores = usePlantStore((state) => state.riskScores)
  const riskContributors = usePlantStore((state) => state.riskContributors)
  const explanation = usePlantStore((state) => state.explanation)

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-auto pr-0.5">
      <Card title="Plant Health Overview" subtitle="Real-time condition snapshot">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Health</p>
            <p className="text-[16px] font-semibold text-success">{Math.round(equipment.reduce((sum, item) => sum + item.health, 0) / Math.max(equipment.length, 1))}%</p>
          </div>
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Uptime</p>
            <p className="text-[16px] font-semibold text-foreground">CRI {riskScores.cri}</p>
          </div>
        </div>
      </Card>

      <Card title="Risk Contributors" subtitle="Top factors impacting risk">
        <div className="space-y-1">
          {riskContributors.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md border border-border/70 bg-background/55 px-2 py-1 text-[11px]">
              <span className="text-foreground">{item.factor}</span>
              <span className="font-semibold text-warning">{item.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Zone Risk Summary" subtitle="Current zone exposure levels">
        <div className="space-y-1.5">
          {zones.map((item) => (
            <div key={item.id}>
              <div className="mb-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{item.label}</span>
                <span>{item.riskScore}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-background/60">
                <div className="h-full rounded-full bg-warning" style={{ width: `${item.riskScore}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Active Alerts" subtitle="Priority event queue">
        <div className="space-y-1">
          {riskContributors.length > 0 ? riskContributors.slice(0, 3).map((item) => (
            <p key={item.id} className="rounded-md border border-border/70 bg-background/55 px-2 py-1 text-[11px] text-foreground">
              {item.factor} · {item.value}% impact
            </p>
          )) : <p className="text-[11px] text-muted-foreground">No backend alerts available</p>}
        </div>
      </Card>

      <Card title="AI Insights" subtitle="Spatial behavior highlights">
        <p className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5 text-[11px] text-muted-foreground">
          {explanation.text}
        </p>
      </Card>

      <Card title="Worker Distribution" subtitle="Backend total; role breakdown unavailable">
        <p className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5 text-[13px] font-semibold text-foreground">
          {equipment.reduce((sum, item) => sum + item.workersNearby, 0)} workers nearby
        </p>
      </Card>
    </div>
  )
}

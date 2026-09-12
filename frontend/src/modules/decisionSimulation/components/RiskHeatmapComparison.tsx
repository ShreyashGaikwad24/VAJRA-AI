import { Card } from '@/components/cards/Card'
import type { SimulationSnapshot } from '@/modules/decisionSimulation/services/simulationTypes'

function colorFromScore(score: number): string {
  if (score >= 80) return '#dc2626'
  if (score >= 60) return '#f97316'
  if (score >= 40) return '#eab308'
  if (score >= 20) return '#22c55e'
  return '#3b82f6'
}

function HeatRow({ title, snapshot }: { title: string; snapshot: SimulationSnapshot }) {
  return (
    <div className="rounded-md border border-border/60 bg-background/35 p-2 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
      <div className="grid grid-cols-5 gap-1.5">
        {snapshot.zones.map((zone) => (
          <div key={zone.id} className="rounded border border-border/60 bg-background/45 p-1">
            <div className="mb-1 text-[8px] text-muted-foreground">{zone.id}</div>
            <div
              className="h-8 rounded"
              style={{
                background: `linear-gradient(180deg, ${colorFromScore(zone.riskScore)}80, ${colorFromScore(zone.riskScore)}30)`,
                boxShadow: `0 0 12px ${colorFromScore(zone.riskScore)}40`,
              }}
            />
            <div className="mt-1 text-[9px] font-semibold text-foreground">{zone.riskScore}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RiskHeatmapComparison({ before, after }: { before: SimulationSnapshot; after: SimulationSnapshot | null }) {
  return (
    <Card title="Risk Heatmap Comparison" subtitle="Risk intensity transition from before to after simulation" className="border-primary/20">
      <div className="grid gap-2 xl:grid-cols-2">
        <HeatRow title="Before Simulation" snapshot={before} />
        <HeatRow title="After Simulation" snapshot={after ?? before} />
      </div>

      <div className="mt-2 rounded border border-border/60 bg-background/35 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        Risk Intensity: Low to High
      </div>
    </Card>
  )
}

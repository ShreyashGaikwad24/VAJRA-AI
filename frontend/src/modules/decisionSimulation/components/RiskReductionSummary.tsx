import { Card } from '@/components/cards/Card'

type RiskReductionSummaryProps = {
  criReductionPct: number
  incidentRiskReductionPct: number
  downtimeRiskReductionPct: number
  potentialLossReductionPct: number
}

function Donut({ label, value }: { label: string; value: number }) {
  const pct = Math.max(-100, Math.min(100, value))
  const progress = Math.max(0, pct)
  const stroke = 2 * Math.PI * 28
  const offset = stroke - (progress / 100) * stroke

  return (
    <div className="rounded-md border border-border/60 bg-background/30 p-2 text-center shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
      <div className="mx-auto h-18 w-18">
        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
          <circle cx="36" cy="36" r="28" stroke="#1f3147" strokeWidth="7" fill="none" />
          <circle
            cx="36"
            cy="36"
            r="28"
            stroke={pct >= 0 ? '#22c55e' : '#dc2626'}
            strokeWidth="7"
            fill="none"
            strokeDasharray={stroke}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="-mt-11 text-[12px] font-bold text-foreground">{pct > 0 ? '-' : ''}{Math.abs(pct)}%</div>
      <p className="mt-6 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    </div>
  )
}

export function RiskReductionSummary({
  criReductionPct,
  incidentRiskReductionPct,
  downtimeRiskReductionPct,
  potentialLossReductionPct,
}: RiskReductionSummaryProps) {
  return (
    <Card title="Risk Reduction Summary" subtitle="Projected reduction from selected interventions" className="border-primary/20">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Donut label="CRI Reduction" value={criReductionPct} />
        <Donut label="Incident Risk" value={incidentRiskReductionPct} />
        <Donut label="Downtime Risk" value={downtimeRiskReductionPct} />
        <Donut label="Potential Loss" value={potentialLossReductionPct} />
      </div>
    </Card>
  )
}

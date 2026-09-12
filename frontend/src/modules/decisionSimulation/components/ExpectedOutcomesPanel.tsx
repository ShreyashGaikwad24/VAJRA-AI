import { Card } from '@/components/cards/Card'

type ExpectedOutcomesPanelProps = {
  riskReduction: number
  safetyImprovement: 'Low' | 'Moderate' | 'High'
  operationalStability: 'Degraded' | 'Stable' | 'Improved'
  confidenceScore: number
}

export function ExpectedOutcomesPanel({
  riskReduction,
  safetyImprovement,
  operationalStability,
  confidenceScore,
}: ExpectedOutcomesPanelProps) {
  const stroke = 2 * Math.PI * 28
  const offset = stroke - (Math.max(0, confidenceScore) / 100) * stroke

  return (
    <Card title="Expected Outcomes" subtitle="Scenario-level projection after intervention" className="border-primary/20">
      <div className="grid gap-2 xl:grid-cols-[1fr_108px]">
        <div className="space-y-1.5">
          <div className="rounded border border-border/60 bg-background/30 px-2 py-1 text-[10px] text-foreground shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
            Risk Reduction: <span className="font-semibold">{riskReduction}%</span>
          </div>
          <div className="rounded border border-border/60 bg-background/30 px-2 py-1 text-[10px] text-foreground shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
            Safety Improvement: <span className="font-semibold">{safetyImprovement}</span>
          </div>
          <div className="rounded border border-border/60 bg-background/30 px-2 py-1 text-[10px] text-foreground shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
            Operational Stability: <span className="font-semibold">{operationalStability}</span>
          </div>
        </div>

        <div className="rounded border border-border/60 bg-background/30 p-2 text-center shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
          <div className="mx-auto h-20 w-20">
            <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
              <circle cx="36" cy="36" r="28" stroke="#1f3147" strokeWidth="7" fill="none" />
              <circle
                cx="36"
                cy="36"
                r="28"
                stroke="#3b82f6"
                strokeWidth="7"
                fill="none"
                strokeDasharray={stroke}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="-mt-11 text-[14px] font-bold text-primary">{confidenceScore}%</div>
          <p className="mt-6 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Confidence Score</p>
        </div>
      </div>
    </Card>
  )
}

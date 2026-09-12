import { ArrowRightLeft } from 'lucide-react'

import { Card } from '@/components/cards/Card'
import { levelLabel } from '@/modules/decisionSimulation/services/simulationEngine'
import type { SimulationSnapshot } from '@/modules/decisionSimulation/services/simulationTypes'

import { SimulationPlantView } from './SimulationPlantView'

type SimulationComparisonProps = {
  before: SimulationSnapshot
  after: SimulationSnapshot | null
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border/60 bg-background/35 px-2 py-1 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.25)]">
      <div className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className="text-[10px] font-semibold text-foreground">{value}</div>
    </div>
  )
}

function StateCard({ title, snapshot, mode }: { title: string; snapshot: SimulationSnapshot; mode: 'before' | 'after' }) {
  const topContributor = snapshot.riskContributors[0]
  const reactor = snapshot.equipment.find((item) => item.id === 'R-101')

  return (
    <Card
      title={title}
      className={`h-full ${mode === 'after' ? 'border-success/35 shadow-[0_0_0_1px_rgba(34,197,94,0.1)]' : 'border-border/70'}`}
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 rounded-md border border-border/50 bg-background/25 p-1.5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground">Risk Level</p>
            <p className="text-[12px] font-bold text-critical">{levelLabel(snapshot.metrics.predictedIncidents).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground">Top Risk</p>
            <p className="text-[10px] font-semibold text-foreground">{topContributor?.factor ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground">Area</p>
            <p className="text-[10px] font-semibold text-foreground">Zone C - Hot Work</p>
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground">CRI</p>
            <p className="text-[12px] font-bold text-critical">{snapshot.riskScores.cri} {levelLabel(snapshot.metrics.predictedIncidents).toUpperCase()}</p>
          </div>
        </div>

        <SimulationPlantView snapshot={snapshot} mode={mode} selectedEquipmentId="R-101" />

        <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-6">
          <MetricChip label="CRI Score" value={`${snapshot.riskScores.cri}/100`} />
          <MetricChip label="Predicted Incidents" value={levelLabel(snapshot.metrics.predictedIncidents)} />
          <MetricChip label="Risk Spread" value={levelLabel(snapshot.metrics.riskSpread)} />
          <MetricChip label="Affected Workers" value={`${snapshot.metrics.affectedWorkers}`} />
          <MetricChip label="Downtime Risk" value={`${snapshot.metrics.downtimeRiskHours.toFixed(1)} hrs`} />
          <MetricChip label="Potential Loss" value={`INR ${snapshot.metrics.potentialLossCrores.toFixed(1)} Cr`} />
        </div>

        {reactor ? (
          <div className="text-[9px] text-muted-foreground">R-101 Temperature: <span className="font-semibold text-foreground">{Math.round(reactor.temperature)} C</span></div>
        ) : null}
      </div>
    </Card>
  )
}

export function SimulationComparison({ before, after }: SimulationComparisonProps) {
  return (
    <div className="grid gap-2 xl:grid-cols-[1fr_56px_1fr]">
      <StateCard title="Before Simulation (Current State)" snapshot={before} mode="before" />

      <div className="hidden xl:flex items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-md border border-border/60 bg-background/35">
          <div className="h-8 w-px bg-border/70" />
          <div className="inline-flex size-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary shadow-[0_0_16px_rgba(59,130,246,0.3)]">
            <ArrowRightLeft className="size-4" />
          </div>
          <div className="h-8 w-px bg-border/70" />
          <span className="text-[8px] uppercase tracking-[0.14em] text-primary">Transition</span>
        </div>
      </div>

      <StateCard
        title="After Simulation (Predicted Outcome)"
        snapshot={after ?? before}
        mode="after"
      />
    </div>
  )
}

import { AlertOctagon, ChevronRight, Clock, Users } from 'lucide-react'

import { usePlantStore } from '@/store/usePlantStore'

export function PatternMatchingPanel() {
  const patternMatch = usePlantStore((s) => s.patternMatch)
  const { incident, similarity, matchedFactors } = patternMatch

  const openIncidentReplay = () => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module: 'Incident Replay' } }))
  }

  const outcomeColor =
    incident.outcome.toLowerCase().includes('explosion') || incident.outcome.toLowerCase().includes('fire')
      ? 'border-critical/40 bg-critical/10 text-critical'
      : incident.outcome.toLowerCase().includes('leak')
        ? 'border-warning/40 bg-warning/10 text-warning'
        : 'border-border bg-secondary/40 text-muted-foreground'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">Pattern Matching (AI Insights)</span>
        <button type="button" onClick={openIncidentReplay} className="text-[9px] text-muted-foreground hover:text-foreground">View All</button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="mb-2 grid grid-cols-[0.95fr_1.05fr] gap-2">
          <div className="flex flex-col items-center justify-center rounded-md border border-border/40 bg-background/30 p-2.5">
            <span className="text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground">Most Similar Past Incident</span>
            <span className="mt-1 text-[33px] font-bold leading-none text-success tabular-nums">{similarity}%</span>
            <span className="mt-1 text-[8px] uppercase tracking-[0.1em] text-muted-foreground">Similarity</span>
          </div>

          <div className="rounded-md border border-border/40 bg-background/30 p-2.5">
            <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground">Incident ID</div>
            <div className="text-[9px] font-semibold text-primary">{incident.id}</div>
            <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-muted-foreground">Incident Title</div>
            <div className="text-[9px] leading-tight text-foreground/90">{incident.title}</div>
            <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-muted-foreground">Description</div>
            <div className="text-[8px] text-muted-foreground">{incident.description.slice(0, 92)}...</div>
          </div>
        </div>

        {/* Key similar factors */}
        <div className="mb-2">
          <div className="mb-1 flex items-center gap-1">
            <AlertOctagon className="size-2.5 text-warning" />
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.1em] text-warning">Key Similar Factors</span>
          </div>
          <div className="space-y-1 rounded-md border border-border/35 bg-background/25 p-2">
            {matchedFactors.slice(0, 4).map((factor, i) => (
              <div key={i} className="flex items-center gap-1">
                <ChevronRight className="size-2.5 flex-shrink-0 text-primary/60" />
                <span className="text-[9px] text-muted-foreground">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outcome */}
        <div className="mb-2 text-[8px] uppercase tracking-[0.1em] text-muted-foreground">Outcome of Past Incident</div>
        <div className={`mb-2 rounded-md border px-2 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.1em] ${outcomeColor}`}>
          {incident.outcome}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="rounded-md border border-border/30 bg-background/30 p-1.5 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <Clock className="size-2.5 text-muted-foreground" />
              <span className="text-[8px] text-muted-foreground">Downtime</span>
            </div>
            <div className="mt-0.5 text-[10px] font-bold text-foreground">{incident.downtime}</div>
          </div>
          <div className="rounded-md border border-border/30 bg-background/30 p-1.5 text-center">
            <div className="text-[8px] text-muted-foreground">Total Loss</div>
            <div className="mt-0.5 text-[10px] font-bold text-critical">{incident.totalLoss}</div>
          </div>
          <div className="rounded-md border border-border/30 bg-background/30 p-1.5 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <Users className="size-2.5 text-muted-foreground" />
              <span className="text-[8px] text-muted-foreground">Injured</span>
            </div>
            <div className="mt-0.5 text-[10px] font-bold text-warning">{incident.injuries}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

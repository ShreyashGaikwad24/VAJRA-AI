import { ArrowRight, Clock } from 'lucide-react'

import type { RiskLevel } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'

function severityClasses(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'border-critical/40 bg-critical/15 text-critical'
    case 'high': return 'border-orange-500/40 bg-orange-500/15 text-orange-500'
    case 'medium': return 'border-yellow-400/40 bg-yellow-400/15 text-yellow-400'
    case 'low': return 'border-success/40 bg-success/15 text-success'
    default: return 'border-primary/40 bg-primary/15 text-primary'
  }
}

function priorityBadge(priority: number): string {
  if (priority === 1) return 'size-4 rounded-sm bg-critical text-[8px] font-bold text-white'
  if (priority === 2) return 'size-4 rounded-sm bg-orange-500 text-[8px] font-bold text-white'
  if (priority === 3) return 'size-4 rounded-sm bg-yellow-400 text-[8px] font-bold text-[#1a1a1a]'
  return 'size-4 rounded-sm bg-success text-[8px] font-bold text-white'
}

export function RecommendedActionsPanel() {
  const recommendations = usePlantStore((s) => s.recommendations)

  const openDecisionSimulation = () => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module: 'Decision Simulation' } }))
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">Recommended Actions (AI)</span>
        <button type="button" onClick={openDecisionSimulation} className="text-[9px] text-muted-foreground hover:text-foreground">View All</button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {recommendations.slice(0, 6).map((rec) => (
          <div
            key={rec.id}
            className="grid grid-cols-[22px_1fr_56px_38px] items-center gap-2 border-b border-border/20 px-3 py-2 transition-colors hover:bg-background/30"
          >
            <div className={`flex shrink-0 items-center justify-center ${priorityBadge(rec.priority)}`}>
              {rec.priority}
            </div>

            <div className="min-w-0">
              <div className="text-[9.5px] font-medium leading-tight text-foreground/90">{rec.title}</div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center rounded border px-1 py-0 text-[7.5px] font-semibold uppercase ${severityClasses(rec.severity)}`}>
                {rec.severity}
              </span>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center justify-end gap-0.5 text-[8.5px] text-muted-foreground">
                <Clock className="size-2.5" />
                {rec.executionTime}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/50 px-3 py-2">
        <button
          type="button"
          onClick={openDecisionSimulation}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 py-1.5 text-[9.5px] font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          Send to Decision Simulation
          <ArrowRight className="size-3" />
        </button>
      </div>
    </div>
  )
}

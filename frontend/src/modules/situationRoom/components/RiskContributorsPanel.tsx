import { AlertTriangle, ArrowUp, Minus, TriangleAlert, Wrench, Wind } from 'lucide-react'
import type { ReactNode } from 'react'

import type { RiskLevel, TrendDirection } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'

const ICON_MAP: Record<string, ReactNode> = {
  'temp-reactor': <AlertTriangle className="size-3 text-critical" />,
  'gas-leak': <Wind className="size-3 text-orange-400" />,
  'hot-work': <TriangleAlert className="size-3 text-critical" />,
  'permit-deviation': <TriangleAlert className="size-3 text-warning" />,
  vibration: <ArrowUp className="size-3 text-warning" />,
  fatigue: <TriangleAlert className="size-3 text-orange-400" />,
  maintenance: <Wrench className="size-3 text-success" />,
  weather: <Wind className="size-3 text-primary" />,
}

function riskHex(level: RiskLevel): string {
  switch (level) {
    case 'critical': return '#dc2626'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    case 'low': return '#22c55e'
    default: return '#3b82f6'
  }
}

function impactToLevel(impact: number): RiskLevel {
  if (impact >= 80) return 'critical'
  if (impact >= 60) return 'high'
  if (impact >= 40) return 'medium'
  if (impact >= 20) return 'low'
  return 'safe'
}

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === 'up') return <ArrowUp className="size-3 text-critical" />
  if (trend === 'down') return <ArrowUp className="size-3 rotate-180 text-success" />
  return <Minus className="size-3 text-muted-foreground" />
}

export function RiskContributorsPanel() {
  const contributors = usePlantStore((s) => s.riskContributors)

  const sorted = [...contributors].sort((a, b) => b.impact - a.impact)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">Risk Contributors</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_98px_32px_38px] items-center border-b border-border/40 px-3 py-1.5">
        <span className="text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground/70">Factor</span>
        <span className="text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground/70">Impact</span>
        <span className="text-center text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground/70">Trend</span>
        <span className="text-right text-[8.5px] uppercase tracking-[0.12em] text-muted-foreground/70">Value</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {sorted.map((contributor) => {
          const level = impactToLevel(contributor.impact)
          const color = riskHex(level)
          return (
            <div
              key={contributor.id}
              className="grid grid-cols-[1fr_98px_32px_38px] items-center border-b border-border/20 px-3 py-2 transition-colors hover:bg-background/30"
            >
              {/* Factor */}
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded border border-border/40 bg-background/35">
                  {ICON_MAP[contributor.id] ?? <TriangleAlert className="size-3 text-warning" />}
                </span>
                <span className="truncate text-[9.5px] text-foreground/90">{contributor.factor}</span>
              </div>

              {/* Impact bar */}
              <div className="flex items-center gap-1 pr-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/30">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${contributor.impact}%`, backgroundColor: color }}
                  />
                </div>
                <span className="w-6 text-right text-[8px] font-semibold tabular-nums" style={{ color }}>
                  {Math.round(contributor.impact)}
                </span>
              </div>

              {/* Trend */}
              <div className="flex items-center justify-center">
                <TrendIcon trend={contributor.trend} />
              </div>

              {/* Value */}
              <div className="text-right">
                <span className="text-[11px] font-bold tabular-nums" style={{ color }}>
                  {Math.round(contributor.value)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

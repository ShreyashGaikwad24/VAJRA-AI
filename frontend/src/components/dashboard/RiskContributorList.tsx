import { useEffect, useState } from 'react'

import { ArrowDownRight, ArrowUpRight, Minus, Flame, ShieldAlert, TriangleAlert, Gauge } from 'lucide-react'

import { Card } from '@/components/cards/Card'
import { riskContributors } from '@/constants/executiveDashboard'

const toneStyles = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  critical: 'text-critical',
} as const

const barStyles = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  critical: 'bg-critical',
} as const

const toneIcons = {
  success: Gauge,
  warning: TriangleAlert,
  danger: ShieldAlert,
  critical: Flame,
} as const

export function RiskContributorList() {
  const [liveContributors, setLiveContributors] = useState(riskContributors)
  const [updatedAt, setUpdatedAt] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveContributors((prev) =>
        prev.map((item) => {
          const jitter = Math.random() > 0.5 ? 1 : -1
          return { ...item, value: Math.min(99, Math.max(10, item.value + jitter)) }
        }),
      )
      setUpdatedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 4200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <Card title="Top Risk Contributors" subtitle="Live progress telemetry">
      <div className="space-y-2">
        {liveContributors.map((item) => (
          <div key={item.name} title={item.detail} className="group rounded-md border border-border/70 bg-background/55 p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-background/70">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`inline-flex size-6 items-center justify-center rounded-md border border-border/70 bg-background/60 ${toneStyles[item.tone]}`}>
                  {(() => {
                    const Icon = toneIcons[item.tone]
                    return <Icon className="size-3.5" />
                  })()}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] text-foreground">{item.name}</span>
                    <span className={`text-[9px] uppercase tracking-[0.12em] ${toneStyles[item.tone]}`}>{item.tone}</span>
                    <span className="rounded-md border border-border/70 bg-background/60 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">sev</span>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{item.detail}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2.5 text-right">
                <span className={`text-base font-semibold ${toneStyles[item.tone]}`}>{item.value}%</span>
                <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  {item.trend === 'up' ? <ArrowUpRight className="size-3 text-danger" /> : item.trend === 'down' ? <ArrowDownRight className="size-3 text-success" /> : <Minus className="size-3" />}
                  {item.trend === 'up' ? 'Rising' : item.trend === 'down' ? 'Falling' : 'Stable'}
                </div>
              </div>
            </div>
            <div className="mt-1.5 h-1.25 overflow-hidden rounded-full bg-background/60">
              <div className={`h-full rounded-full transition-all duration-700 ${barStyles[item.tone]} relative`} style={{ width: `${item.value}%` }}>
                <span className="absolute inset-y-0 left-[-35%] w-1/3 bg-linear-to-r from-transparent via-foreground/40 to-transparent animate-pipeline-flow" />
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-success animate-status-blink" />Live</span>
              <span>Updated {updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

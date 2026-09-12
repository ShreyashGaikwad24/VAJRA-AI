import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import { Activity, Bell, BrainCircuit, ChevronRight, Radio } from 'lucide-react'

import { Card } from '@/components/cards/Card'

type FeedEvent = {
  id: string
  icon: typeof Activity
  time: string
  equipment: string
  model: string
  event: string
  status: string
  confidence: string
}

const withId = (event: Omit<FeedEvent, 'id'>): FeedEvent => ({
  ...event,
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
})

const seedFeedItems: FeedEvent[] = [
  withId({ icon: Activity, time: '10:38', equipment: 'R-101', model: 'SAFE-RISK-v4', event: 'Thermal stream normalized after AI recalibration.', status: 'Active', confidence: '98%' }),
  withId({ icon: Bell, time: '10:37', equipment: 'PTW-3041', model: 'SAFE-Guard-v3', event: 'Permit lane heartbeat deviation detected and corrected.', status: 'Acknowledged', confidence: '94%' }),
  withId({ icon: BrainCircuit, time: '10:36', equipment: 'Process Area', model: 'SAFE-Forecast-v2', event: 'Risk forecast refreshed with latest telemetry batch.', status: 'Updated', confidence: '96%' }),
  withId({ icon: Radio, time: '10:35', equipment: 'Control Net', model: 'SAFE-Network-v1', event: 'Control room communications verified across all nodes.', status: 'Stable', confidence: '99%' }),
  withId({ icon: Bell, time: '10:34', equipment: 'WH-09', model: 'SAFE-Guard-v3', event: 'Worker route conflict prediction issued.', status: 'Queued', confidence: '91%' }),
  withId({ icon: Activity, time: '10:33', equipment: 'HX-04', model: 'SAFE-RISK-v4', event: 'Heat exchanger pressure trend stabilized.', status: 'Completed', confidence: '95%' }),
  withId({ icon: BrainCircuit, time: '10:32', equipment: 'Process Area', model: 'SAFE-Forecast-v2', event: 'Short-term risk cone updated with current telemetry.', status: 'Updated', confidence: '97%' }),
  withId({ icon: Radio, time: '10:31', equipment: 'Control Net', model: 'SAFE-Network-v1', event: 'Edge message latency returned to nominal.', status: 'Completed', confidence: '99%' }),
]

const rotatingEvents = [
  { icon: Activity, equipment: 'R-102', model: 'SAFE-RISK-v4', event: 'Combustion anomaly normalized', status: 'Completed', confidence: '97%' },
  { icon: Bell, equipment: 'ST-12', model: 'SAFE-Guard-v3', event: 'Gas threshold warning queued', status: 'Queued', confidence: '93%' },
  { icon: BrainCircuit, equipment: 'Process Area', model: 'SAFE-Forecast-v2', event: 'Forecast interval recalculated', status: 'Updated', confidence: '96%' },
  { icon: Radio, equipment: 'Control Net', model: 'SAFE-Network-v1', event: 'Network heartbeat synchronized', status: 'Completed', confidence: '99%' },
]

export function DashboardFeedPanel() {
  const [feedItems, setFeedItems] = useState(seedFeedItems)

  useEffect(() => {
    const interval = window.setInterval(() => {
      const candidate = rotatingEvents[Math.floor(Math.random() * rotatingEvents.length)]
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setFeedItems((prev) => [withId({ ...candidate, time: timestamp }), ...prev].slice(0, 10))
    }, 3800)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col">
        <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-border/70 pb-1.5">
          <div>
            <h3 className="text-[16px] font-semibold tracking-tight text-foreground">AI Feed</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Live AI Event Stream</p>
          </div>
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background/55 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground">
            View All
            <ChevronRight className="size-3" />
          </button>
        </div>

        <div className="h-68 overflow-hidden rounded-lg border border-border/70 bg-background/45">
          <div className="h-full overflow-y-auto px-2.5 py-0.5">
            {feedItems.map((item, index) => {
              const Icon = item.icon
              const statusTone = item.status === 'Completed' || item.status === 'Stable' ? 'border-success/30 bg-success/10 text-success' : item.status === 'Queued' ? 'border-warning/30 bg-warning/10 text-warning' : 'border-primary/30 bg-primary/10 text-primary'
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut', delay: index * 0.02 }}
                  className="group relative border-b border-border/70 py-1 last:border-b-0"
                >
                  <span className="pointer-events-none absolute left-2 top-0 h-full w-px bg-border/70" />
                  <span className="pointer-events-none absolute left-[5px] top-3.5 size-1.5 rounded-full bg-primary animate-status-blink" />

                  <div className="ml-5.5 flex items-start gap-2 rounded-md px-1 py-0.5 transition-colors group-hover:bg-background/60">
                    <span className="inline-flex size-4.5 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="size-2.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="grid gap-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-3">
                        <span>{item.time}</span>
                        <span className="truncate">{item.model}</span>
                        <span className="truncate">{item.equipment}</span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] text-foreground">{item.event}</p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <span className={`rounded-md border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] ${statusTone}`}>{item.status}</span>
                      <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{item.confidence}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

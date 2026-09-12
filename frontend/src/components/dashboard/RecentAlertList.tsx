import { useState, type KeyboardEvent } from 'react'

import { AlertOctagon, AlertTriangle, Bell, ChevronRight } from 'lucide-react'

import { Card } from '@/components/cards/Card'
import { recentAlerts } from '@/constants/executiveDashboard'

function getSeverityIcon(severity: string) {
  if (severity === 'critical' || severity === 'danger') {
    return { Icon: AlertOctagon, tone: 'text-critical', dot: 'bg-critical' }
  }

  if (severity === 'warning') {
    return { Icon: AlertTriangle, tone: 'text-warning', dot: 'bg-warning' }
  }

  return { Icon: Bell, tone: 'text-primary', dot: 'bg-primary' }
}

function formatTime(time: string) {
  if (/AM|PM/i.test(time)) {
    return time
  }

  return `${time} AM`
}

export function RecentAlertList() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const executiveAlerts = recentAlerts.slice(0, 8)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((prev) => Math.min(executiveAlerts.length - 1, prev + 1))
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((prev) => Math.max(0, prev - 1))
    }
  }

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col">
        <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-border/70 pb-1.5">
          <div>
            <h3 className="text-[16px] font-semibold tracking-tight text-foreground">Recent Alerts</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Plant Safety Monitoring</p>
          </div>
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background/55 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground">
            View All
            <ChevronRight className="size-3" />
          </button>
        </div>

        <div className="h-68 overflow-hidden rounded-lg border border-border/70 bg-background/45" tabIndex={0} onKeyDown={onKeyDown}>
          <div className="h-full overflow-y-auto">
            {executiveAlerts.map((alert, index) => {
              const { Icon, tone, dot } = getSeverityIcon(alert.severity)
              const isActive = selectedIndex === index
              return (
                <button
                  key={alert.time + alert.equipment + alert.title}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full border-b border-border/70 px-2.5 py-1 text-left transition-colors last:border-b-0 ${isActive ? 'bg-primary/10' : 'hover:bg-background/70'}`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={`mt-0.5 size-3.5 shrink-0 ${tone}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-foreground">{alert.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{alert.equipment} • {alert.zone}</p>
                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{formatTime(alert.time)}</p>
                    </div>
                    <span className={`mt-1 size-1.5 shrink-0 rounded-full ${dot}`} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

import { ShieldAlert } from 'lucide-react'

import { ActionButton } from '@/components/common/ActionButton'
import { Card } from '@/components/cards/Card'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { StatusBadge } from '@/components/common/StatusBadge'

type AlertCardProps = {
  time: string
  title: string
  detail: string
  category: string
  source: string
  zone: string
  priority: string
  status: string
  severity: 'info' | 'warning' | 'danger' | 'critical'
}

export function AlertCard({ time, title, detail, category, source, zone, priority, status, severity }: AlertCardProps) {
  return (
    <Card className="bg-card/85">
      <div className="grid gap-3 lg:grid-cols-[1.35fr,1fr,auto] lg:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-8 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive">
            <ShieldAlert className="size-4" />
          </span>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <StatusBadge label={priority} variant={severity === 'critical' || severity === 'danger' ? 'stable' : 'active'} />
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">{detail}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              <span>{time}</span>
              <span>• {category}</span>
              <span>• {source}</span>
              <span>• {zone}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-center">
          <SeverityBadge severity={severity} />
          <StatusBadge label={status} variant={severity === 'critical' ? 'offline' : 'stable'} />
        </div>

        <div className="flex justify-end">
          <ActionButton className="h-8 px-3 text-[11px]">View</ActionButton>
        </div>
      </div>
    </Card>
  )
}

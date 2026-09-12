import { ChevronDown, Clock3, Factory, Layers3, RotateCcw, ShieldAlert } from 'lucide-react'

import { ActionButton } from '@/components/common/ActionButton'
import { SearchBox } from '@/components/common/SearchBox'
import { Panel } from '@/components/cards/Panel'
import { StatusBadge } from '@/components/common/StatusBadge'
import { weatherStatus } from '@/constants/executiveDashboard'

export function DashboardHeader() {
  const now = new Date()
  const lastUpdate = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <Panel className="relative overflow-hidden px-3.5 py-3 md:px-4">
      <div className="absolute -right-6 -top-8 size-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative grid gap-2.5 xl:grid-cols-[1.35fr,1fr] xl:items-end">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
              <Factory className="size-3.5 text-primary" />
              Jamnagar Refinery
            </span>
            <StatusBadge label="Current Shift: A" variant="stable" />
            <StatusBadge label="Plant Status: Operational" variant="active" />
            <StatusBadge label={`Last Updated ${lastUpdate}`} variant="active" />
          </div>
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Executive Dashboard</h1>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Real-time overview of plant safety, exposure, and operational risk intelligence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge label={`Weather: ${weatherStatus.condition}`} variant="stable" />
            <StatusBadge label={`Humidity ${weatherStatus.humidity}`} variant="active" />
            <StatusBadge label={`Wind ${weatherStatus.wind}`} variant="active" />
            <StatusBadge label={`Time ${timeLabel}`} variant="active" />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="grid gap-1.5 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex h-8.5 items-center justify-between rounded-md border border-border/80 bg-background/55 px-2.5 text-xs text-foreground transition-all hover:border-primary/40 hover:bg-background/70"
            >
              <span className="inline-flex items-center gap-1.5">
                <Layers3 className="size-3.5 text-primary" />
                Plant Selector
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            <SearchBox placeholder="Search dashboard modules" />
          </div>
          <div className="grid gap-1.5 sm:grid-cols-3">
            <ActionButton isActive>
              <RotateCcw className="size-3.5" />
              Refresh
            </ActionButton>
            <ActionButton>
              <Clock3 className="size-3.5" />
              Export
            </ActionButton>
            <ActionButton className="border-danger/30 text-danger hover:text-danger">
              <ShieldAlert className="size-3.5" />
              Emergency
            </ActionButton>
          </div>
        </div>
      </div>
    </Panel>
  )
}

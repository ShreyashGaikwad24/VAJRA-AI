import { Bell, CalendarDays, CloudSun, Cog, Wind } from 'lucide-react'

import { StatusBadge } from '@/components/common/StatusBadge'

export function DigitalTwinHeader() {
  const now = new Date()
  const dateLabel = now.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })
  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <header className="rounded-lg border border-border/80 bg-card/80 px-3 py-2.5 shadow-[0_8px_26px_rgba(0,0,0,0.33)] backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">Digital Twin Command Workspace</h1>
          <p className="text-[11px] text-muted-foreground">Operational shell for 3D refinery orchestration and spatial intelligence</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge label="Plant: Jamnagar" variant="stable" />
          <StatusBadge label="System: Online" variant="active" />
          <span className="inline-flex h-7 items-center gap-1 rounded-md border border-border/80 bg-background/65 px-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <CloudSun className="size-3" />
            28 C Clear
          </span>
          <span className="inline-flex h-7 items-center gap-1 rounded-md border border-border/80 bg-background/65 px-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <Wind className="size-3" />
            11 km/h
          </span>
          <span className="inline-flex h-7 items-center gap-1 rounded-md border border-border/80 bg-background/65 px-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <CalendarDays className="size-3" />
            {dateLabel}
          </span>
          <span className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/65 px-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {timeLabel}
          </span>
          <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/65 text-muted-foreground transition-colors hover:text-foreground">
            <Bell className="size-3.5" />
          </button>
          <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/65 text-muted-foreground transition-colors hover:text-foreground">
            <Cog className="size-3.5" />
          </button>
          <button type="button" className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background/65 px-2 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary/40">
            <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary/20 text-primary">O</span>
            Operator
          </button>
        </div>
      </div>
    </header>
  )
}

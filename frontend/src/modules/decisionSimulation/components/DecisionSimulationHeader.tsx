import { Bell, HelpCircle, Search, Settings, Shield } from 'lucide-react'

import { StatusBadge } from '@/components/common/StatusBadge'

type DecisionSimulationHeaderProps = {
  plantName: string
}

export function DecisionSimulationHeader({ plantName }: DecisionSimulationHeaderProps) {
  const now = new Date()
  const dateLabel = now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <header className="rounded-lg border border-border/80 bg-card/90 px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border/35 pb-1.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
              <Shield className="size-4 text-primary" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">S.A.F.E AI</div>
              <div className="text-[7px] uppercase tracking-[0.14em] text-muted-foreground">SMART AI FOR FACTORY SAFETY &amp; EMERGENCY</div>
            </div>
          </div>

          <h1 className="mt-1 text-sm font-bold uppercase tracking-[0.09em] text-foreground">
            Decision Simulation - What If Analysis
          </h1>
          <p className="text-[9px] text-muted-foreground">Simulate Actions, Predict Outcomes, Reduce Risk</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/60 px-2 text-[10px] text-foreground">
            Plant: {plantName}
          </button>
          <span className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/60 px-2 text-[10px] text-muted-foreground">
            {dateLabel} {timeLabel}
          </span>
          <StatusBadge label="Operational" variant="stable" />
          <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground">
            <Search className="size-3.5" />
          </button>
          <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground">
            <Bell className="size-3.5" />
          </button>
          <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground">
            <HelpCircle className="size-3.5" />
          </button>
          <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground">
            <Settings className="size-3.5" />
          </button>
          <span className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/60 px-2 text-[10px] font-medium text-foreground">Safety Head</span>
          <span className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/60 px-2 text-[10px] font-medium text-foreground">Administrator</span>
          <span className="inline-flex h-7 items-center rounded-md border border-primary/35 bg-primary/10 px-2 text-[10px] font-medium text-primary">SH</span>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-muted-foreground">
        <span className="uppercase tracking-[0.14em] text-cyan-400/90">Decision Simulation Workspace</span>
        <span className="rounded border border-border/60 bg-background/45 px-1.5 py-0.5 uppercase tracking-[0.12em]">Simulation Mode Active</span>
      </div>
    </header>
  )
}

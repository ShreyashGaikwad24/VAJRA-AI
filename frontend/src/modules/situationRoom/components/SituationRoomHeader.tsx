import { Bell, HelpCircle, Search, Settings, Shield } from 'lucide-react'

import { usePlantStore } from '@/store/usePlantStore'

export function SituationRoomHeader() {
  const plantName = usePlantStore((s) => s.plantName)
  const riskScores = usePlantStore((s) => s.riskScores)
  const overview = usePlantStore((s) => s.overview)

  const now = new Date()
  const dateLabel = now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const navigateTo = (module: string) => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module } }))
  }

  const focusGlobalSearch = () => {
    const input = document.querySelector('input[placeholder="Search modules, assets, events..."]') as HTMLInputElement | null
    input?.focus()
  }

  return (
    <header className="flex min-h-0 flex-col gap-1.5 rounded-lg border border-border/80 bg-card/85 px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="flex size-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
              <Shield className="size-4 text-primary" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">S.A.F.E AI</div>
              <div className="text-[7px] uppercase tracking-[0.14em] text-muted-foreground">Smart AI for Factory Safety</div>
            </div>
          </div>

          <div className="h-6 w-px bg-border/60" />

          <div>
            <h1 className="text-sm font-bold uppercase tracking-[0.08em] text-foreground">
              AI Situation Room — Risk Explorer
            </h1>
            <p className="text-[9px] text-muted-foreground">AI-Powered Risk Analysis, Explanation &amp; Recommendation</p>
          </div>
        </div>

        {/* Right: Plant selector, time, status, actions */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <div className="flex h-7 items-center gap-1 rounded-md border border-border/80 bg-background/60 px-2 text-[10px] text-foreground">
            <span className="text-muted-foreground">Plant:</span>
            <span className="font-medium">{plantName}</span>
          </div>

          <div className="flex h-7 items-center gap-1 rounded-md border border-border/80 bg-background/60 px-2 text-[10px] text-muted-foreground">
            {dateLabel}&nbsp;{timeLabel}
          </div>

          <div className="flex h-7 items-center gap-1 rounded-md border border-success/40 bg-success/10 px-2 text-[10px] font-semibold text-success">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" />
            OPERATIONAL
          </div>

          <div className="flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background/60 px-2 text-[10px] text-muted-foreground">
            <span>CRI</span>
            <span className="font-bold text-critical">{riskScores.cri}</span>
          </div>

          <button type="button" title="Search" onClick={focusGlobalSearch} className="flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground transition-colors hover:text-foreground">
            <Search className="size-3.5" />
          </button>
          <button type="button" title="Alerts and notifications" onClick={() => navigateTo('Alerts & Notifications')} className="flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground transition-colors hover:text-foreground">
            <Bell className="size-3.5" />
          </button>
          <button type="button" title="AI Copilot" onClick={() => navigateTo('AI Copilot')} className="flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground transition-colors hover:text-foreground">
            <HelpCircle className="size-3.5" />
          </button>
          <button type="button" title="System settings" onClick={() => navigateTo('System Settings')} className="flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground transition-colors hover:text-foreground">
            <Settings className="size-3.5" />
          </button>

          <button
            type="button"
            title="User management"
            onClick={() => navigateTo('User Management')}
            className="flex h-7 items-center gap-1.5 rounded-md border border-border/80 bg-background/60 px-2 text-[10px] font-medium text-foreground transition-colors hover:border-primary/40"
          >
            <span className="flex size-4 items-center justify-center rounded-sm bg-primary/20 text-[8px] font-bold text-primary">SH</span>
            Safety Head
          </button>
        </div>
      </div>

      {/* Plant overview stats bar */}
      <div className="flex items-center gap-3 border-t border-border/30 pt-1.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Plant Overview:</span>
        {[
          { label: 'Total Assets', value: overview.totalAssets.toLocaleString() },
          { label: 'Active Sensors', value: overview.activeSensors },
          { label: 'Active Permits', value: overview.activePermits },
          { label: 'On-Site Workers', value: overview.onSiteWorkers },
          { label: 'Open Incidents', value: overview.openIncidents },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-1">
            <span className="text-[9px] text-muted-foreground">{label}:</span>
            <span className="text-[9px] font-bold text-foreground">{value}</span>
          </div>
        ))}
        <span className="ml-auto rounded border border-warning/40 bg-warning/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-warning">
          ⚠ SIMULATION / DEMO MODE
        </span>
      </div>
    </header>
  )
}

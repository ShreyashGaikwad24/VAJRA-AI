import { Expand, Layers3, Radar, ScanSearch, Shield } from 'lucide-react'

import { cn } from '@/utils/cn'

const modes = [
  { label: 'Plant View', icon: Layers3 },
  { label: 'Zone View', icon: ScanSearch },
  { label: 'Sensor View', icon: Radar },
  { label: 'Heat Map', icon: Shield },
  { label: 'Risk View', icon: Shield },
]

export function DigitalTwinToolbar() {
  return (
    <div className="absolute left-2 right-2 top-2 z-20 flex flex-wrap items-center justify-between gap-1.5 rounded-md border border-border/80 bg-background/65 px-2 py-1.5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-1">
        {modes.map((mode, index) => {
          const Icon = mode.icon
          const active = index === 0

          return (
            <button
              key={mode.label}
              type="button"
              className={cn(
                'inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[10px] font-medium uppercase tracking-[0.12em] transition-all',
                active
                  ? 'border-primary/70 bg-primary/15 text-primary'
                  : 'border-border/80 bg-background/70 text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-3" />
              {mode.label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className="inline-flex h-7 items-center gap-1 rounded-md border border-border/80 bg-background/70 px-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Expand className="size-3" />
        Fullscreen
      </button>
    </div>
  )
}

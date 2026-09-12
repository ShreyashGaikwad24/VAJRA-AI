import { Focus, Layers3, Radar } from 'lucide-react'

import { cn } from '@/utils/cn'

type ViewMode = 'Plant View' | 'Zone View' | 'Sensor View' | 'Heat Map' | 'Risk View'

type ViewModeSelectorProps = {
  className?: string
  value: ViewMode
  onChange: (value: ViewMode) => void
}

const modes: Array<{ label: ViewMode; icon: typeof Layers3 }> = [
  { label: 'Plant View', icon: Layers3 },
  { label: 'Zone View', icon: Focus },
  { label: 'Sensor View', icon: Radar },
]

export function ViewModeSelector({ className, value, onChange }: ViewModeSelectorProps) {

  return (
    <div className={cn(className)}>
      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">View Mode</p>
      <div className="grid grid-cols-3 gap-1">
        {modes.map(({ label, icon: Icon }) => {
          const isActive = label === value

          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(label)}
              className={cn(
                'inline-flex h-8 items-center justify-center gap-1 rounded-md border text-[10px] font-medium uppercase tracking-[0.12em] transition-all',
                isActive
                  ? 'border-primary/70 bg-primary/15 text-primary'
                  : 'border-border/80 bg-background/65 text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-3" />
              {label.replace(' View', '')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

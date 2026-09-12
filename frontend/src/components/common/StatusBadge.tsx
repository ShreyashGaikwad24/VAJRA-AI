import { cn } from '@/utils/cn'

type StatusVariant = 'stable' | 'active' | 'offline'

type StatusBadgeProps = {
  label: string
  variant?: StatusVariant
}

const statusStyles: Record<StatusVariant, string> = {
  stable: 'border-success/40 bg-success/10 text-success',
  active: 'border-primary/40 bg-primary/10 text-primary',
  offline: 'border-border bg-secondary/60 text-muted-foreground',
}

export function StatusBadge({ label, variant = 'active' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium tracking-[0.12em] uppercase',
        statusStyles[variant],
      )}
    >
      {label}
    </span>
  )
}

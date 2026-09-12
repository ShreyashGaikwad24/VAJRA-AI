import { cn } from '@/utils/cn'

type PriorityLevel = 1 | 2 | 3 | 4

type PriorityBadgeProps = {
  level: PriorityLevel
}

const priorityStyles: Record<PriorityLevel, string> = {
  1: 'border-critical/40 bg-critical/10 text-critical',
  2: 'border-danger/40 bg-danger/10 text-danger',
  3: 'border-warning/40 bg-warning/10 text-warning',
  4: 'border-success/40 bg-success/10 text-success',
}

export function PriorityBadge({ level }: PriorityBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide', priorityStyles[level])}>
      Priority {level}
    </span>
  )
}

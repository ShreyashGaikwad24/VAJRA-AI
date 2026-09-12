import { cn } from '@/utils/cn'

type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

type RiskBadgeProps = {
  level: RiskLevel
}

const riskStyles: Record<RiskLevel, string> = {
  low: 'border-success/40 bg-success/10 text-success',
  medium: 'border-warning/40 bg-warning/10 text-warning',
  high: 'border-danger/40 bg-danger/10 text-danger',
  critical: 'border-critical/40 bg-critical/10 text-critical',
}

export function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]',
        riskStyles[level],
      )}
    >
      {level}
    </span>
  )
}

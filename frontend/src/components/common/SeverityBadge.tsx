import { AlertTriangle } from 'lucide-react'

import { cn } from '@/utils/cn'

type Severity = 'info' | 'warning' | 'danger' | 'critical'

type SeverityBadgeProps = {
  severity: Severity
}

const severityStyles: Record<Severity, string> = {
  info: 'border-primary/40 bg-primary/10 text-primary',
  warning: 'border-warning/40 bg-warning/10 text-warning',
  danger: 'border-danger/40 bg-danger/10 text-danger',
  critical: 'border-critical/40 bg-critical/10 text-critical',
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium uppercase tracking-wide',
        severityStyles[severity],
      )}
    >
      <AlertTriangle className="size-3" />
      {severity}
    </span>
  )
}

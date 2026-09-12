import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

type SectionTitleProps = {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function SectionTitle({ title, subtitle, action, className }: SectionTitleProps) {
  return (
    <div className={cn('flex items-start justify-between gap-2', className)}>
      <div>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-foreground">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

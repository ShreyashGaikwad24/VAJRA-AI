import type { ReactNode } from 'react'

import { Panel } from '@/components/cards/Panel'
import { cn } from '@/utils/cn'

type CardProps = {
  title?: string
  subtitle?: string
  children?: ReactNode
  className?: string
}

export function Card({ title, subtitle, children, className }: CardProps) {
  return (
    <Panel className={cn('p-3 md:p-3.5', className)}>
      {title ? <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-foreground">{title}</h3> : null}
      {subtitle ? <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{subtitle}</p> : null}
      {children ? <div className="mt-2.5">{children}</div> : null}
    </Panel>
  )
}

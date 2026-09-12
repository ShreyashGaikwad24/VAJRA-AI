import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

type PanelProps = {
  children: ReactNode
  className?: string
}

export function Panel({ children, className }: PanelProps) {
  return (
    <section
      className={cn(
        'group rounded-lg border border-border/80 bg-card/80 shadow-[0_7px_24px_rgba(0,0,0,0.34)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_14px_34px_rgba(0,0,0,0.42)]',
        className,
      )}
    >
      {children}
    </section>
  )
}

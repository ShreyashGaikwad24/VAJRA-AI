import type { ReactNode } from 'react'

import { Panel } from '@/components/cards/Panel'
import { cn } from '@/utils/cn'

type FilterBarProps = {
  children?: ReactNode
  className?: string
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <Panel className={cn('flex items-center gap-2 p-2', className)}>
      {children}
    </Panel>
  )
}

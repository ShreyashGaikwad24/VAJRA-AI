import * as React from 'react'

import { cn } from '@/utils/cn'

type ScrollAreaProps = React.ComponentProps<'div'>

export function ScrollArea({ className, ...props }: ScrollAreaProps) {
  return (
    <div
      data-slot="scroll-area"
      className={cn('overflow-auto', className)}
      {...props}
    />
  )
}

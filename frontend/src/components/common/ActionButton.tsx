import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type ActionButtonProps = ComponentProps<'button'> & {
  isActive?: boolean
}

export function ActionButton({ className, isActive = false, ...props }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-8 rounded-md border border-border/80 bg-card/60 px-2.5 text-[11px] text-muted-foreground transition-all hover:bg-card hover:text-foreground',
        isActive && 'border-primary/70 bg-primary/10 text-primary',
        className,
      )}
      {...props}
    />
  )
}

import { motion } from 'framer-motion'

import { cn } from '@/utils/cn'

type TimelineProps = {
  timestamps: string[]
  className?: string
}

export function Timeline({ timestamps, className }: TimelineProps) {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.08 }}
      className={cn(
        'h-22 resize-y overflow-auto border-t border-border/80 bg-card/75 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex h-full min-w-max items-center gap-1.5">
        {timestamps.map((time, index) => (
          <div key={time + index} className="flex items-center gap-1.5">
            <div className="inline-flex min-w-16 justify-center rounded-md border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground">
              {time}
            </div>
            {index < timestamps.length - 1 ? <div className="h-px w-8 bg-border/80" /> : null}
          </div>
        ))}
      </div>
    </motion.footer>
  )
}

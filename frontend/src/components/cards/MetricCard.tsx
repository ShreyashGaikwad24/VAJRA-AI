import { useEffect, useMemo, useRef, useState } from 'react'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/cards/Card'
import { MiniSparkline } from '@/components/common/MiniSparkline'
import { StatusBadge } from '@/components/common/StatusBadge'
import { cn } from '@/utils/cn'

type MetricCardProps = {
  label: string
  value: string
  delta?: string
  description?: string
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'critical'
  icon?: LucideIcon
  chip?: string
  sparkline?: number[]
  trend?: 'up' | 'down' | 'flat'
  updatedAt?: string
  liveState?: string
  index?: number
  rawValue?: string
}

const toneStyles: Record<NonNullable<MetricCardProps['tone']>, string> = {
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  critical: 'text-critical',
}

const chipStyles: Record<NonNullable<MetricCardProps['tone']>, string> = {
  default: 'border-primary/30 bg-primary/10 text-primary',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  critical: 'border-critical/30 bg-critical/10 text-critical',
}

const trendStyles: Record<NonNullable<MetricCardProps['trend']>, string> = {
  up: 'text-danger',
  down: 'text-success',
  flat: 'text-muted-foreground',
}

export function MetricCard({
  label,
  value,
  delta,
  description,
  tone = 'default',
  icon: Icon,
  chip,
  sparkline = [12, 18, 15, 22, 20, 28, 24, 30],
  trend = 'flat',
  updatedAt,
  liveState,
  index = 0,
  rawValue,
}: MetricCardProps) {
  const parsed = useMemo(() => {
    const displayValue = rawValue ?? value
    const match = displayValue.match(/(\d+(?:\.\d+)?)/)
    const numeric = match ? Number(match[1]) : 0
    const prefix = match ? displayValue.slice(0, match.index) : ''
    const suffix = match ? displayValue.slice((match.index ?? 0) + match[0].length) : displayValue
    return { numeric, prefix, suffix, displayValue }
  }, [rawValue, value])

  const [displayValue, setDisplayValue] = useState(parsed.numeric)
  const previousValueRef = useRef(parsed.numeric)

  useEffect(() => {
    const start = previousValueRef.current
    const end = parsed.numeric
    const duration = 220
    const frameMs = 16
    let elapsed = 0

    const timer = window.setInterval(() => {
      elapsed += frameMs
      const progress = Math.min(1, elapsed / duration)
      setDisplayValue(Math.round(start + (end - start) * progress))
      if (progress >= 1) {
        previousValueRef.current = end
        window.clearInterval(timer)
      }
    }, frameMs)

    return () => window.clearInterval(timer)
  }, [parsed.numeric])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: index * 0.03 }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <Card className="relative overflow-hidden border-border/90 bg-card/85">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_40%)] opacity-100" />
        <div className="relative flex h-full flex-col gap-1.5">
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex items-start gap-2">
              {Icon ? (
                <span className={cn('inline-flex size-6.5 items-center justify-center rounded-md border', chipStyles[tone])}>
                  <Icon className="size-3.5" />
                </span>
              ) : null}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
                <div className="mt-1 flex items-end gap-1.5">
                  <p className={cn('text-[24px] font-bold leading-none tracking-tight', toneStyles[tone])}>{rawValue ?? `${parsed.prefix}${displayValue}${parsed.suffix}`}</p>
                  <span className={cn('mb-0.5 inline-flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.12em]', trendStyles[trend])}>
                    <span className={cn('size-1.5 rounded-full', trend === 'down' ? 'bg-success' : trend === 'up' ? 'bg-danger' : 'bg-muted-foreground')} />
                    {delta}
                  </span>
                </div>
              </div>
            </div>
            {chip ? (
              <StatusBadge label={chip} variant={tone === 'success' ? 'stable' : tone === 'warning' ? 'active' : 'offline'} />
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <MiniSparkline
                values={sparkline}
                className={cn(
                  tone === 'critical' ? 'text-critical' : tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : 'text-primary',
                )}
              />
            </div>
            <span className="rounded-md border border-border/70 bg-background/55 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {trend === 'down' ? 'Trending down' : trend === 'up' ? 'Trending up' : 'Stable'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-success animate-status-blink" />
              {liveState ?? 'Live'}
            </span>
            <span className="rounded-md border border-border/70 bg-background/55 px-1.5 py-0.5">Updated {updatedAt ?? 'Now'}</span>
          </div>

          {description ? <p className="text-[11px] leading-4 text-muted-foreground">{description}</p> : null}
        </div>
      </Card>
    </motion.div>
  )
}

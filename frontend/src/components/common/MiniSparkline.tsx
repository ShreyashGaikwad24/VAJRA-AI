import { useId } from 'react'

import { cn } from '@/utils/cn'

type MiniSparklineProps = {
  values: number[]
  className?: string
}

export function MiniSparkline({ values, className }: MiniSparklineProps) {
  const gradientId = useId()
  const width = 96
  const height = 28
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(max - min, 1)
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('h-7 w-full', className)} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polyline
        points={`${points} ${width},${height} 0,${height}`}
        fill={`url(#${gradientId})`}
        className="text-primary/20"
      />
      <polyline points={points} fill="none" className="stroke-current text-primary" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

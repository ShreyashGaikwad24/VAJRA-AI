import { useEffect, useMemo, useState } from 'react'

import { MetricCard } from '@/components/cards/MetricCard'
import type { DashboardKpi } from '@/constants/executiveDashboard'
import { Gauge, ShieldAlert, Radar, Users, FileCheck2, TriangleAlert, HeartPulse } from 'lucide-react'

type KPIGridProps = {
  items: DashboardKpi[]
}

const kpiIcons = {
  'Critical Risk Index': Gauge,
  'Predictive Risk Index': TriangleAlert,
  'Exposure Risk Index': Radar,
  'Overall Plant Health': HeartPulse,
  'Active Workers': Users,
  'Active Permits': FileCheck2,
  'Open Incidents': ShieldAlert,
} as const

const kpiChips = {
  'Critical Risk Index': 'Critical',
  'Predictive Risk Index': 'Forecast',
  'Exposure Risk Index': 'Exposure',
  'Overall Plant Health': 'Health',
  'Active Workers': 'Workforce',
  'Active Permits': 'Permits',
  'Open Incidents': 'Incidents',
} as const

const trendByTone = {
  default: 'flat',
  success: 'down',
  warning: 'up',
  danger: 'up',
  critical: 'up',
} as const

export function KPIGrid({ items }: KPIGridProps) {
  const [liveItems, setLiveItems] = useState(items)
  const [updatedAt, setUpdatedAt] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

  useEffect(() => {
    setLiveItems(items)
  }, [items])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveItems((prev) =>
        prev.map((item) => {
          const match = item.value.match(/(\d+(?:\.\d+)?)/)
          if (!match) {
            return item
          }

          const value = Number(match[1])
          const jitter = Math.random() > 0.5 ? 1 : -1
          const nextValue = Math.max(0, value + jitter)
          const hasPercent = item.value.includes('%')

          return {
            ...item,
            value: hasPercent ? `${nextValue}%` : `${nextValue}`,
            sparkline: [...item.sparkline.slice(1), Math.max(0, item.sparkline[item.sparkline.length - 1] + jitter)],
          }
        }),
      )

      setUpdatedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 3500)

    return () => window.clearInterval(interval)
  }, [])

  const liveDot = useMemo(() => (updatedAt ? 'Live' : 'Sync'), [updatedAt])

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
      {liveItems.map((item, index) => (
        <MetricCard
          key={item.label}
          label={item.label}
          value={item.value}
          delta={item.delta}
          description={item.description}
          tone={item.tone}
          sparkline={item.sparkline}
          icon={kpiIcons[item.label as keyof typeof kpiIcons]}
          chip={kpiChips[item.label as keyof typeof kpiChips]}
          trend={trendByTone[item.tone ?? 'default']}
          updatedAt={updatedAt}
          liveState={liveDot}
          index={index}
        />
      ))}
    </div>
  )
}

import { CloudSun, Droplets, Wind } from 'lucide-react'

import { Card } from '@/components/cards/Card'
import { weatherStatus } from '@/constants/executiveDashboard'

export function WeatherStatusCard() {
  return (
    <Card title="Weather" subtitle="Current site conditions" className="min-h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border/70 bg-primary/10 text-primary">
            <CloudSun className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{weatherStatus.condition}</p>
            <p className="text-xs text-muted-foreground">Temperature {weatherStatus.temperature}</p>
          </div>
        </div>
        <div className="space-y-1 text-right text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <Droplets className="size-3.5 text-primary" />
            <span>{weatherStatus.humidity}</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Wind className="size-3.5 text-primary" />
            <span>{weatherStatus.wind}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

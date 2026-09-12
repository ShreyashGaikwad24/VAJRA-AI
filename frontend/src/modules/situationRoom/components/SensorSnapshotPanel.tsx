import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

import type { RiskLevel, TrendDirection } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'

function riskHex(level: RiskLevel): string {
  switch (level) {
    case 'critical': return '#dc2626'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    case 'low': return '#22c55e'
    default: return '#3b82f6'
  }
}

function MiniSparkline({ history, color }: { history: number[]; color: string }) {
  if (history.length < 2) return null
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1
  const w = 80
  const h = 24
  const points = history
    .map((v, i) => {
      const x = (i / (history.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === 'up') return <TrendingUp className="size-3 text-critical" />
  if (trend === 'down') return <TrendingDown className="size-3 text-success" />
  return <Minus className="size-3 text-muted-foreground" />
}

const SENSOR_ICONS: Record<string, string> = {
  Temperature: '🌡',
  Pressure: '⊙',
  'Gas Leak': '💨',
  Vibration: '〜',
  Humidity: '💧',
  'Wind Speed': '🌬',
}

export function SensorSnapshotPanel() {
  const sensorSnapshot = usePlantStore((s) => s.sensorSnapshot)

  const openDigitalTwin = () => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module: 'Digital Twin' } }))
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">Real-Time Sensor Snapshot</span>
        <button type="button" onClick={openDigitalTwin} className="text-[9px] text-muted-foreground hover:text-foreground">View All</button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden p-2.5">
        <div className="grid h-full grid-cols-3 gap-1.5 xl:grid-cols-6">
          {sensorSnapshot.map((sensor) => {
            const color = riskHex(sensor.status)
            const icon = SENSOR_ICONS[sensor.label] ?? '⚡'
            const sourceLabel =
              sensor.label === 'Temperature' ? 'R-101' :
              sensor.label === 'Pressure' ? 'R-101' :
              sensor.label === 'Gas Leak' ? 'Line 27A' :
              sensor.label === 'Vibration' ? 'P-204' :
              sensor.label === 'Humidity' ? 'Environment' :
              'Environment'

            return (
              <div
                key={sensor.id}
                className="flex flex-col overflow-hidden rounded-md border border-border/40 bg-background/30 p-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px]">{icon}</span>
                  <TrendIcon trend={sensor.trend} />
                </div>

                <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {sensor.label}
                </div>

                <div className="text-[7.5px] text-muted-foreground/90">{sourceLabel}</div>

                <div className="mt-auto">
                  <div className="flex items-end gap-0.5">
                    <span className="text-[18px] font-bold tabular-nums leading-none" style={{ color }}>
                      {typeof sensor.value === 'number' ? sensor.value.toFixed(sensor.value < 10 ? 1 : 0) : sensor.value}
                    </span>
                    <span className="mb-0.5 text-[8px] text-muted-foreground">{sensor.unit}</span>
                  </div>

                  <div
                    className={`mt-0.5 inline-flex rounded px-1 py-px text-[7.5px] font-semibold uppercase`}
                    style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}50` }}
                  >
                    {sensor.status}
                  </div>

                  <div className="mt-1 h-6 rounded-sm bg-background/30 px-0.5 pt-0.5">
                    <MiniSparkline history={sensor.history} color={color} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

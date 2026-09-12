import { useEffect, useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import { Card } from '@/components/cards/Card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { cn } from '@/utils/cn'

type OverlayMode = 'overall' | 'thermal' | 'gas' | 'pressure' | 'fire' | 'workers' | 'electrical'

type ZoneMetric = {
  risk: number
  temp: number
  gas: number
  pressure: number
  workers: number
}

type PlantZoneOverlay = {
  id: string
  name: string
  x: string
  y: string
  w: string
  h: string
  metrics: Record<OverlayMode, ZoneMetric>
}

const filters: Array<{ key: OverlayMode; label: string }> = [
  { key: 'overall', label: 'Overall Risk' },
  { key: 'thermal', label: 'Thermal' },
  { key: 'gas', label: 'Gas' },
  { key: 'pressure', label: 'Pressure' },
  { key: 'fire', label: 'Fire' },
  { key: 'workers', label: 'Worker Density' },
  { key: 'electrical', label: 'Electrical' },
]

const zones: PlantZoneOverlay[] = [
  {
    id: 'Z-01',
    name: 'Cooling Towers',
    x: '6%',
    y: '9%',
    w: '17%',
    h: '21%',
    metrics: {
      overall: { risk: 22, temp: 38, gas: 8, pressure: 31, workers: 12 },
      thermal: { risk: 26, temp: 41, gas: 7, pressure: 32, workers: 11 },
      gas: { risk: 12, temp: 37, gas: 10, pressure: 30, workers: 11 },
      pressure: { risk: 18, temp: 38, gas: 8, pressure: 35, workers: 12 },
      fire: { risk: 9, temp: 36, gas: 7, pressure: 31, workers: 12 },
      workers: { risk: 20, temp: 38, gas: 8, pressure: 31, workers: 14 },
      electrical: { risk: 24, temp: 38, gas: 8, pressure: 31, workers: 12 },
    },
  },
  {
    id: 'Z-02',
    name: 'Storage Tanks',
    x: '25%',
    y: '8%',
    w: '18%',
    h: '21%',
    metrics: {
      overall: { risk: 48, temp: 46, gas: 41, pressure: 52, workers: 9 },
      thermal: { risk: 42, temp: 52, gas: 37, pressure: 50, workers: 8 },
      gas: { risk: 66, temp: 45, gas: 68, pressure: 51, workers: 9 },
      pressure: { risk: 54, temp: 46, gas: 41, pressure: 62, workers: 9 },
      fire: { risk: 58, temp: 48, gas: 43, pressure: 54, workers: 9 },
      workers: { risk: 38, temp: 46, gas: 41, pressure: 52, workers: 10 },
      electrical: { risk: 35, temp: 46, gas: 41, pressure: 52, workers: 9 },
    },
  },
  {
    id: 'Z-03',
    name: 'Reactor Units',
    x: '45%',
    y: '16%',
    w: '23%',
    h: '29%',
    metrics: {
      overall: { risk: 92, temp: 86, gas: 71, pressure: 83, workers: 34 },
      thermal: { risk: 97, temp: 94, gas: 68, pressure: 82, workers: 34 },
      gas: { risk: 78, temp: 84, gas: 79, pressure: 80, workers: 35 },
      pressure: { risk: 88, temp: 85, gas: 70, pressure: 91, workers: 34 },
      fire: { risk: 93, temp: 86, gas: 74, pressure: 83, workers: 34 },
      workers: { risk: 84, temp: 85, gas: 70, pressure: 82, workers: 38 },
      electrical: { risk: 72, temp: 84, gas: 71, pressure: 81, workers: 34 },
    },
  },
  {
    id: 'Z-04',
    name: 'Heat Exchangers',
    x: '70%',
    y: '10%',
    w: '16%',
    h: '20%',
    metrics: {
      overall: { risk: 37, temp: 58, gas: 19, pressure: 44, workers: 8 },
      thermal: { risk: 57, temp: 66, gas: 18, pressure: 45, workers: 8 },
      gas: { risk: 22, temp: 56, gas: 22, pressure: 42, workers: 8 },
      pressure: { risk: 41, temp: 57, gas: 19, pressure: 57, workers: 8 },
      fire: { risk: 29, temp: 56, gas: 20, pressure: 44, workers: 8 },
      workers: { risk: 26, temp: 57, gas: 19, pressure: 44, workers: 9 },
      electrical: { risk: 39, temp: 58, gas: 20, pressure: 44, workers: 8 },
    },
  },
  {
    id: 'Z-05',
    name: 'Pump House',
    x: '9%',
    y: '49%',
    w: '16%',
    h: '18%',
    metrics: {
      overall: { risk: 28, temp: 42, gas: 14, pressure: 47, workers: 7 },
      thermal: { risk: 30, temp: 45, gas: 13, pressure: 48, workers: 7 },
      gas: { risk: 24, temp: 41, gas: 21, pressure: 46, workers: 7 },
      pressure: { risk: 49, temp: 42, gas: 14, pressure: 64, workers: 7 },
      fire: { risk: 32, temp: 43, gas: 15, pressure: 47, workers: 7 },
      workers: { risk: 20, temp: 42, gas: 14, pressure: 47, workers: 8 },
      electrical: { risk: 35, temp: 42, gas: 14, pressure: 48, workers: 7 },
    },
  },
  {
    id: 'Z-06',
    name: 'Warehouse',
    x: '29%',
    y: '51%',
    w: '22%',
    h: '20%',
    metrics: {
      overall: { risk: 43, temp: 36, gas: 17, pressure: 33, workers: 22 },
      thermal: { risk: 24, temp: 40, gas: 15, pressure: 33, workers: 22 },
      gas: { risk: 28, temp: 35, gas: 26, pressure: 33, workers: 22 },
      pressure: { risk: 25, temp: 35, gas: 16, pressure: 39, workers: 22 },
      fire: { risk: 62, temp: 38, gas: 20, pressure: 34, workers: 22 },
      workers: { risk: 68, temp: 36, gas: 17, pressure: 33, workers: 32 },
      electrical: { risk: 30, temp: 36, gas: 16, pressure: 33, workers: 22 },
    },
  },
  {
    id: 'Z-07',
    name: 'Control Room',
    x: '56%',
    y: '51%',
    w: '16%',
    h: '18%',
    metrics: {
      overall: { risk: 14, temp: 30, gas: 4, pressure: 21, workers: 6 },
      thermal: { risk: 12, temp: 31, gas: 4, pressure: 21, workers: 6 },
      gas: { risk: 10, temp: 30, gas: 6, pressure: 20, workers: 6 },
      pressure: { risk: 13, temp: 30, gas: 4, pressure: 25, workers: 6 },
      fire: { risk: 11, temp: 30, gas: 5, pressure: 21, workers: 6 },
      workers: { risk: 16, temp: 30, gas: 4, pressure: 21, workers: 8 },
      electrical: { risk: 18, temp: 30, gas: 4, pressure: 21, workers: 6 },
    },
  },
  {
    id: 'Z-08',
    name: 'Loading Bay',
    x: '76%',
    y: '50%',
    w: '18%',
    h: '21%',
    metrics: {
      overall: { risk: 54, temp: 45, gas: 33, pressure: 46, workers: 18 },
      thermal: { risk: 39, temp: 51, gas: 29, pressure: 46, workers: 18 },
      gas: { risk: 58, temp: 43, gas: 57, pressure: 44, workers: 18 },
      pressure: { risk: 46, temp: 44, gas: 33, pressure: 58, workers: 18 },
      fire: { risk: 63, temp: 47, gas: 36, pressure: 47, workers: 18 },
      workers: { risk: 61, temp: 45, gas: 33, pressure: 46, workers: 27 },
      electrical: { risk: 41, temp: 45, gas: 33, pressure: 46, workers: 18 },
    },
  },
  {
    id: 'Z-09',
    name: 'Utilities',
    x: '7%',
    y: '73%',
    w: '22%',
    h: '18%',
    metrics: {
      overall: { risk: 32, temp: 34, gas: 11, pressure: 35, workers: 9 },
      thermal: { risk: 24, temp: 39, gas: 10, pressure: 34, workers: 9 },
      gas: { risk: 21, temp: 34, gas: 17, pressure: 34, workers: 9 },
      pressure: { risk: 45, temp: 34, gas: 11, pressure: 61, workers: 9 },
      fire: { risk: 27, temp: 35, gas: 12, pressure: 36, workers: 9 },
      workers: { risk: 28, temp: 34, gas: 11, pressure: 35, workers: 11 },
      electrical: { risk: 49, temp: 34, gas: 11, pressure: 35, workers: 9 },
    },
  },
  {
    id: 'Z-10',
    name: 'Process Area',
    x: '31%',
    y: '73%',
    w: '46%',
    h: '18%',
    metrics: {
      overall: { risk: 71, temp: 67, gas: 52, pressure: 63, workers: 36 },
      thermal: { risk: 82, temp: 79, gas: 49, pressure: 61, workers: 36 },
      gas: { risk: 69, temp: 65, gas: 73, pressure: 62, workers: 36 },
      pressure: { risk: 78, temp: 66, gas: 51, pressure: 82, workers: 36 },
      fire: { risk: 75, temp: 68, gas: 55, pressure: 63, workers: 36 },
      workers: { risk: 74, temp: 67, gas: 52, pressure: 63, workers: 44 },
      electrical: { risk: 64, temp: 66, gas: 52, pressure: 63, workers: 36 },
    },
  },
]

const modeUnit: Record<OverlayMode, string> = {
  overall: 'risk',
  thermal: 'degC',
  gas: 'ppm',
  pressure: 'bar',
  fire: 'index',
  workers: 'density',
  electrical: 'load',
}

function getTone(risk: number) {
  if (risk >= 85) return 'critical'
  if (risk >= 65) return 'high'
  if (risk >= 40) return 'medium'
  return 'low'
}

const toneStyles = {
  low: 'border-success/40 bg-success/20 text-success',
  medium: 'border-warning/45 bg-warning/25 text-warning',
  high: 'border-danger/45 bg-danger/30 text-danger',
  critical: 'border-critical/55 bg-critical/35 text-critical',
} as const

export function HeatMapCard() {
  const [mode, setMode] = useState<OverlayMode>('overall')
  const [drift, setDrift] = useState<Record<string, number>>({})
  const [refreshedAt, setRefreshedAt] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDrift(
        zones.reduce<Record<string, number>>((acc, zone) => {
          acc[zone.id] = Math.random() > 0.5 ? 1 : -1
          return acc
        }, {}),
      )
      setRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 3200)

    return () => window.clearInterval(interval)
  }, [])

  const averageRisk = useMemo(
    () => Math.round(zones.reduce((acc, zone) => acc + zone.metrics[mode].risk + (drift[zone.id] ?? 0), 0) / zones.length),
    [mode, drift],
  )

  return (
    <Card title="Risk Heat Map" subtitle="Operational refinery overlay" className="h-full border-border/85 bg-card/85 shadow-[0_12px_34px_rgba(0,0,0,0.34)]">
      <div className="flex h-full flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <StatusBadge label="Plant View" variant="stable" />
            <span className="rounded-md border border-border/70 bg-background/60 px-2 py-1 text-foreground">{filters.find((item) => item.key === mode)?.label}</span>
            <span className="rounded-md border border-border/70 bg-background/60 px-2 py-1">Avg Risk {averageRisk}%</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setMode(filter.key)}
                className={cn(
                  'rounded-md border px-2 py-1 text-[10px] uppercase tracking-wide transition-all duration-200',
                  mode === filter.key ? 'border-primary/40 bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.25)]' : 'border-border/70 bg-background/55 text-muted-foreground hover:text-foreground',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-2xl border border-border/70 bg-background/45 p-3">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>Zone Overlay</span>
            <span>Refreshed {refreshedAt}</span>
          </div>
          <div className="relative h-78 overflow-hidden rounded-xl border border-border/70 bg-[linear-gradient(180deg,rgba(9,15,28,0.95),rgba(14,23,38,0.88))]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[28px_28px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.12),transparent_38%),radial-gradient(circle_at_75%_60%,rgba(239,68,68,0.15),transparent_34%),radial-gradient(circle_at_45%_75%,rgba(245,158,11,0.14),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-x-6 top-[22%] h-px bg-border/70" />
            <div className="pointer-events-none absolute inset-x-6 top-[50%] h-px bg-border/70" />
            <div className="pointer-events-none absolute inset-x-6 top-[74%] h-px bg-border/70" />
            <div className="pointer-events-none absolute left-[24%] inset-y-6 w-px bg-border/70" />
            <div className="pointer-events-none absolute left-[44%] inset-y-6 w-px bg-border/70" />
            <div className="pointer-events-none absolute left-[68%] inset-y-6 w-px bg-border/70" />

            <span className="pointer-events-none absolute left-[18%] top-[19%] size-2 rounded-full bg-primary/80 shadow-[0_0_22px_rgba(59,130,246,0.65)] animate-status-blink" />
            <span className="pointer-events-none absolute left-[52%] top-[42%] size-2 rounded-full bg-warning/80 shadow-[0_0_22px_rgba(245,158,11,0.55)] animate-status-blink" />
            <span className="pointer-events-none absolute left-[78%] top-[65%] size-2 rounded-full bg-success/80 shadow-[0_0_22px_rgba(16,185,129,0.55)] animate-status-blink" />

            <div className="pointer-events-none absolute left-[8%] top-[22%] h-1 w-[76%] rounded-full bg-linear-to-r from-primary/15 via-border/90 to-primary/20 animate-pipeline-flow" />
            <div className="pointer-events-none absolute left-[20%] top-[60%] h-1 w-[64%] rounded-full bg-linear-to-r from-border/90 via-primary/30 to-border/90 animate-pipeline-flow" />

            {zones.map((zone) => {
              const metric = zone.metrics[mode]
              const liveRisk = Math.max(0, Math.min(100, metric.risk + (drift[zone.id] ?? 0)))
              const tone = getTone(liveRisk)
              return (
                <motion.div
                  key={zone.id}
                  layout
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={cn(
                    'group absolute rounded-lg border backdrop-blur-[1px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.25)]',
                    toneStyles[tone],
                    tone === 'critical' && 'animate-zone-glow',
                  )}
                  style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
                >
                  <div className="flex h-full flex-col justify-between px-2 py-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/90">{zone.id}</span>
                      <span className={cn('size-1.5 rounded-full', tone === 'critical' ? 'bg-critical animate-status-blink' : tone === 'high' ? 'bg-danger' : tone === 'medium' ? 'bg-warning' : 'bg-success')} />
                    </div>
                    <p className="truncate text-[11px] font-semibold text-foreground">{zone.name}</p>
                    <p className="text-[10px] text-foreground/90">Risk {liveRisk}%</p>
                  </div>

                  <div className="pointer-events-none absolute left-0 top-[102%] z-20 hidden w-44 rounded-lg border border-border/80 bg-background/95 p-2 text-[10px] text-muted-foreground shadow-[0_10px_24px_rgba(0,0,0,0.4)] group-hover:block">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground">{zone.name}</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <span>Risk</span>
                      <span className="text-right text-foreground">{liveRisk}%</span>
                      <span>Temp</span>
                      <span className="text-right text-foreground">{metric.temp} C</span>
                      <span>Gas</span>
                      <span className="text-right text-foreground">{metric.gas} ppm</span>
                      <span>Pressure</span>
                      <span className="text-right text-foreground">{metric.pressure} bar</span>
                      <span>Workers</span>
                      <span className="text-right text-foreground">{metric.workers}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-2.5 text-[10px] text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-success" /> Low</span>
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-warning" /> Medium</span>
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-danger" /> High</span>
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-critical" /> Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-28 rounded-full bg-linear-to-r from-success via-warning to-critical" />
              <span>Scale 0-100 {modeUnit[mode]} · Critical zones pulse</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

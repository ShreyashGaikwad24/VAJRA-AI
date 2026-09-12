import {
  ArrowRight,
  Circle,
  Cog,
  Factory,
  Flame,
  Gauge,
  Warehouse,
  Wind,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/cards/Card'
import { cn } from '@/utils/cn'

type EquipmentStatus = 'Healthy' | 'Warning' | 'Critical' | 'Maintenance' | 'Offline'

const assets = [
  {
    id: 'CT-01',
    name: 'Cooling Towers',
    status: 'Healthy' as EquipmentStatus,
    x: '6%',
    y: '7%',
    w: '20%',
    h: '17%',
    temp: '39 C',
    pressure: '3.2 bar',
    risk: '22',
    workers: '12',
    updated: '04:38 AM',
    tooltipAlign: 'right' as const,
    tooltipSide: 'bottom' as const,
    glyph: 'cooling' as const,
  },
  {
    id: 'ST-12',
    name: 'Storage Tanks',
    status: 'Warning' as EquipmentStatus,
    x: '16%',
    y: '37%',
    w: '21%',
    h: '18%',
    temp: '46 C',
    pressure: '5.1 bar',
    risk: '48',
    workers: '9',
    updated: '04:37 AM',
    tooltipAlign: 'right' as const,
    tooltipSide: 'bottom' as const,
    glyph: 'storage' as const,
  },
  {
    id: 'RU-08',
    name: 'Reactor Unit',
    status: 'Critical' as EquipmentStatus,
    x: '40%',
    y: '33%',
    w: '23%',
    h: '23%',
    temp: '421 C',
    pressure: '17.4 bar',
    risk: '92',
    workers: '14',
    updated: '04:28 AM',
    tooltipAlign: 'center' as const,
    tooltipSide: 'bottom' as const,
    glyph: 'reactor' as const,
  },
  {
    id: 'HX-04',
    name: 'Heat Exchanger',
    status: 'Maintenance' as EquipmentStatus,
    x: '74%',
    y: '8%',
    w: '20%',
    h: '17%',
    temp: '58 C',
    pressure: '4.4 bar',
    risk: '37',
    workers: '8',
    updated: '04:35 AM',
    tooltipAlign: 'left' as const,
    tooltipSide: 'bottom' as const,
    glyph: 'exchanger' as const,
  },
  {
    id: 'PH-02',
    name: 'Pump House',
    status: 'Healthy' as EquipmentStatus,
    x: '8%',
    y: '72%',
    w: '20%',
    h: '17%',
    temp: '42 C',
    pressure: '4.7 bar',
    risk: '28',
    workers: '7',
    updated: '04:34 AM',
    tooltipAlign: 'right' as const,
    tooltipSide: 'bottom' as const,
    glyph: 'pump' as const,
  },
  {
    id: 'CR-01',
    name: 'Control Room',
    status: 'Healthy' as EquipmentStatus,
    x: '67%',
    y: '40%',
    w: '20%',
    h: '17%',
    temp: '30 C',
    pressure: '2.1 bar',
    risk: '14',
    workers: '6',
    updated: '04:38 AM',
    tooltipAlign: 'left' as const,
    tooltipSide: 'bottom' as const,
    glyph: 'control' as const,
  },
  {
    id: 'WH-09',
    name: 'Warehouse',
    status: 'Offline' as EquipmentStatus,
    x: '39%',
    y: '72%',
    w: '20%',
    h: '17%',
    temp: '36 C',
    pressure: '3.3 bar',
    risk: '43',
    workers: '22',
    updated: '04:33 AM',
    tooltipAlign: 'center' as const,
    tooltipSide: 'bottom' as const,
    glyph: 'warehouse' as const,
  },
  {
    id: 'LB-03',
    name: 'Loading Bay',
    status: 'Warning' as EquipmentStatus,
    x: '72%',
    y: '72%',
    w: '21%',
    h: '17%',
    temp: '45 C',
    pressure: '4.6 bar',
    risk: '54',
    workers: '18',
    updated: '04:21 AM',
    tooltipAlign: 'center' as const,
    tooltipSide: 'top' as const,
    glyph: 'loading' as const,
  },
] as const

const runPipes = [
  { left: '49.4%', top: '24%', width: '1%', height: '9%' },
  { left: '27%', top: '46%', width: '24%', height: '0.9%' },
  { left: '51%', top: '46%', width: '26%', height: '0.9%' },
  { left: '17%', top: '80%', width: '34%', height: '0.9%' },
  { left: '51%', top: '80%', width: '31%', height: '0.9%' },
  { left: '49.4%', top: '56%', width: '1%', height: '24%' },
  { left: '76%', top: '25%', width: '0.8%', height: '15%' },
] as const

const elbows = [
  { left: '49%', top: '45.5%' },
  { left: '49%', top: '79.5%' },
  { left: '75.7%', top: '39.5%' },
] as const

const valves = [
  { left: '37%', top: '45.8%' },
  { left: '65%', top: '45.8%' },
  { left: '34%', top: '79.8%' },
  { left: '66%', top: '79.8%' },
  { left: '49.2%', top: '66%' },
] as const

const arrows = [
  { left: '44%', top: '46%', rotate: '0deg' },
  { left: '58%', top: '46%', rotate: '0deg' },
  { left: '40%', top: '80%', rotate: '0deg' },
  { left: '62%', top: '80%', rotate: '0deg' },
  { left: '50%', top: '30%', rotate: '90deg' },
  { left: '50%', top: '63%', rotate: '90deg' },
] as const

const pressureNodes = [
  { left: '29%', top: '46%' },
  { left: '73%', top: '46%' },
  { left: '28%', top: '80%' },
  { left: '74%', top: '80%' },
] as const

const statusTone = {
  Healthy: {
    chip: 'border-success/40 bg-success/10 text-success',
    led: 'bg-success',
    icon: 'text-success border-success/40 bg-success/10',
  },
  Warning: {
    chip: 'border-warning/40 bg-warning/10 text-warning',
    led: 'bg-warning',
    icon: 'text-warning border-warning/40 bg-warning/10',
  },
  Critical: {
    chip: 'border-critical/40 bg-critical/10 text-critical',
    led: 'bg-critical',
    icon: 'text-critical border-critical/40 bg-critical/10',
  },
  Maintenance: {
    chip: 'border-primary/40 bg-primary/10 text-primary',
    led: 'bg-primary',
    icon: 'text-primary border-primary/40 bg-primary/10',
  },
  Offline: {
    led: 'bg-muted-foreground',
    icon: 'text-muted-foreground border-border bg-secondary/40',
  },
} as const

function AssetGlyph({ type }: { type: (typeof assets)[number]['glyph'] }) {
  if (type === 'cooling') {
    return (
      <span className="relative h-8 w-11">
        <span className="absolute left-1 top-0 h-7 w-3 rounded-sm border border-border/80 bg-background/75" />
        <span className="absolute left-7 top-0 h-7 w-3 rounded-sm border border-border/80 bg-background/75" />
        <span className="absolute left-0 top-7 h-1 w-11 rounded-full bg-border/80" />
        <Wind className="absolute left-3 top-2 size-4 text-muted-foreground animate-fan-spin" />
      </span>
    )
  }

  if (type === 'storage') {
    return (
      <span className="relative h-8 w-11">
        <span className="absolute inset-0 rounded-md border border-border/80 bg-background/75" />
        <span className="absolute bottom-0 left-0 h-2 w-2/3 rounded-sm bg-warning/40 animate-pipeline-flow" />
      </span>
    )
  }

  if (type === 'reactor') {
    return (
      <span className="relative h-9 w-12">
        <span className="absolute left-3 top-0 h-8 w-6 rounded-full border border-border/80 bg-background/75 animate-pulse" />
        <span className="absolute left-0 top-8 h-1 w-12 rounded-full bg-border/80" />
        <Flame className="absolute left-[18px] top-[6px] size-3.5 text-critical" />
      </span>
    )
  }

  if (type === 'exchanger') {
    return (
      <span className="relative h-8 w-11">
        <span className="absolute inset-0 rounded-md border border-border/80 bg-background/75" />
        <span className="absolute left-1 top-1 h-1 w-9 rounded-full bg-warning/60 animate-heat-shimmer" />
        <span className="absolute left-1 top-4 h-1 w-9 rounded-full bg-warning/50 animate-heat-shimmer" style={{ animationDelay: '0.4s' }} />
      </span>
    )
  }

  if (type === 'pump') {
    return (
      <span className="relative h-8 w-11">
        <span className="absolute left-2 top-1 h-6 w-6 rounded-full border border-border/80 bg-background/75" />
        <Cog className="absolute left-[13px] top-[8px] size-3 text-muted-foreground animate-fan-spin" />
      </span>
    )
  }

  if (type === 'control') {
    return (
      <span className="relative h-8 w-11">
        <span className="absolute inset-0 rounded-md border border-border/80 bg-background/75" />
        <span className="absolute left-1.5 top-2 size-1 rounded-full bg-success animate-status-blink" />
        <span className="absolute left-4 top-2 size-1 rounded-full bg-primary animate-status-blink" style={{ animationDelay: '0.3s' }} />
        <span className="absolute left-6.5 top-2 size-1 rounded-full bg-success animate-status-blink" style={{ animationDelay: '0.6s' }} />
      </span>
    )
  }

  if (type === 'warehouse') {
    return (
      <span className="relative h-8 w-11">
        <span className="absolute inset-0 rounded-md border border-border/80 bg-background/75" />
        <Warehouse className="absolute left-1 top-1.5 size-4 text-muted-foreground" />
        <Factory className="absolute left-6 top-2 size-3 text-muted-foreground" />
      </span>
    )
  }

  return (
    <span className="relative h-8 w-11">
      <span className="absolute inset-0 rounded-md border border-border/80 bg-background/75" />
      <span className="absolute left-1 top-4 h-1 w-8 rounded-full bg-warning/50" />
      <span className="absolute left-1 top-1 size-1 rounded-full bg-warning animate-status-blink" />
      <span className="absolute left-4 top-1 size-1 rounded-full bg-warning animate-status-blink" style={{ animationDelay: '0.2s' }} />
      <span className="absolute left-7 top-1 size-1 rounded-full bg-warning animate-status-blink" style={{ animationDelay: '0.4s' }} />
    </span>
  )
}

export function PlantOverviewCard() {
  return (
    <Card title="Plant Overview" subtitle="Mini industrial refinery preview" className="h-full border-border/85 bg-card/85 shadow-[0_12px_34px_rgba(0,0,0,0.34)]">
      <div className="flex h-full flex-col gap-3">
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(180deg,rgba(13,21,33,0.98),rgba(10,17,28,0.94))] p-3">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,rgba(255,255,255,0.01))]" />

          <div className="relative overflow-hidden rounded-xl border border-border/70 bg-background/35 p-2.5">
            <div className="relative h-72 overflow-hidden rounded-lg border border-border/70 bg-[linear-gradient(180deg,rgba(9,15,28,0.92),rgba(15,24,39,0.88))]">
              <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(157,179,206,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(157,179,206,0.045)_1px,transparent_1px)] bg-size-[24px_24px]" />
              <div className="absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.03),transparent_42%,rgba(59,130,246,0.025))]" />
              <div className="absolute inset-0 z-0 opacity-20 [background:radial-gradient(circle_at_20%_30%,rgba(180,200,220,0.25)_0,transparent_24%),radial-gradient(circle_at_70%_70%,rgba(180,200,220,0.2)_0,transparent_20%)]" />

              <div className="pointer-events-none absolute inset-0 z-10">
                {runPipes.map((pipe) => (
                  <span
                    key={`${pipe.left}-${pipe.top}-${pipe.width}-${pipe.height}`}
                    className="absolute overflow-hidden rounded-full border border-border/70 bg-linear-to-r from-primary/15 via-border/85 to-primary/15"
                    style={pipe}
                  >
                    <span className="absolute inset-y-0 left-[-40%] w-2/5 bg-linear-to-r from-transparent via-primary/75 to-transparent animate-pipeline-flow" />
                  </span>
                ))}

                {elbows.map((elbow) => (
                  <span
                    key={`${elbow.left}-${elbow.top}`}
                    className="absolute h-4 w-4 rounded-tl-sm border-l-2 border-t-2 border-primary/35"
                    style={elbow}
                  />
                ))}

                {valves.map((valve) => (
                  <span
                    key={`${valve.left}-${valve.top}`}
                    className="absolute h-2.5 w-2 rounded-full border border-border/80 bg-background/90"
                    style={valve}
                  />
                ))}

                {pressureNodes.map((node) => (
                  <span key={`${node.left}-${node.top}`} className="absolute" style={node}>
                    <Gauge className="size-3 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/70" />
                  </span>
                ))}

                {arrows.map((arrow) => (
                  <ArrowRight
                    key={`${arrow.left}-${arrow.top}`}
                    className="absolute size-3 -translate-x-1/2 -translate-y-1/2 text-primary/70"
                    style={{ left: arrow.left, top: arrow.top, transform: `translate(-50%, -50%) rotate(${arrow.rotate})` }}
                  />
                ))}

                <span className="absolute left-[50%] top-[35.2%] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/80 bg-background/90" />
                <span className="absolute left-[50%] top-[63.2%] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/80 bg-background/90" />
              </div>

              <div className="pointer-events-none absolute inset-0 z-30">
                <span className="absolute left-[49%] top-[19%] size-2 rounded-full bg-success shadow-[0_0_14px_rgba(16,185,129,0.5)] animate-status-blink" />
                <span className="absolute left-[50%] top-[45.8%] size-2 rounded-full bg-critical shadow-[0_0_14px_rgba(220,38,38,0.5)] animate-status-blink" />
                <span className="absolute left-[75.8%] top-[45.8%] size-2 rounded-full bg-primary shadow-[0_0_14px_rgba(59,130,246,0.5)] animate-status-blink" />
              </div>

              {assets.map((item) => {
                const tone = statusTone[item.status]
                return (
                  <div
                    key={item.id}
                    className="group absolute z-20 rounded-lg border border-border/80 bg-background/60 px-2 py-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition-all duration-250 hover:z-50 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-background/75 hover:shadow-[0_14px_30px_rgba(0,0,0,0.35)]"
                    style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-[14px] font-semibold leading-4 text-foreground">{item.name}</p>
                        </div>
                        <AssetGlyph type={item.glyph} />
                      </div>

                      <span className={cn('absolute right-2 top-2 size-2 rounded-full animate-status-blink', tone.led)} />

                      <span className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.06),transparent_55%)]" />
                    </div>

                    <div
                      className={cn(
                        'pointer-events-none absolute z-60 w-56 rounded-lg border border-border/80 bg-background/95 p-2.5 opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-all duration-200 group-hover:visible group-hover:opacity-100',
                        item.tooltipAlign === 'left' && 'right-0',
                        item.tooltipAlign === 'center' && 'left-1/2 -translate-x-1/2',
                        item.tooltipAlign === 'right' && 'left-0',
                        item.tooltipSide === 'bottom' && 'top-[104%] invisible translate-y-1 group-hover:translate-y-0',
                        item.tooltipSide === 'top' && 'bottom-[104%] invisible -translate-y-1 group-hover:translate-y-0',
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-semibold text-foreground">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.id}</p>
                        </div>
                        <span className={cn('rounded-md border px-1.5 py-0.5 text-[11px] font-medium', statusTone[item.status].icon)}>{item.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                        <span>Equipment</span>
                        <span className="text-right text-[13px] text-foreground">{item.name}</span>
                        <span>Temperature</span>
                        <span className="text-right text-[13px] text-foreground">{item.temp}</span>
                        <span>Pressure</span>
                        <span className="text-right text-[13px] text-foreground">{item.pressure}</span>
                        <span>Workers</span>
                        <span className="text-right text-[13px] text-foreground">{item.workers}</span>
                        <span>Risk Score</span>
                        <span className="text-right text-[13px] text-foreground">{item.risk}</span>
                        <span>Health</span>
                        <span className="text-right text-[13px] text-foreground">{item.status}</span>
                        <span>Updated</span>
                        <span className="text-right text-[13px] text-foreground">{item.updated}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/55 px-3 py-2">
            <div className="flex min-w-0 flex-1 items-center gap-3 text-[12px] text-muted-foreground">
              <span className="truncate text-foreground">Mini Digital Twin Preview</span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/60 px-2 py-1">
                <Circle className="size-2 fill-success text-success" />
                Operational
              </span>
              <span className="hidden rounded-md border border-border/70 bg-background/60 px-2 py-1 lg:inline">Assets 8</span>
              <span className="hidden rounded-md border border-border/70 bg-background/60 px-2 py-1 lg:inline">Sensors 142</span>
              <span className="hidden rounded-md border border-border/70 bg-background/60 px-2 py-1 lg:inline">Workers 356</span>
            </div>
            <Button className="h-8 shrink-0 rounded-lg border border-primary/30 bg-primary/90 px-3 text-xs text-primary-foreground shadow-[0_8px_20px_rgba(59,130,246,0.25)] transition-all duration-250 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_12px_24px_rgba(59,130,246,0.32)]">
              View Digital Twin
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

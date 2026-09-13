import { Clock3, Flame, Waves } from 'lucide-react'

import { CameraPresetBar } from '@/components/digitalTwin/CameraPresetBar'
import { usePlantStore } from '@/store/usePlantStore'

export function BottomTelemetryDock() {
  const activeSensors = usePlantStore((state) => state.overview.activeSensors)
  const zones = usePlantStore((state) => state.zones)
  const hottestZone = zones.reduce((current, zone) => zone.riskScore > current.riskScore ? zone : current, zones[0])

  return (
    <section className="h-[220px] shrink-0 rounded-lg border border-border/80 bg-card/80 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.34)] backdrop-blur-sm">
      <div className="grid gap-2 lg:grid-cols-3">
        <div className="rounded-md border border-border/70 bg-background/55 px-2.5 py-2">
          <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Waves className="size-3" />
            Live Sensors
          </p>
          <p className="text-[14px] font-semibold text-foreground">{activeSensors} Active Nodes</p>
          <p className="text-[10px] text-muted-foreground">Latency 42 ms · Stream quality stable</p>
        </div>

        <div className="rounded-md border border-border/70 bg-background/55 px-2.5 py-2">
          <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Flame className="size-3" />
            Heat Intensity
          </p>
          <p className="text-[14px] font-semibold text-warning">{hottestZone?.label ?? 'Unavailable'}</p>
          <p className="text-[10px] text-muted-foreground">Current risk {hottestZone?.riskScore ?? 0}% · Backend-derived</p>
        </div>

        <div className="rounded-md border border-border/70 bg-background/55 px-2.5 py-2">
          <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Clock3 className="size-3" />
            Time
          </p>
          <p className="text-[14px] font-semibold text-foreground">Shift A · 10:45 AM</p>
          <p className="text-[10px] text-muted-foreground">Telemetry window: last 5 minutes</p>
        </div>
      </div>

      <div className="mt-2">
        <CameraPresetBar />
      </div>
    </section>
  )
}

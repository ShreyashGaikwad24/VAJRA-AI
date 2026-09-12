import { Camera, ShieldAlert, Users, Waves } from 'lucide-react'

const legendRows = [
  { label: 'Worker', icon: Users, tone: 'bg-primary' },
  { label: 'Sensor', icon: Waves, tone: 'bg-success' },
  { label: 'Camera', icon: Camera, tone: 'bg-warning' },
  { label: 'Hydrant', icon: ShieldAlert, tone: 'bg-danger' },
  { label: 'Assembly Point', icon: null, tone: 'bg-primary/70' },
  { label: 'Low Risk', icon: null, tone: 'bg-success' },
  { label: 'Medium Risk', icon: null, tone: 'bg-warning' },
  { label: 'High Risk', icon: null, tone: 'bg-critical' },
  { label: 'Evacuation Route', icon: null, tone: 'bg-foreground/60' },
] as const

export function DigitalTwinLegend() {
  return (
    <div className="grid gap-1">
      {legendRows.map((item) => (
        <div key={item.label} className="flex items-center gap-2 rounded-md border border-border/70 bg-background/45 px-2 py-1">
          <span className={`inline-flex size-4 items-center justify-center rounded-sm ${item.tone}`}>
            {item.icon ? <item.icon className="size-2.5 text-background" /> : null}
          </span>
          <span className="text-[10px] text-foreground/90">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

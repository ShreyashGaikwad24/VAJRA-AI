import { MapPin } from 'lucide-react'

type ZoneSelectorProps = {
  className?: string
  value: string
  onChange: (value: string) => void
}

export function ZoneSelector({ className, value, onChange }: ZoneSelectorProps) {
  return (
    <label className={className}>
      <span className="mb-1 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <MapPin className="size-3" />
        Zone Selector
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-md border border-border/80 bg-background/70 px-2 text-[11px] text-foreground outline-none transition-colors focus:border-primary/60"
      >
        <option value="All Zones">All Zones</option>
        <option value="ZONE A">Zone A</option>
        <option value="ZONE B">Zone B</option>
        <option value="ZONE C">Zone C</option>
        <option value="ZONE D">Zone D</option>
        <option value="ZONE E">Zone E</option>
      </select>
    </label>
  )
}

import type { ReactNode } from 'react'

import { ChevronDown, Search } from 'lucide-react'

import { Card } from '@/components/cards/Card'
import { DigitalTwinLegend } from '@/components/digitalTwin/DigitalTwinLegend'
import { ViewModeSelector } from '@/components/digitalTwin/ViewModeSelector'
import { ZoneSelector } from '@/components/digitalTwin/ZoneSelector'

type ViewMode = 'Plant View' | 'Zone View' | 'Sensor View' | 'Heat Map' | 'Risk View'
type LayerKey = 'equipment' | 'pipelines' | 'workers' | 'sensors' | 'cameras' | 'labels'

type LeftControlPanelProps = {
  search: string
  onSearchChange: (value: string) => void
  selectedZone: string
  onZoneChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (value: ViewMode) => void
  layersVisible: Record<LayerKey, boolean>
  onLayerToggle: (layer: LayerKey) => void
}

type CollapsibleSectionProps = {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  return (
    <details open={defaultOpen} className="group rounded-md border border-border/70 bg-background/45">
      <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
        {title}
        <ChevronDown className="size-3 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-border/70 px-2 py-2">{children}</div>
    </details>
  )
}

export function LeftControlPanel({
  search,
  onSearchChange,
  selectedZone,
  onZoneChange,
  viewMode,
  onViewModeChange,
  layersVisible,
  onLayerToggle,
}: LeftControlPanelProps) {
  return (
    <Card title="Control Stack" subtitle="Plant context, layers, and filters" className="h-full">
      <div className="flex h-full min-h-0 flex-col gap-1.5 overflow-auto pr-0.5">
        <CollapsibleSection title="Plant Summary">
          <div className="grid grid-cols-2 gap-1">
            <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Workers</p>
              <p className="text-[13px] font-semibold text-foreground">356</p>
            </div>
            <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Sensors</p>
              <p className="text-[13px] font-semibold text-foreground">1,284</p>
            </div>
            <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Permits</p>
              <p className="text-[13px] font-semibold text-warning">48</p>
            </div>
            <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Incidents</p>
              <p className="text-[13px] font-semibold text-danger">3</p>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Legend">
          <DigitalTwinLegend />
        </CollapsibleSection>

        <CollapsibleSection title="Layer Controls">
          <div className="grid gap-1">
            {[
              ['equipment', 'Equipment'],
              ['pipelines', 'Pipelines'],
              ['workers', 'Workers'],
              ['sensors', 'Sensors'],
              ['cameras', 'Cameras'],
              ['labels', 'Labels'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-md border border-border/70 bg-background/55 px-2 py-1 text-[10px] text-foreground">
                <span>{label}</span>
                <input checked={layersVisible[key as LayerKey]} onChange={() => onLayerToggle(key as LayerKey)} type="checkbox" className="size-3 accent-blue-500" />
              </label>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Filters">
          <label>
            <span className="mb-1 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Search className="size-3" />
              Search Equipment
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="R-101, HX-04, PL-27A"
              className="h-8 w-full rounded-md border border-border/80 bg-background/70 px-2 text-[11px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/60"
            />
          </label>
          <div className="mt-2 grid gap-2">
            <ZoneSelector value={selectedZone} onChange={onZoneChange} />
            <ViewModeSelector value={viewMode} onChange={onViewModeChange} />
          </div>
        </CollapsibleSection>
      </div>
    </Card>
  )
}

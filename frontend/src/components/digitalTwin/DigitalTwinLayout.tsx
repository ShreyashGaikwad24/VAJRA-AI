import { useState } from 'react'

import { BottomTelemetryDock } from '@/components/digitalTwin/BottomTelemetryDock'
import { DigitalTwinHeader } from '@/components/digitalTwin/DigitalTwinHeader'
import { DigitalTwinViewport } from '@/components/digitalTwin/DigitalTwinViewport'
import { LeftControlPanel } from '@/components/digitalTwin/LeftControlPanel'
import { RightIntelligencePanel } from '@/components/digitalTwin/RightIntelligencePanel'

export function DigitalTwinLayout() {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'Plant View' | 'Zone View' | 'Sensor View' | 'Heat Map' | 'Risk View'>('Plant View')
  const [selectedZone, setSelectedZone] = useState('All Zones')
  const [layersVisible, setLayersVisible] = useState({
    equipment: true,
    pipelines: true,
    workers: true,
    sensors: true,
    cameras: true,
    labels: true,
  })

  const toggleLayer = (layer: keyof typeof layersVisible) => {
    setLayersVisible((current) => ({ ...current, [layer]: !current[layer] }))
  }

  const handleViewModeChange = (mode: typeof viewMode) => {
    setViewMode(mode)
    if (mode === 'Zone View' && selectedZone === 'All Zones') {
      setSelectedZone('ZONE C')
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden">
      <DigitalTwinHeader />

      <div className="grid min-h-0 flex-1 gap-2.5 xl:grid-cols-[18fr_57fr_25fr]">
        <div className="min-h-0">
          <LeftControlPanel
            search={search}
            onSearchChange={setSearch}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            layersVisible={layersVisible}
            onLayerToggle={toggleLayer}
          />
        </div>

        <div className="min-h-0">
          <DigitalTwinViewport
            search={search}
            onSearchChange={setSearch}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            layersVisible={layersVisible}
          />
        </div>

        <div className="min-h-0">
          <RightIntelligencePanel />
        </div>
      </div>

      <BottomTelemetryDock />
    </div>
  )
}

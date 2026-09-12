import { usePlantSimulation } from '@/modules/situationRoom/hooks/usePlantSimulation'

import { AIExplanationPanel } from './AIExplanationPanel'
import { PatternMatchingPanel } from './PatternMatchingPanel'
import { PlantRiskHeatMap } from './PlantRiskHeatMap'
import { RecommendedActionsPanel } from './RecommendedActionsPanel'
import { RiskContributorsPanel } from './RiskContributorsPanel'
import { RiskForecastPanel } from './RiskForecastPanel'
import { RiskOverviewPanel } from './RiskOverviewPanel'
import { RiskTrendPanel } from './RiskTrendPanel'
import { SensorSnapshotPanel } from './SensorSnapshotPanel'
import { SituationRoomHeader } from './SituationRoomHeader'

export function SituationRoomLayout() {
  usePlantSimulation(true)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
      <SituationRoomHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2 pb-2">
          {/* Row 1: Risk Overview | 3D Plant | Risk Contributors */}
          <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 2fr 1fr', minHeight: 268 }}>
            <RiskOverviewPanel />
            <PlantRiskHeatMap />
            <RiskContributorsPanel />
          </div>

          {/* Row 2: Pattern Matching | AI Explanation | Recommended Actions */}
          <div className="grid grid-cols-3 gap-2" style={{ minHeight: 234 }}>
            <PatternMatchingPanel />
            <AIExplanationPanel />
            <RecommendedActionsPanel />
          </div>

          {/* Row 3: Sensor Snapshot | Risk Trend | Risk Forecast */}
          <div className="grid gap-2" style={{ gridTemplateColumns: '1.35fr 1.1fr 0.75fr', minHeight: 192 }}>
            <SensorSnapshotPanel />
            <RiskTrendPanel />
            <RiskForecastPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

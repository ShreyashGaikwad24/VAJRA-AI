import { Card } from '@/components/cards/Card'

import { useDecisionSimulation } from '../hooks/useDecisionSimulation'

import { AIRecommendationPanel } from './AIRecommendationPanel'
import { DecisionSimulationHeader } from './DecisionSimulationHeader'
import { ExpectedOutcomesPanel } from './ExpectedOutcomesPanel'
import { RiskHeatmapComparison } from './RiskHeatmapComparison'
import { RiskReductionSummary } from './RiskReductionSummary'
import { SimulationComparison } from './SimulationComparison'
import { SimulationControls } from './SimulationControls'

export function DecisionSimulationLayout() {
  const {
    plantName,
    controls,
    setControls,
    controlValues,
    before,
    after,
    runResult,
    isRunning,
    runSimulation,
    resetSimulation,
    recommendationText,
    expectedOutcomes,
    selectionInfo,
    currentCriText,
  } = useDecisionSimulation()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
      <DecisionSimulationHeader plantName={plantName} />

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        <div className="flex flex-col gap-2.5">
          <SimulationControls
            controls={controls}
            controlValues={controlValues}
            isRunning={isRunning}
            onChange={setControls}
            onRun={runSimulation}
            onReset={resetSimulation}
          />

          <SimulationComparison before={before} after={after} />

          <RiskReductionSummary
            criReductionPct={after?.metrics.criReductionPct ?? 0}
            incidentRiskReductionPct={after?.metrics.incidentRiskReductionPct ?? 0}
            downtimeRiskReductionPct={after?.metrics.downtimeRiskReductionPct ?? 0}
            potentialLossReductionPct={after?.metrics.potentialLossReductionPct ?? 0}
          />

          <div className="grid gap-2 xl:grid-cols-[1.15fr_0.85fr]">
            <RiskHeatmapComparison before={before} after={after} />
            <div className="flex flex-col gap-2">
              <AIRecommendationPanel
                text={recommendationText}
                checklist={runResult?.checklist ?? []}
              />
              <ExpectedOutcomesPanel
                riskReduction={expectedOutcomes.riskReduction}
                safetyImprovement={expectedOutcomes.safetyImprovement}
                operationalStability={expectedOutcomes.operationalStability}
                confidenceScore={expectedOutcomes.confidenceScore}
              />
            </div>
          </div>

          <Card title="Current Selection" subtitle="Scenario context" className="border-border/70">
            <div className="grid gap-1 text-[10px] text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
              <div>Scenario Name: <span className="text-foreground">{selectionInfo.scenarioName}</span></div>
              <div>Focus Area: <span className="text-foreground">{selectionInfo.focusArea}</span></div>
              <div>Primary Risk: <span className="text-foreground">{selectionInfo.primaryRisk}</span></div>
              <div>Current CRI: <span className="text-critical">{currentCriText}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

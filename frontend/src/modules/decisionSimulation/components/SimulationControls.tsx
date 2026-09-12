import type { ChangeEvent } from 'react'

import { ActionButton } from '@/components/common/ActionButton'
import { Card } from '@/components/cards/Card'
import {
  EMERGENCY_PREPAREDNESS_OPTIONS,
  MAINTENANCE_ACTIONS,
  OPERATOR_ALLOCATIONS,
} from '@/modules/decisionSimulation/services/simulationScenarios'
import type { SimulationControls as SimulationControlsType } from '@/modules/decisionSimulation/services/simulationTypes'

type SimulationControlsProps = {
  controls: SimulationControlsType
  isRunning: boolean
  controlValues: {
    cooling: { current: number; next: number }
    feed: { current: number; next: number }
    pressure: { current: number; next: number }
  }
  onChange: (next: SimulationControlsType) => void
  onRun: () => void
  onReset: () => void
}

function formatPct(value: number): string {
  return `${value > 0 ? '+' : ''}${value}%`
}

function MetricLine({ current, next, unit }: { current: number; next: number; unit: string }) {
  return (
    <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
      <span>Current: <span className="text-foreground">{current.toFixed(unit === 'bar' ? 1 : 0)} {unit}</span></span>
      <span>New: <span className="text-foreground">{next.toFixed(unit === 'bar' ? 1 : 0)} {unit}</span></span>
    </div>
  )
}

export function SimulationControls({
  controls,
  controlValues,
  isRunning,
  onChange,
  onRun,
  onReset,
}: SimulationControlsProps) {
  const update = <K extends keyof SimulationControlsType>(key: K, value: SimulationControlsType[K]) => {
    onChange({ ...controls, [key]: value })
  }

  const onSlider = (key: 'coolingWaterFlowPct' | 'feedRatePct' | 'reactorPressurePct') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      update(key, Number(event.target.value))
    }

  return (
    <Card title="Simulation Controls" subtitle="Tune intervention parameters before running predicted outcomes" className="border-primary/20">
      <div className="mb-2 flex items-center justify-between gap-2 border-b border-border/35 pb-2">
        <span className="text-[8px] uppercase tracking-[0.14em] text-cyan-400/90">Operational Inputs</span>
        <div className="flex items-center gap-2">
          <ActionButton className="h-7 px-2 text-[10px] uppercase tracking-[0.12em]" onClick={onReset}>Reset</ActionButton>
          <ActionButton isActive className="h-7 px-2 text-[10px] uppercase tracking-[0.12em]" onClick={onRun} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Simulation'}
          </ActionButton>
        </div>
      </div>

      <div className="grid gap-1.5 xl:grid-cols-3">
        <div className="rounded-md border border-border/70 bg-background/40 p-2 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.06)]">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Cooling Water Flow</p>
            <span className="rounded border border-primary/35 bg-primary/10 px-1 py-0.5 text-[9px] font-semibold text-primary">{formatPct(controls.coolingWaterFlowPct)}</span>
          </div>
          <input type="range" min={-50} max={50} step={1} value={controls.coolingWaterFlowPct} onChange={onSlider('coolingWaterFlowPct')} className="mt-1 w-full accent-blue-500" />
          <MetricLine current={controlValues.cooling.current} next={controlValues.cooling.next} unit="m3/hr" />
        </div>

        <div className="rounded-md border border-border/70 bg-background/40 p-2 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.06)]">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Feed Rate</p>
            <span className="rounded border border-primary/35 bg-primary/10 px-1 py-0.5 text-[9px] font-semibold text-primary">{formatPct(controls.feedRatePct)}</span>
          </div>
          <input type="range" min={-50} max={50} step={1} value={controls.feedRatePct} onChange={onSlider('feedRatePct')} className="mt-1 w-full accent-blue-500" />
          <MetricLine current={controlValues.feed.current} next={controlValues.feed.next} unit="m3/hr" />
        </div>

        <div className="rounded-md border border-border/70 bg-background/40 p-2 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.06)]">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Reactor Pressure</p>
            <span className="rounded border border-primary/35 bg-primary/10 px-1 py-0.5 text-[9px] font-semibold text-primary">{formatPct(controls.reactorPressurePct)}</span>
          </div>
          <input type="range" min={-20} max={20} step={1} value={controls.reactorPressurePct} onChange={onSlider('reactorPressurePct')} className="mt-1 w-full accent-blue-500" />
          <MetricLine current={controlValues.pressure.current} next={controlValues.pressure.next} unit="bar" />
        </div>

        <div className="rounded-md border border-border/70 bg-background/40 p-2 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.06)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Maintenance Action</p>
          <select
            value={controls.maintenanceAction}
            onChange={(e) => update('maintenanceAction', e.target.value as SimulationControlsType['maintenanceAction'])}
            className="mt-1 h-8 w-full rounded border border-border/70 bg-background/70 px-2 text-[11px] text-foreground"
          >
            {MAINTENANCE_ACTIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <p className="mt-1 text-[10px] text-muted-foreground">Impact: <span className="rounded border border-warning/35 bg-warning/10 px-1 py-0.5 text-warning">{MAINTENANCE_ACTIONS.find((item) => item.id === controls.maintenanceAction)?.impact ?? 'Medium'}</span></p>
        </div>

        <div className="rounded-md border border-border/70 bg-background/40 p-2 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.06)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Operator Allocation</p>
          <select
            value={controls.operatorAllocation}
            onChange={(e) => update('operatorAllocation', e.target.value as SimulationControlsType['operatorAllocation'])}
            className="mt-1 h-8 w-full rounded border border-border/70 bg-background/70 px-2 text-[11px] text-foreground"
          >
            {OPERATOR_ALLOCATIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <p className="mt-1 text-[10px] text-muted-foreground">Impact: <span className="rounded border border-warning/35 bg-warning/10 px-1 py-0.5 text-warning">{OPERATOR_ALLOCATIONS.find((item) => item.id === controls.operatorAllocation)?.impact ?? 'Medium'}</span></p>
        </div>

        <div className="rounded-md border border-border/70 bg-background/40 p-2 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.06)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Emergency Preparedness</p>
          <select
            value={controls.emergencyPreparedness}
            onChange={(e) => update('emergencyPreparedness', e.target.value as SimulationControlsType['emergencyPreparedness'])}
            className="mt-1 h-8 w-full rounded border border-border/70 bg-background/70 px-2 text-[11px] text-foreground"
          >
            {EMERGENCY_PREPAREDNESS_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <p className="mt-1 text-[10px] text-muted-foreground">Impact: <span className="rounded border border-warning/35 bg-warning/10 px-1 py-0.5 text-warning">{EMERGENCY_PREPAREDNESS_OPTIONS.find((item) => item.id === controls.emergencyPreparedness)?.impact ?? 'Medium'}</span></p>
        </div>
      </div>
    </Card>
  )
}

import { useMemo, useState } from 'react'

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  CloudSun,
  Droplets,
  Gauge,
  LocateFixed,
  MapPinned,
  Maximize2,
  ShieldAlert,
  Siren,
  Volume2,
  Wind,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

import { DigitalTwinViewport } from '@/components/digitalTwin/DigitalTwinViewport'
import { Panel } from '@/components/cards/Panel'
import {
  EVACUATION_TABS,
  INITIAL_EVACUATION_STATE,
} from '@/modules/evacuationPlanner/services/evacuationData'
import type {
  EvacuationTab,
  RiskZone,
} from '@/modules/evacuationPlanner/services/evacuationTypes'
import { usePlantSimulation } from '@/modules/situationRoom/hooks/usePlantSimulation'
import { usePlantStore } from '@/store/usePlantStore'
import { riskLevelFromScore } from '@/data/plant/types'
import { cn } from '@/utils/cn'

const mapLegend = [
  { label: 'Primary Route', tone: 'bg-cyan-400' },
  { label: 'Alternate Route', tone: 'bg-violet-400' },
  { label: 'Assembly Point', tone: 'bg-emerald-400' },
  { label: 'You Are Here', tone: 'bg-blue-400' },
  { label: 'Hazard Area', tone: 'bg-red-500' },
  { label: 'Blocked Route', tone: 'bg-amber-400' },
]

function buildLiveRiskZones(
  zones: ReturnType<typeof usePlantStore.getState>['zones'],
): RiskZone[] {
  return zones
    .slice()
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((zone) => {
      const level = riskLevelFromScore(zone.riskScore)

      if (level === 'critical' || level === 'high') {
        return {
          id: zone.id,
          label: zone.name,
          level: 'HIGH RISK',
          tone: 'text-red-300',
        }
      }

      if (level === 'medium') {
        return {
          id: zone.id,
          label: zone.name,
          level: 'MEDIUM RISK',
          tone: 'text-amber-300',
        }
      }

      return {
        id: zone.id,
        label: zone.name,
        level: 'LOW RISK',
        tone: 'text-emerald-300',
      }
    })
}

export function EvacuationPlannerLayout() {
  usePlantSimulation(true)

  const [activeTab, setActiveTab] =
    useState<EvacuationTab>('Evacuation Map')
  const [evacuationState, setEvacuationState] = useState(() =>
    structuredClone(INITIAL_EVACUATION_STATE),
  )
  const [mapView, setMapView] = useState<'3D' | '2D'>('3D')
  const [mapZoom, setMapZoom] = useState(1)
  const [mapFullscreen, setMapFullscreen] = useState(false)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [announcementSent, setAnnouncementSent] = useState(false)

  const plantName = usePlantStore((state) => state.plantName)
  const equipment = usePlantStore((state) => state.equipment)
  const zones = usePlantStore((state) => state.zones)
  const riskScores = usePlantStore((state) => state.riskScores)
  const overview = usePlantStore((state) => state.overview)
  const backendConnected = usePlantStore(
    (state) => state.backendConnected,
  )

  const liveRiskZones = useMemo(
    () => buildLiveRiskZones(zones),
    [zones],
  )

  const highestRiskZone = useMemo(
    () =>
      zones.length > 0
        ? zones.reduce((highest, zone) =>
            zone.riskScore > highest.riskScore
              ? zone
              : highest,
          )
        : null,
    [zones],
  )

  const reactor = useMemo(
    () =>
      equipment.find((item) => item.id === 'R-101') ??
      null,
    [equipment],
  )

  const reactorTemperature = reactor?.temperature
  const reactorPressure = reactor?.pressure
  const reactorGas = reactor?.gas

  const currentRiskLevel = riskLevelFromScore(
    riskScores.cri,
  )

  const navigateTo = (module: string) => {
    window.dispatchEvent(
      new CustomEvent('safe:module-change', {
        detail: { module },
      }),
    )
  }

  const advanceEvacuation = () => {
    setSimulationRunning(true)

    setEvacuationState((current) => {
      const moved = Math.min(current.inProgress, 8)
      const evacuated = current.evacuated + moved
      const inProgress = current.inProgress - moved
      const remaining = Math.max(
        0,
        current.totalPeople - evacuated - inProgress,
      )

      return {
        ...current,
        evacuated,
        inProgress,
        remaining,
        percent: Math.round(
          (evacuated / current.totalPeople) * 100,
        ),
        elapsedMinutes: current.elapsedMinutes + 1,
        timeline: [
          ...current.timeline,
          {
            id: `t-${Date.now()}`,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            label: remaining
              ? 'Evacuation in progress'
              : 'Evacuation complete',
            count: remaining,
            severity: remaining ? 'warning' : 'info',
          },
        ],
      }
    })
  }

  const toggleFullscreen = async () => {
    const map = document.getElementById('evacuation-map')

    if (!document.fullscreenElement && map) {
      try {
        await map.requestFullscreen()
        setMapFullscreen(true)
      } catch {
        setMapFullscreen(false)
      }

      return
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }

    setMapFullscreen(false)
  }

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [],
  )

  const currentTime = useMemo(
    () =>
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [],
  )

  const liveRiskZoneLabel =
    highestRiskZone?.name ?? 'No active zone data'

  const emergencyType =
    currentRiskLevel === 'critical' ||
    currentRiskLevel === 'high'
      ? 'Elevated Plant Risk'
      : 'Monitored Plant Conditions'

  const reactorRiskLabel =
    reactor !== null
      ? riskLevelFromScore(
          Math.max(
            reactor.temperature !== undefined
              ? Math.min(
                  100,
                  Math.max(0, reactor.temperature / 5),
                )
              : 0,
            riskScores.cri,
          ),
        )
      : currentRiskLevel

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-cyan-500/25 bg-background/80 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
      <header className="flex items-center justify-between gap-4 border-b border-border/70 bg-slate-950/65 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
            <ShieldAlert className="size-5" />
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-cyan-300">
              S.A.F.E AI
            </div>

            <div className="text-[7px] uppercase tracking-[0.12em] text-slate-400">
              Smart AI for Factory Safety &amp; Emergency
            </div>
          </div>
        </div>

        <div className="min-w-0 text-center">
          <div className="text-[14px] font-black uppercase tracking-[0.2em] text-cyan-300">
            EVACUATION PLANNER
          </div>

          <div className="text-[9px] uppercase tracking-[0.14em] text-slate-400">
            Plan, Simulate &amp; Manage Safe Evacuations
          </div>
        </div>

        <div className="hidden items-center gap-2 text-[10px] text-slate-300 lg:flex">
          <div className="rounded border border-border/70 bg-background/40 px-2 py-1.5">
            <span className="text-slate-400">Plant:</span>{' '}
            {plantName}
          </div>

          <div className="rounded border border-border/70 bg-background/40 px-2 py-1.5">
            {currentDate} {currentTime}
          </div>

          <div
            className={cn(
              'rounded border px-2 py-1.5',
              backendConnected
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300',
            )}
          >
            System Status:{' '}
            {backendConnected ? 'LIVE' : 'SIMULATION'}
          </div>

          <button
            type="button"
            title="Alerts and notifications"
            onClick={() =>
              navigateTo('Alerts & Notifications')
            }
            className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white"
          >
            <Bell className="size-3.5" />
          </button>

          <button
            type="button"
            title="Emergency mode"
            onClick={() => navigateTo('Emergency Mode')}
            className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white"
          >
            <AlertTriangle className="size-3.5" />
          </button>

          <button
            type="button"
            title="Digital Twin"
            onClick={() => navigateTo('Digital Twin')}
            className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white"
          >
            <ShieldAlert className="size-3.5" />
          </button>

          <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] text-slate-300">
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 font-bold text-red-300">
              SH
            </span>
            Safety Head
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] text-slate-300">
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 font-bold text-blue-300">
              A
            </span>
            Administrator
          </div>
        </div>
      </header>

      <div className="border-b border-border/70 bg-cyan-950/20 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {EVACUATION_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all',
                activeTab === tab
                  ? 'border-red-500/50 bg-red-500/10 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.18)]'
                  : 'border-border/70 bg-background/20 text-slate-300 hover:text-white',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-border/70 bg-slate-950/45 px-4 py-3">
        <div className="grid gap-2 md:grid-cols-5">
          <div className="rounded border border-border/70 bg-background/25 px-2 py-2">
            <div className="text-[8px] uppercase tracking-[0.14em] text-slate-400">
              Select Area / Unit
            </div>

            <div className="mt-1 text-[11px] font-semibold text-slate-200">
              {liveRiskZoneLabel}
            </div>
          </div>

          <div className="rounded border border-border/70 bg-background/25 px-2 py-2">
            <div className="text-[8px] uppercase tracking-[0.14em] text-slate-400">
              Emergency Type
            </div>

            <div className="mt-1 text-[11px] font-semibold text-slate-200">
              {emergencyType}
            </div>
          </div>

          <div className="rounded border border-border/70 bg-background/25 px-2 py-2">
            <div className="text-[8px] uppercase tracking-[0.14em] text-slate-400">
              Evacuation Scenario
            </div>

            <div className="mt-1 text-[11px] font-semibold text-slate-200">
              Immediate Evacuation
            </div>
          </div>

          <div className="rounded border border-border/70 bg-background/25 px-2 py-2">
            <div className="text-[8px] uppercase tracking-[0.14em] text-slate-400">
              Known Personnel
            </div>

            <div className="mt-1 text-[11px] font-semibold text-slate-200">
              {overview.onSiteWorkers}
            </div>
          </div>

          <div className="rounded border border-border/70 bg-background/25 px-2 py-2">
            <div className="text-[8px] uppercase tracking-[0.14em] text-slate-400">
              Current CRI
            </div>

            <div className="mt-1 text-[11px] font-semibold text-slate-200">
              {riskScores.cri} / 100
            </div>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-hidden p-3 xl:grid-cols-[minmax(0,1.8fr)_360px]">
        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <Panel className="border-cyan-500/30 bg-slate-950/75 p-0">
            <div className="flex items-center justify-between border-b border-border/80 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                {activeTab.toUpperCase()}
              </div>

              <div className="flex items-center gap-2 text-[9px] text-slate-300">
                <button
                  type="button"
                  onClick={() => setMapView('3D')}
                  className={cn(
                    'rounded border border-border/70 bg-background/40 px-2 py-1',
                    mapView === '3D' &&
                      'border-cyan-400/60 text-cyan-200',
                  )}
                >
                  3D
                </button>

                <button
                  type="button"
                  onClick={() => setMapView('2D')}
                  className={cn(
                    'rounded border border-border/70 bg-background/40 px-2 py-1',
                    mapView === '2D' &&
                      'border-cyan-400/60 text-cyan-200',
                  )}
                >
                  2D
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('Routes & Zones')}
                  className="rounded border border-border/70 bg-background/40 px-2 py-1"
                >
                  Locate
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMapZoom((value) =>
                      Math.min(1.6, value + 0.1),
                    )
                  }
                  className="flex size-6 items-center justify-center rounded border border-border/70 bg-background/40"
                >
                  <ZoomIn className="size-3" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMapZoom((value) =>
                      Math.max(0.8, value - 0.1),
                    )
                  }
                  className="flex size-6 items-center justify-center rounded border border-border/70 bg-background/40"
                >
                  <ZoomOut className="size-3" />
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className={cn(
                    'flex size-6 items-center justify-center rounded border border-border/70 bg-background/40',
                    mapFullscreen &&
                      'border-cyan-400/60 text-cyan-200',
                  )}
                >
                  <Maximize2 className="size-3" />
                </button>

                <button
                  type="button"
                  onClick={advanceEvacuation}
                  className="rounded bg-cyan-500/15 px-2 py-1 text-cyan-200"
                >
                  {simulationRunning
                    ? 'Advance Evacuation'
                    : 'Simulate Evacuation'}
                </button>
              </div>
            </div>

            <div
              id="evacuation-map"
              className={cn(
                'relative h-107.5 overflow-hidden rounded-t-md bg-slate-950',
                mapFullscreen && 'h-screen',
              )}
            >
              <div
                className="absolute inset-0 origin-center transition-transform duration-200 [&>div]:h-107.5! [&>div]:min-h-107.5!"
                style={{
                  transform: `scale(${mapZoom})`,
                }}
              >
                <DigitalTwinViewport
                  viewMode={
                    mapView === '3D'
                      ? 'Plant View'
                      : 'Zone View'
                  }
                  selectedZone="ZONE C"
                  showChrome
                  showLabels
                />
              </div>

              <div className="pointer-events-none absolute left-3 top-3 z-40 flex items-center gap-2 rounded border border-border/70 bg-slate-950/80 px-2 py-1.5 text-[9px] text-slate-300">
                <MapPinned className="size-3.5 text-cyan-300" />
                {liveRiskZoneLabel} • Reactor Corridor
              </div>

              <div className="pointer-events-none absolute bottom-3 left-3 z-40 w-50 rounded border border-border/80 bg-slate-950/80 p-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">
                  Legend
                </div>

                <div className="mt-2 space-y-1.5 text-[9px] text-slate-200">
                  {mapLegend.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2"
                    >
                      <span
                        className={cn(
                          'inline-flex size-2.5 rounded-full',
                          item.tone,
                        )}
                      />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute right-3 top-3 z-40 flex items-center gap-2 rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-red-200">
                <Siren className="size-3.5" />
                {currentRiskLevel === 'critical' ||
                currentRiskLevel === 'high'
                  ? 'Hazard Mitigation Active'
                  : 'Hazard Monitoring Active'}
              </div>
            </div>
          </Panel>

          <div className="grid gap-3 md:grid-cols-4">
            {[
              {
                label: 'Estimated Time',
                value: `${Math.floor(
                  evacuationState.estimatedTimeMinutes / 60,
                )
                  .toString()
                  .padStart(2, '0')}:${(
                  evacuationState.estimatedTimeMinutes % 60
                )
                  .toString()
                  .padStart(2, '0')} min`,
                icon: Clock3,
                tone: 'text-cyan-300',
              },
              {
                label: 'Time Elapsed',
                value: `${Math.floor(
                  evacuationState.elapsedMinutes / 60,
                )
                  .toString()
                  .padStart(2, '0')}:${(
                  evacuationState.elapsedMinutes % 60
                )
                  .toString()
                  .padStart(2, '0')} min`,
                icon: Gauge,
                tone: 'text-emerald-300',
              },
              {
                label: 'Evacuation Progress',
                value: `${evacuationState.percent}%`,
                icon: CheckCircle2,
                tone: 'text-amber-300',
              },
              {
                label: 'Avg. Movement Speed',
                value: '1.8 m/s',
                icon: LocateFixed,
                tone: 'text-violet-300',
              },
            ].map(
              ({ label, value, icon: Icon, tone }) => (
                <Panel
                  key={label}
                  className="border-cyan-500/30 bg-slate-950/70 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[8px] uppercase tracking-[0.14em] text-slate-400">
                      {label}
                    </div>

                    <Icon className={cn('size-4', tone)} />
                  </div>

                  <div className="mt-3 text-[22px] font-black text-white">
                    {value}
                  </div>
                </Panel>
              ),
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                EVACUATION STATUS
              </div>

              <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                {backendConnected ? 'Backend Live' : 'Simulation'}
              </span>
            </div>

            <div className="relative mx-auto mb-3 flex size-28 items-center justify-center rounded-full border-[6px] border-cyan-500/40 bg-slate-900/70 shadow-[0_0_22px_rgba(34,211,238,0.18)]">
              <div className="absolute inset-2 rounded-full border border-slate-700/70" />

              <div className="relative text-center">
                <div className="text-[22px] font-black text-cyan-300">
                  {evacuationState.percent}%
                </div>

                <div className="text-[9px] uppercase tracking-[0.12em] text-slate-300">
                  Evacuation Simulation
                </div>
              </div>
            </div>

            <div className="mb-2 rounded border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-[8px] leading-4 text-amber-200">
              Evacuation progress and head counts are currently
              simulation data. Worker-location tracking is not yet
              connected to the backend.
            </div>

            <div className="space-y-2 text-[10px]">
              <div className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                <span className="text-slate-400">Evacuated</span>

                <span className="font-bold text-emerald-300">
                  {evacuationState.evacuated}
                </span>
              </div>

              <div className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                <span className="text-slate-400">In Progress</span>

                <span className="font-bold text-amber-300">
                  {evacuationState.inProgress}
                </span>
              </div>

              <div className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                <span className="text-slate-400">Remaining</span>

                <span className="font-bold text-red-300">
                  {evacuationState.remaining}
                </span>
              </div>

              <div className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                <span className="text-slate-400">Known Personnel</span>

                <span className="font-bold text-cyan-300">
                  {overview.onSiteWorkers}
                </span>
              </div>
            </div>
          </Panel>

          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                EVACUATION TIMELINE
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab('Routes & Zones')
                }
                className="text-[9px] text-cyan-300"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {evacuationState.timeline.map((entry) => (
                <div
                  key={entry.id}
                  className="border-l border-cyan-500/40 pl-2.5"
                >
                  <div className="text-[8px] uppercase tracking-[0.12em] text-slate-400">
                    {entry.time}
                  </div>

                  <div className="mt-1 text-[10px] font-semibold text-slate-100">
                    {entry.label}
                  </div>

                  {entry.count ? (
                    <div className="text-[9px] text-cyan-300">
                      {entry.count} People
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                HEAD COUNT BY ASSEMBLY POINT
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveTab('Assembly Points')
                }
                className="text-[9px] text-cyan-300"
              >
                View All
              </button>
            </div>

            <div className="mb-2 rounded border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-[8px] text-amber-200">
              Assembly-point occupancy is simulation data until
              worker-location and assembly tracking are available.
            </div>

            <div className="space-y-2">
              {evacuationState.assemblyPoints.map(
                (row) => {
                  const progress =
                    (row.current / row.goal) * 100

                  return (
                    <div
                      key={row.id}
                      className="rounded border border-border/70 bg-background/25 p-2"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2 text-[9px] text-slate-200">
                        <span>{row.label}</span>

                        <span>
                          {row.current} / {row.goal}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            row.tone,
                          )}
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                },
              )}

              <div className="mt-2 flex items-center justify-between rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-200">
                <span>Total</span>

                <span>
                  {evacuationState.assemblyPoints.reduce(
                    (sum, point) => sum + point.current,
                    0,
                  )}{' '}
                  /{' '}
                  {evacuationState.assemblyPoints.reduce(
                    (sum, point) => sum + point.goal,
                    0,
                  )}
                </span>
              </div>
            </div>
          </Panel>

          <Panel className="border-red-500/30 bg-red-500/10 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-200">
                EVACUATION ANNOUNCEMENT
              </div>

              <Volume2 className="size-4 text-red-300" />
            </div>

            <button
              type="button"
              onClick={() => setAnnouncementSent(true)}
              className="w-full rounded border border-red-500/40 bg-slate-950/45 p-3 text-left hover:border-red-300/60"
            >
              <div className="mb-2 flex items-center gap-2 text-red-200">
                <Siren className="size-4" />

                <span className="text-[9px] font-bold uppercase tracking-[0.14em]">
                  Emergency Broadcast
                </span>
              </div>

              <p className="text-[11px] leading-5 text-red-100">
                Attention! This is an emergency. Please follow
                the evacuation routes and proceed to the nearest
                assembly point immediately.
              </p>

              <span className="mt-2 block text-[8px] uppercase tracking-[0.12em] text-red-300">
                {announcementSent
                  ? 'Broadcast simulated'
                  : 'Simulate announcement'}
              </span>
            </button>
          </Panel>
        </div>
      </div>

      <div className="grid gap-3 border-t border-border/70 bg-slate-950/50 p-3 xl:grid-cols-[1.4fr_1fr_1.1fr]">
        <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
            RISK ZONES
          </div>

          <div className="space-y-2">
            {(liveRiskZones.length > 0
              ? liveRiskZones
              : [
                  {
                    id: 'no-zone-data',
                    label: 'No live zone data',
                    level: 'LOW RISK' as const,
                    tone: 'text-slate-400',
                  },
                ]
            ).map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-2"
              >
                <span className="text-[10px] text-slate-200">
                  {zone.label}
                </span>

                <span
                  className={cn(
                    'rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]',
                    zone.level === 'HIGH RISK'
                      ? 'border-red-500/40 bg-red-500/10 text-red-300'
                      : zone.level === 'MEDIUM RISK'
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                        : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
                  )}
                >
                  {zone.level}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
            LIVE PLANT CONDITIONS
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="size-4 text-cyan-300" />

                <span className="text-[10px] text-slate-300">
                  CRI
                </span>
              </div>

              <span className="text-[10px] font-bold text-slate-200">
                {riskScores.cri} / 100
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun className="size-4 text-cyan-300" />

                <span className="text-[10px] text-slate-300">
                  Risk Level
                </span>
              </div>

              <span className="text-[10px] font-bold uppercase text-slate-200">
                {currentRiskLevel}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="size-4 text-cyan-300" />

                <span className="text-[10px] text-slate-300">
                  Backend
                </span>
              </div>

              <span
                className={cn(
                  'text-[10px] font-bold',
                  backendConnected
                    ? 'text-emerald-300'
                    : 'text-amber-300',
                )}
              >
                {backendConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="size-4 text-cyan-300" />

                <span className="text-[10px] text-slate-300">
                  Known Personnel
                </span>
              </div>

              <span className="text-[10px] font-bold text-slate-200">
                {overview.onSiteWorkers}
              </span>
            </div>
          </div>
        </Panel>

        <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
              PLANT CONTEXT
            </div>

            <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-300">
              {backendConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          <div className="space-y-3 text-[10px] text-slate-200">
            <div className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-2">
              <span>{plantName}</span>

              <span className="text-cyan-300">
                {liveRiskZoneLabel}
              </span>
            </div>

            <div className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-2">
              <span>R-101 Reactor</span>

              <span className="text-red-300">
                {reactorRiskLabel.toUpperCase()}
              </span>
            </div>

            {reactorTemperature !== undefined ? (
              <div className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-2">
                <span>Temperature</span>

                <span className="text-amber-300">
                  {reactorTemperature.toFixed(1)} °C
                </span>
              </div>
            ) : null}

            {reactorPressure !== undefined ? (
              <div className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-2">
                <span>Pressure</span>

                <span className="text-cyan-300">
                  {reactorPressure.toFixed(1)} bar
                </span>
              </div>
            ) : null}

            {reactorGas !== undefined ? (
              <div className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-2">
                <span>Gas</span>

                <span className="text-red-300">
                  {reactorGas.toFixed(1)} % LEL
                </span>
              </div>
            ) : null}

            <div className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-2">
              <span>Evacuation Engine</span>

              <span className="text-amber-300">
                Simulation
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
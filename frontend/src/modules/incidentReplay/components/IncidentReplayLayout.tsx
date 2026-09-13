import { useState } from 'react'
import {
  Bell,
  CircleHelp,
  Download,
  Droplets,
  Flame,
  Fullscreen,
  Minus,
  Pause,
  Play,
  Plus,
  Settings,
  ShieldAlert,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import { Panel } from '@/components/cards/Panel'
import { REPLAY_SHORTCUTS, REPLAY_TABS } from '@/modules/incidentReplay/services/incidentReplayData'
import { useIncidentReplay } from '@/modules/incidentReplay/hooks/useIncidentReplay'
import { cn } from '@/utils/cn'

const statusBadgeClass: Record<string, string> = {
  completed: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  pending: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
}

function RingMetric({ label, value, tone }: { label: string; value: number; tone: string }) {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex size-16 items-center justify-center">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90">
          <circle cx="40" cy="40" r={radius} stroke="rgba(148, 163, 184, 0.28)" strokeWidth="7" fill="transparent" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={tone}
            strokeWidth="7"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-[12px] font-bold text-white">{value}%</div>
        </div>
      </div>
      <div className="text-[9px] uppercase tracking-[0.12em] text-slate-300">{label}</div>
    </div>
  )
}

export function IncidentReplayLayout() {
  const {
    activeTab,
    setActiveTab,
    selectedShortcut,
    setSelectedShortcut,
    viewMode,
    setViewMode,
    layersVisible,
    setLayersVisible,
    isPlaying,
    setIsPlaying,
    currentSecond,
    totalDurationSeconds,
    playbackSpeed,
    setPlaybackSpeed,
    currentTimestamp,
    endTimestamp,
    progressPercent,
    currentEvent,
    selectedCameraId,
    setSelectedCameraId,
    actions,
    updateActionStatus,
    notes,
    noteDraft,
    setNoteDraft,
    handleAddNote,
    handleDownloadReport,
    handleTimelineChange,
    jumpToEvent,
    togglePlayback,
    replayData,
    isLoading,
    backendError,
  } = useIncidentReplay()

  const [noteInputOpen, setNoteInputOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const navigateTo = (module: string) => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module } }))
  }

  const toggleFullscreen = async () => {
    const replayView = document.getElementById('incident-replay-view')
    if (!document.fullscreenElement && replayView) {
      try {
        await replayView.requestFullscreen()
        setIsFullscreen(true)
      } catch {
        setIsFullscreen(false)
      }
      return
    }

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch {
        setIsFullscreen(true)
      }
    }
    setIsFullscreen(false)
  }

  const renderTabContent = () => {
    if (activeTab === 'Timeline') {
      return (
        <div className="space-y-3 rounded border border-border/70 bg-background/25 p-3">
          {replayData.events.map((event) => (
            <div key={event.id} className="relative flex gap-3 pb-2">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'mt-1 size-2.5 rounded-full border',
                    event.severity === 'critical'
                      ? 'border-red-300 bg-red-500'
                      : event.severity === 'warning'
                        ? 'border-amber-300 bg-amber-500'
                        : 'border-cyan-300 bg-cyan-500',
                  )}
                />
                {event.id !== replayData.events[replayData.events.length - 1]?.id ? (
                  <div className="mt-1 h-full w-px bg-red-500/30" />
                ) : null}
              </div>
              <div className="flex-1">
                <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">{event.time}</div>
                <div className="text-[10px] font-semibold text-white">{event.label}</div>
                <div className="text-[9px] text-slate-300">{event?.detail ?? 'Unavailable'}</div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'Sensor Data') {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {replayData.sensorReadings.map((sensor) => (
            <div key={sensor.id} className="rounded border border-border/70 bg-background/25 p-3">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.12em] text-slate-400">
                <span>{sensor.label}</span>
                <span className={cn('font-semibold', sensor.tone)}>{sensor.status}</span>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-[20px] font-bold text-white">{sensor.value}</span>
                <span className="pb-1 text-[9px] text-slate-400">{sensor.unit}</span>
              </div>
              <div className="mt-3 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ value: 30 }, { value: 42 }, { value: 58 }, { value: 65 }, { value: 70 }, { value: 85 }, { value: 96 }]}>
                    <defs>
                      <linearGradient id={`sensor-${sensor.id}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={sensor.tone.includes('red') ? '#ef4444' : sensor.tone.includes('amber') ? '#f59e0b' : '#22d3ee'} stopOpacity={0.7} />
                        <stop offset="100%" stopColor={sensor.tone.includes('red') ? '#ef4444' : sensor.tone.includes('amber') ? '#f59e0b' : '#22d3ee'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke={sensor.tone.includes('red') ? '#ef4444' : sensor.tone.includes('amber') ? '#f59e0b' : '#22d3ee'} fill={`url(#sensor-${sensor.id})`} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'Actions Taken') {
      return (
        <div className="space-y-2">
          {actions.map((action) => (
            <button
              type="button"
              key={action.id}
              onClick={() => updateActionStatus(action.id)}
              className="flex w-full items-center justify-between gap-2 rounded border border-border/70 bg-background/25 px-2 py-2 text-left hover:border-red-500/40"
            >
              <span className="text-[10px] text-white">{action.label}</span>
              <span className={cn('rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', statusBadgeClass[action.status.toLowerCase() as keyof typeof statusBadgeClass])}>
                {action.status}
              </span>
            </button>
          ))}
        </div>
      )
    }

    if (activeTab === 'Analysis') {
      return (
        <div className="space-y-3 rounded border border-border/70 bg-background/25 p-3 text-[10px] text-slate-300">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">Root-cause assessment</div>
          <p>Reactor R-101 showed sustained temperature drift caused by reduced cooling-water flow. The valve V-204 restriction reduced the effective heat exchange rate and pushed the system into a thermal anomaly window.</p>
          <p>Severity escalated due to the overlap of hot work activity, tight pressure bands, and rising gas concentration. The automated isolation and cooling response prevented escalation into a broader process incident.</p>
        </div>
      )
    }

    if (activeTab === 'Lessons Learned') {
      return (
        <div className="space-y-3 rounded border border-border/70 bg-background/25 p-3 text-[10px] text-slate-300">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">Lessons learned</div>
          <ul className="list-disc space-y-2 pl-4">
            <li>Need to enhance predictive maintenance for the cooling system and inspect valve V-204 on a more frequent cycle.</li>
            <li>Increase automated cross-monitoring between temperature and flow sensors to catch early drift.</li>
            <li>Review evacuation choreography across Zone C to reduce response latency during hot-work conditions.</li>
          </ul>
        </div>
      )
    }

    return (
      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[1.7fr_0.9fr]">
        <Panel className="border-cyan-500/30 bg-slate-950/70 p-0">
          <div className="flex items-center justify-between border-b border-red-500/30 px-3 py-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">3D REPLAY VIEW</div>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-300">
              {['3D', '2D', 'Layers', '+', '-', 'Fullscreen'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === '3D') setViewMode('3D')
                    if (item === '2D') setViewMode('2D')
                    if (item === 'Layers') setLayersVisible((value) => !value)
                    if (item === '+') setPlaybackSpeed((v) => Math.min(4, Number((v + 0.5).toFixed(1))) )
                    if (item === '-') setPlaybackSpeed((v) => Math.max(0.5, Number((v - 0.5).toFixed(1))) )
                    if (item === 'Fullscreen') toggleFullscreen()
                  }}
                  className={cn(
                    'rounded border border-border/70 bg-background/40 px-2 py-1',
                    item === (viewMode === '3D' ? '3D' : item === '2D' ? '2D' : '') && 'border-cyan-500/50 text-cyan-300',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div id="incident-replay-view" className={cn('relative h-[326px] overflow-hidden bg-[radial-gradient(circle_at_30%_18%,rgba(37,99,235,0.15),transparent_25%),linear-gradient(180deg,#08131f,#0d1b2d_55%,#0b1525)]', isFullscreen && 'h-screen')}>
            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:30px_30px]" />

            <div className="absolute left-[18%] top-[18%] h-16 w-16 rounded-md border border-slate-500/70 bg-slate-800/70" />
            <div className="absolute left-[34%] top-[28%] h-20 w-16 rounded-md border border-slate-500/70 bg-slate-700/70" />
            <div className="absolute left-[60%] top-[22%] h-16 w-20 rounded-md border border-slate-500/70 bg-slate-800/70" />
            <div className="absolute left-[62%] top-[52%] h-14 w-14 rounded-md border border-slate-500/70 bg-slate-800/70" />
            <div className="absolute left-[50%] top-[45%] h-[82px] w-[82px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/60 bg-red-600/25 shadow-[0_0_42px_rgba(239,68,68,0.42)]" />
            <div className="absolute left-[50%] top-[45%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-md border border-red-500/50 bg-red-500/15 px-3 py-2 text-center shadow-[0_0_26px_rgba(239,68,68,0.4)]">
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-red-200">R-101</span>
              <span className="text-[11px] font-bold text-red-300">{currentEvent?.detail ?? 'Unavailable'}</span>
            </div>
            <div className="absolute inset-x-[16%] bottom-[18%] h-14 rounded-full border border-red-500/35 bg-red-500/10 blur-md" />
            <div className="absolute left-[22%] top-[54%] h-0.5 w-[32%] rotate-[-18deg] border-t border-red-500/70" />
            <div className="absolute left-[48%] top-[50%] h-[22%] w-0.5 border-l border-red-500/70" />
            <div className="absolute left-[32%] top-[66%] h-0.5 w-[24%] rotate-[18deg] border-t border-amber-500/70" />
            <div className="absolute left-[62%] top-[64%] h-0.5 w-[16%] rotate-[30deg] border-t border-cyan-500/70" />

            <div className="absolute left-[26%] top-[70%] rounded border border-emerald-500/50 bg-emerald-500/10 px-2 py-1 text-[9px] font-medium text-emerald-300">Assembly Point A</div>
            <div className="absolute left-[62%] top-[72%] rounded border border-emerald-500/50 bg-emerald-500/10 px-2 py-1 text-[9px] font-medium text-emerald-300">Safe Zone</div>
            <div className="absolute left-[16%] top-[42%] rounded border border-red-500/50 bg-red-500/10 px-2 py-1 text-[9px] font-medium text-red-300">Evacuation Route</div>
            <div className="absolute left-[72%] top-[43%] rounded border border-cyan-500/50 bg-cyan-500/10 px-2 py-1 text-[9px] font-medium text-cyan-300">Team Marker</div>
            <div className="absolute left-[12%] top-[62%] flex items-center gap-1 rounded border border-amber-500/50 bg-amber-500/10 px-2 py-1 text-[9px] font-medium text-amber-300"><Flame className="size-3" /> Fire Hydrant</div>
            <div className="absolute left-[74%] top-[56%] flex items-center gap-1 rounded border border-emerald-500/50 bg-emerald-500/10 px-2 py-1 text-[9px] font-medium text-emerald-300"><Droplets className="size-3" /> First Aid</div>

            {layersVisible ? (
              <>
                <div className="absolute left-[18%] top-[12%] rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[8px] text-red-100">10:18:02 AM</div>
                <div className="absolute left-[44%] top-[20%] rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[8px] text-red-100">High Temperature</div>
                <div className="absolute left-[50%] top-[30%] rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-[8px] text-red-100">Detected in R-101</div>
                <div className="absolute left-[62%] top-[34%] rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[8px] text-amber-100">92°C</div>
                <div className="absolute left-[18%] top-[38%] rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[8px] text-cyan-100">10:19:12 AM</div>
                <div className="absolute left-[58%] top-[66%] rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[8px] text-cyan-100">10:20:45 AM</div>
                <div className="absolute left-[28%] top-[28%] rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[8px] text-emerald-100">Cooling System Activated</div>
              </>
            ) : null}

            <div className="absolute bottom-3 left-3 w-[170px] rounded border border-border/80 bg-slate-950/70 p-2">
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">Legend</div>
              <div className="mt-2 space-y-1 text-[9px] text-slate-300">
                {['Incident Location', 'Evacuation Routes', 'Assembly Point', 'On Site Team', 'Fire Hydrant', 'Camera'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className={cn('inline-flex size-2 rounded-full', item === 'Incident Location' ? 'bg-red-500' : item === 'Evacuation Routes' ? 'bg-cyan-400' : item === 'Assembly Point' ? 'bg-emerald-400' : item === 'On Site Team' ? 'bg-blue-400' : item === 'Fire Hydrant' ? 'bg-amber-400' : 'bg-violet-400')} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-red-500/20 bg-slate-950/60 p-3">
            <div className="mb-2 flex items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-slate-300">
              <button type="button" className="flex items-center gap-1 rounded border border-border/70 bg-background/40 px-2 py-1" onClick={() => handleTimelineChange(Math.max(0, currentSecond - 15))}>
                <SkipBack className="size-3" /> Previous
              </button>
              <button type="button" className="flex items-center gap-1 rounded border border-border/70 bg-background/40 px-2 py-1" onClick={togglePlayback}>
                {isPlaying ? <Pause className="size-3" /> : <Play className="size-3" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button type="button" className="flex items-center gap-1 rounded border border-border/70 bg-background/40 px-2 py-1" onClick={() => handleTimelineChange(Math.min(totalDurationSeconds, currentSecond + 15))}>
                Next <SkipForward className="size-3" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[9px] text-slate-300">{currentTimestamp}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={progressPercent}
                onChange={(event) => handleTimelineChange((Number(event.target.value) / 100) * totalDurationSeconds)}
                className="h-1.5 flex-1 cursor-pointer accent-red-500"
              />
              <span className="text-[9px] text-slate-300">{endTimestamp}</span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-slate-300">
                <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(Number(e.target.value))} className="rounded border border-border/70 bg-background/40 px-2 py-1 text-slate-200">
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
                <button type="button" onClick={() => { handleTimelineChange(totalDurationSeconds); setIsPlaying(false) }} className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-red-300">Live</button>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-300">
                <button type="button" className="rounded border border-border/70 bg-background/40 p-1.5" onClick={() => setViewMode('3D')}><Plus className="size-3" /></button>
                <button type="button" className="rounded border border-border/70 bg-background/40 p-1.5" onClick={() => setViewMode('2D')}><Minus className="size-3" /></button>
                <button type="button" onClick={toggleFullscreen} className={cn('rounded border border-border/70 bg-background/40 p-1.5', isFullscreen && 'border-cyan-500/50 text-cyan-300')}><Fullscreen className="size-3" /></button>
              </div>
            </div>
          </div>
        </Panel>

        <div className="flex min-h-0 flex-col gap-3">
          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">INCIDENT TIMELINE</div>
              <button type="button" onClick={() => setActiveTab('Timeline')} className="text-[9px] text-cyan-300">View All</button>
            </div>
            <div className="space-y-2 pl-2">
              {replayData.events.map((event) => (
                <div key={event.id} className="relative flex gap-3">
                  <div className={cn('absolute left-[6px] top-5 bottom-[-8px] w-px bg-red-500/30', event.id === replayData.events[replayData.events.length - 1]?.id && 'hidden')} />
                  <div className={cn('relative mt-1 size-3 rounded-full border', event.severity === 'critical' ? 'border-red-300 bg-red-500' : event.severity === 'warning' ? 'border-amber-300 bg-amber-500' : 'border-cyan-300 bg-cyan-500')} />
                  <div className="flex-1 pb-2">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{event.time}</div>
                    <div className="text-[10px] text-white">{event.label}</div>
                    <div className="text-[9px] text-slate-300">{event?.detail ?? 'Unavailable'}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">INCIDENT SUMMARY</div>
            <p className="text-[10px] leading-5 text-slate-300">{replayData.summary}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {replayData.metrics.slice(0, 6).map((metric) => (
                <div key={metric.id} className="rounded border border-border/70 bg-background/25 p-2">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">{metric.label}</div>
                  <div className={cn('mt-2 text-[16px] font-bold', metric.tone)}>{metric.value}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-cyan-500/30 bg-background/80 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
      <header className="flex items-center justify-between gap-4 border-b border-cyan-500/25 bg-slate-950/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-cyan-300">SAFE.AI</div>
            <div className="text-[7px] uppercase tracking-[0.12em] text-slate-400">Smart AI for Factory Safety &amp; Emergency</div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[14px] font-black uppercase tracking-[0.18em] text-cyan-300">INCIDENT REPLAY</div>
          <div className="text-[9px] uppercase tracking-[0.14em] text-slate-400">Review, Analyze &amp; Learn from Safety Incidents</div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-300">
          <div className="rounded border border-border/70 bg-background/40 px-2 py-1.5"><span className="text-slate-400">Plant:</span> {replayData.plantName}</div>
          <div className="rounded border border-border/70 bg-background/40 px-2 py-1.5"><span className="text-slate-400">History:</span> {replayData.startTime}</div>
          <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1.5 text-red-300">System Status: {isLoading ? 'LOADING' : backendError ? 'UNAVAILABLE' : 'READ-ONLY'}</div>
          <button type="button" title="Alerts and notifications" onClick={() => navigateTo('Alerts & Notifications')} className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white"><Bell className="size-3.5" /></button>
          <button type="button" title="AI Copilot" onClick={() => navigateTo('AI Copilot')} className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white"><CircleHelp className="size-3.5" /></button>
          <button type="button" title="System settings" onClick={() => navigateTo('System Settings')} className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white"><Settings className="size-3.5" /></button>
        </div>
      </header>

      <div className="flex flex-col gap-3 p-3">
        <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">{replayData.incidentType} - ID: {replayData.incidentId}</div>
            <button type="button" onClick={handleDownloadReport} className="flex items-center gap-2 rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-200 hover:bg-cyan-500/15">
              <Download className="size-3.5" /> Download Report
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-6">
            {[
              { label: 'Replay Type', value: replayData.incidentType },
              { label: 'Plant', value: replayData.location },
              { label: 'Risk Level', value: replayData.severity },
              { label: 'Start Time', value: replayData.startTime },
              { label: 'End Time', value: replayData.endTime },
              { label: 'Duration', value: replayData.duration },
            ].map((item) => (
              <div key={item.label} className="rounded border border-border/70 bg-background/25 p-2">
                <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-[11px] font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded border border-border/70 bg-background/25 px-3 py-2">
            <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">Status</div>
            <div className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-300">{replayData.status}</div>
          </div>
        </Panel>

        <div className="flex flex-wrap gap-2">
          {REPLAY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] transition',
                activeTab === tab
                  ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200'
                  : 'border-border/70 bg-background/25 text-slate-300 hover:border-cyan-500/40',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 gap-3 xl:grid-cols-[1.7fr_0.9fr]">
          <div className="flex min-h-0 flex-col gap-3">{renderTabContent()}</div>

          <div className="flex min-h-0 flex-col gap-3">
            <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">INCIDENT TIMELINE</div>
                <button type="button" onClick={() => setActiveTab('Timeline')} className="text-[9px] text-cyan-300">View All</button>
              </div>

              <div className="space-y-2 pl-2">
                {replayData.events.map((event, index) => (
                  <div key={event.id} className="relative flex gap-3">
                    {index !== replayData.events.length - 1 ? <div className="absolute left-[6px] top-5 bottom-[-8px] w-px bg-red-500/30" /> : null}
                    <div className={cn('relative mt-1 size-3 rounded-full border', event.severity === 'critical' ? 'border-red-300 bg-red-500' : event.severity === 'warning' ? 'border-amber-300 bg-amber-500' : 'border-cyan-300 bg-cyan-500')} />
                    <div className="flex-1 pb-2">
                      <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{event.time}</div>
                      <div className="text-[10px] text-white">{event.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">INCIDENT SUMMARY</div>
              <p className="text-[10px] leading-5 text-slate-300">{replayData.summary}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {replayData.metrics.map((metric) => (
                  <div key={metric.id} className="rounded border border-border/70 bg-background/25 p-2">
                    <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">{metric.label}</div>
                    <div className={cn('mt-2 text-[15px] font-bold', metric.tone)}>{metric.value}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-5">
          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">SENSOR DATA OVERVIEW</div>
            <div className="space-y-3 text-[10px]">
              {replayData.sensorReadings.map((sensor) => (
                <div key={sensor.id} className="rounded border border-border/70 bg-background/25 p-2">
                  <div className="flex items-center justify-between gap-2 text-slate-400">
                    <span>{sensor.label}</span>
                    <span className={cn('font-semibold', sensor.tone)}>{sensor.status}</span>
                  </div>
                  <div className="mt-2 text-[18px] font-bold text-white">{sensor.value}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">KEY METRICS (EVENT DURATION)</div>
            <div className="grid grid-cols-2 gap-3">
              <RingMetric label="CRI" value={Number(replayData.metrics.find((metric) => metric.id === 'peak-cri')?.value ?? 0)} tone="#ef4444" />
              <RingMetric label="PRI" value={Number(replayData.metrics.find((metric) => metric.id === 'peak-pri')?.value ?? 0)} tone="#f59e0b" />
              <RingMetric label="ERI" value={Number(replayData.metrics.find((metric) => metric.id === 'peak-eri')?.value ?? 0)} tone="#f59e0b" />
              <RingMetric label="SRI" value={Number(replayData.metrics.find((metric) => metric.id === 'peak-sri')?.value ?? 0)} tone="#22d3ee" />
            </div>
          </Panel>

          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">ACTIONS TAKEN</div>
            <div className="space-y-2">
              {actions.map((action) => (
                <div key={action.id} className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-1.5">
                  <span className="text-[9px] text-white">{action.label}</span>
                  <span className={cn('rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', statusBadgeClass[action.status.toLowerCase() as keyof typeof statusBadgeClass])}>{action.status}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">CAMERA FOOTAGE (INCIDENT DURATION)</div>
            <div className="grid grid-cols-2 gap-2">
              {replayData.cameraClips.map((clip) => (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => {
                    setSelectedCameraId(clip.id)
                    const eventId = clip.id === 'cam-101' ? 'evt-1' : clip.id === 'cam-102' ? 'evt-4' : clip.id === 'cam-103' ? 'evt-7' : 'evt-8'
                    jumpToEvent(eventId)
                  }}
                  className={cn(
                    'rounded border border-border/70 bg-background/25 p-2 text-left transition',
                    selectedCameraId === clip.id && 'border-cyan-500/50 bg-cyan-500/10',
                  )}
                >
                  <div className="mb-2 flex h-14 items-center justify-center rounded border border-border/70 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent_60%)] text-cyan-200">
                    <Play className="size-4" />
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">{clip.label}</div>
                  <div className="mt-1 text-[9px] text-white">{clip.time}</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">INCIDENT NOTES</div>
              <button type="button" onClick={() => setNoteInputOpen((value) => !value)} className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-cyan-200">Add Note</button>
            </div>
            <div className="space-y-2 text-[9px] text-slate-300">
              {notes.map((note) => (
                <div key={note.id} className="rounded border border-border/70 bg-background/25 p-2">
                  <div className="text-slate-300">{note.text}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.1em] text-slate-500">{note.createdAt}</div>
                </div>
              ))}
            </div>
            {noteInputOpen ? (
              <div className="mt-3 space-y-2">
                <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} rows={3} className="w-full rounded border border-border/70 bg-background/25 p-2 text-[9px] text-white outline-none ring-0 placeholder:text-slate-500" placeholder="Add a note..." />
                <button type="button" onClick={handleAddNote} className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-300">Save Note</button>
              </div>
            ) : null}
          </Panel>
        </div>

        <Panel className="border-cyan-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">REPLAY SHORTCUT</div>
          <div className="flex flex-wrap gap-2">
            {REPLAY_SHORTCUTS.map((shortcut) => (
              <button
                key={shortcut}
                type="button"
                onClick={() => setSelectedShortcut(shortcut)}
                className={cn(
                  'rounded border px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] transition',
                  selectedShortcut === shortcut
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200'
                    : 'border-border/70 bg-background/25 text-slate-300',
                )}
              >
                {shortcut}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

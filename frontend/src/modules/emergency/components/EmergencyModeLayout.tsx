import { useMemo, useState } from 'react'

import {
  AlertTriangle,
  Bell,
  ChevronRight,
  CircleHelp,
  CloudSun,
  Droplets,
  Flame,
  Megaphone,
  Phone,
  Settings,
  ShieldAlert,
  Users,
  Wind,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Panel } from '@/components/cards/Panel'
import { useEmergencyMode } from '@/modules/emergency/hooks/useEmergencyMode'
import { cn } from '@/utils/cn'

const statusBadgeClass: Record<string, string> = {
  critical: 'border-red-500/40 bg-red-500/10 text-red-300',
  in_progress: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  completed: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  pending: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
}

export function EmergencyModeLayout() {
  const {
    plantName,
    temperature,
    pressure,
    vibration,
    gas,
    alertState,
    timerDisplay,
    responseActions,
    timeline,
    teamCategories,
    mapLegend,
    contactList,
    emergencySince,
    durationDisplay,
    sensorTrend,
    triggerMassAlert,
    triggerShutdown,
    markSirensActive,
    advanceEvacuation,
    updateActionStatus,
  } = useEmergencyMode()

  const [mapView, setMapView] = useState<'3D' | '2D'>('3D')
  const [mapZoom, setMapZoom] = useState(1)
  const [layersVisible, setLayersVisible] = useState(true)
  const [mapFullscreen, setMapFullscreen] = useState(false)

  const navigateTo = (module: string) => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module } }))
  }

  const toggleFullscreen = async () => {
    const map = document.getElementById('emergency-map')
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
      try {
        await document.exitFullscreen()
      } catch {
        setMapFullscreen(true)
      }
    }
    setMapFullscreen(false)
  }

  const currentDate = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), [])
  const currentTime = useMemo(
    () =>
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [],
  )

  const timerValue = `${timerDisplay} min : sec`

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-red-500/30 bg-background/80 shadow-[0_0_50px_rgba(239,68,68,0.12)]">
      <header className="flex items-center justify-between gap-4 border-b border-red-500/25 bg-slate-950/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border border-red-500/40 bg-red-500/10 text-red-300">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-red-300">SAFE.AI</div>
            <div className="text-[7px] uppercase tracking-[0.12em] text-slate-400">Smart AI for Factory Safety &amp; Emergency</div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[14px] font-black uppercase tracking-[0.18em] text-red-300">EMERGENCY MODE</div>
          <div className="text-[9px] uppercase tracking-[0.14em] text-slate-400">Active Incident Response &amp; Life Safety Priority</div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-300">
          <div className="rounded border border-border/70 bg-background/40 px-2 py-1.5">
            <span className="text-slate-400">Plant:</span> {plantName}
          </div>
          <div className="rounded border border-border/70 bg-background/40 px-2 py-1.5">
            <span className="text-slate-400">{currentDate}</span> {currentTime}
          </div>
          <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1.5 text-red-300">System Status: EMERGENCY</div>
          <button type="button" title="Alerts and notifications" onClick={() => navigateTo('Alerts & Notifications')} className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white">
            <Bell className="size-3.5" />
          </button>
          <button type="button" title="AI Copilot" onClick={() => navigateTo('AI Copilot')} className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white">
            <CircleHelp className="size-3.5" />
          </button>
          <button type="button" title="System settings" onClick={() => navigateTo('System Settings')} className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-slate-300 hover:text-white">
            <Settings className="size-3.5" />
          </button>
          <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] text-slate-300">
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 font-bold text-red-300">SH</span>
            Safety Head
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5 text-[9px] text-slate-300">
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 font-bold text-blue-300">A</span>
            Administrator
          </div>
        </div>
      </header>

      <div className="border-b border-red-500/20 bg-red-950/20 px-4 py-3">
        <div className="flex items-center justify-between gap-4 rounded-md border border-red-500/35 bg-red-500/10 p-3 shadow-[0_0_28px_rgba(239,68,68,0.14)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-red-500/40 bg-red-500/15 text-red-300">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="text-[16px] font-bold uppercase tracking-[0.14em] text-red-200">CRITICAL EMERGENCY ACTIVE</div>
              <div className="text-[11px] text-red-100/90">High Temperature in Reactor R-101</div>
              <div className="text-[10px] text-red-100/80">Zone C - Hot Work Area</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px] uppercase tracking-[0.12em] text-red-100/80 md:grid-cols-5">
            <div>
              <div className="text-red-200/70">Alert Level</div>
              <div className="mt-1 text-[13px] font-bold tracking-[0.1em] text-red-300">CRITICAL</div>
            </div>
            <div>
              <div className="text-red-200/70">Since</div>
              <div className="mt-1 text-[12px] font-bold text-red-300">{emergencySince}</div>
            </div>
            <div>
              <div className="text-red-200/70">Duration</div>
              <div className="mt-1 text-[12px] font-bold text-red-300">{durationDisplay}</div>
            </div>
            <div>
              <div className="text-red-200/70">Affected Area</div>
              <div className="mt-1 text-[12px] font-bold text-red-300">Zone C</div>
            </div>
            <div>
              <div className="text-red-200/70">Lives at Risk</div>
              <div className="mt-1 text-[12px] font-bold text-red-300">High</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-hidden p-3 xl:grid-cols-[minmax(0,1.9fr)_0.95fr_0.9fr]">
        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <Panel className="border-red-500/30 bg-slate-950/70 p-0">
            <div className="flex items-center justify-between border-b border-red-500/30 px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">LIVE EMERGENCY MAP (ZONE C)</div>
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-300">
                <button type="button" onClick={() => setMapView('3D')} className={cn('rounded border border-border/70 bg-background/40 px-2 py-1', mapView === '3D' && 'border-red-400/60 bg-red-500/15 text-red-200')}>3D</button>
                <button type="button" onClick={() => setMapView('2D')} className={cn('rounded border border-border/70 bg-background/40 px-2 py-1', mapView === '2D' && 'border-red-400/60 bg-red-500/15 text-red-200')}>2D</button>
                <button type="button" onClick={() => setLayersVisible((current) => !current)} className={cn('rounded border border-border/70 bg-background/40 px-2 py-1', layersVisible && 'border-cyan-400/60 text-cyan-200')}>Layers</button>
                <button type="button" onClick={() => setMapZoom((current) => Math.min(current + 0.1, 1.6))} className="rounded border border-border/70 bg-background/40 px-2 py-1">+</button>
                <button type="button" onClick={() => setMapZoom((current) => Math.max(current - 0.1, 0.8))} className="rounded border border-border/70 bg-background/40 px-2 py-1">−</button>
                <button type="button" onClick={toggleFullscreen} className={cn('rounded border border-border/70 bg-background/40 px-2 py-1', mapFullscreen && 'border-red-400/60 text-red-200')}>Fullscreen</button>
              </div>
            </div>

            <div id="emergency-map" className={cn('relative h-[294px] overflow-hidden bg-[radial-gradient(circle_at_30%_18%,rgba(37,99,235,0.15),transparent_25%),linear-gradient(180deg,#08131f,#0d1b2d_55%,#0b1525)]', mapView === '2D' && 'grayscale-[0.35]')}>
              <div className="absolute inset-0 origin-center transition-transform duration-200" style={{ transform: `scale(${mapZoom})` }}>
              <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:30px_30px]" />

              <div className="absolute left-[18%] top-[18%] h-16 w-16 rounded-md border border-slate-500/70 bg-slate-800/70 shadow-[inset_0_0_20px_rgba(148,163,184,0.12)]" />
              <div className="absolute left-[34%] top-[28%] h-20 w-16 rounded-md border border-slate-500/70 bg-slate-700/70 shadow-[inset_0_0_20px_rgba(148,163,184,0.12)]" />
              <div className="absolute left-[60%] top-[22%] h-16 w-20 rounded-md border border-slate-500/70 bg-slate-800/70 shadow-[inset_0_0_20px_rgba(148,163,184,0.12)]" />
              <div className="absolute left-[62%] top-[52%] h-14 w-14 rounded-md border border-slate-500/70 bg-slate-800/70 shadow-[inset_0_0_20px_rgba(148,163,184,0.12)]" />
              <div className="absolute left-[50%] top-[45%] h-[82px] w-[82px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/60 bg-red-600/25 shadow-[0_0_42px_rgba(239,68,68,0.42)]" />
              <div className="absolute left-[50%] top-[45%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-md border border-red-500/50 bg-red-500/15 px-3 py-2 text-center shadow-[0_0_26px_rgba(239,68,68,0.4)]">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-red-200">R-101</span>
                <span className="text-[11px] font-bold text-red-300">92°C</span>
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
              <div className="absolute left-[12%] top-[62%] flex items-center gap-1 rounded border border-amber-500/50 bg-amber-500/10 px-2 py-1 text-[9px] font-medium text-amber-300">
                <Flame className="size-3" /> Fire Hydrant
              </div>
              <div className="absolute left-[74%] top-[56%] flex items-center gap-1 rounded border border-emerald-500/50 bg-emerald-500/10 px-2 py-1 text-[9px] font-medium text-emerald-300">
                <Droplets className="size-3" /> First Aid
              </div>

              {layersVisible ? <div className="absolute bottom-3 left-3 w-[170px] rounded border border-border/80 bg-slate-950/70 p-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">Legend</div>
                <div className="mt-2 space-y-1 text-[9px] text-slate-300">
                  {mapLegend.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className={cn('inline-flex size-2 rounded-full', item === 'Incident Location' ? 'bg-red-500' : item === 'Evacuation Routes' ? 'bg-cyan-400' : item === 'Assembly Point' ? 'bg-emerald-400' : item === 'On Site Team' ? 'bg-blue-400' : item === 'Fire Hydrant' ? 'bg-amber-400' : 'bg-emerald-400')} />
                      {item}
                    </div>
                  ))}
                </div>
              </div> : null}
              </div>
            </div>
          </Panel>

          <Panel className="border-red-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">EVACUATION STATUS</div>
              <button type="button" onClick={() => navigateTo('Evacuation Planner')} className="text-[9px] text-cyan-300">View Evacuation Map →</button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex size-24 items-center justify-center rounded-full border-[6px] border-red-500/40 bg-slate-900/60 text-center shadow-[0_0_26px_rgba(239,68,68,0.2)]">
                <div className="absolute inset-2 rounded-full border border-slate-700/70" />
                <div className="relative">
                  <div className="text-[18px] font-black text-red-300">{alertState.evacuationPercent}%</div>
                  <div className="text-[9px] uppercase tracking-[0.12em] text-slate-300">Evacuated</div>
                </div>
              </div>

              <div className="grid flex-1 gap-2 text-[10px]">
                <div className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                  <span className="text-slate-400">Total Head Count</span>
                  <span className="font-bold text-white">356</span>
                </div>
                <div className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                  <span className="text-slate-400">Evacuated</span>
                  <span className="font-bold text-emerald-300">{Math.round(356 * alertState.evacuationPercent / 100)}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                  <span className="text-slate-400">Remaining</span>
                  <span className="font-bold text-amber-300">{356 - Math.round(356 * alertState.evacuationPercent / 100)}</span>
                </div>
                <div className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                  <span className="text-slate-400">Assembly Points</span>
                  <span className="font-bold text-red-300">3 / 5</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <Panel className="border-red-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">INCIDENT DETAILS</div>
            <div className="space-y-2 text-[10px]">
              <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-2">
                <span className="text-slate-400">Incident Type</span>
                <span className="font-semibold text-white">High Temperature</span>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-2">
                <span className="text-slate-400">Equipment</span>
                <span className="font-semibold text-white">Reactor R-101</span>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-2">
                <span className="text-slate-400">Location</span>
                <span className="font-semibold text-white">Zone C - Hot Work Area</span>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-2">
                <span className="text-slate-400">Severity</span>
                <span className="font-semibold text-red-300">CRITICAL</span>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-2">
                <span className="text-slate-400">Detected At</span>
                <span className="font-semibold text-white">10:18 AM</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Reported By</span>
                <span className="font-semibold text-white">AI System</span>
              </div>
            </div>
          </Panel>

          <Panel className="border-red-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">IMPACT ASSESSMENT</div>
            <div className="space-y-2 text-[10px]">
              {[
                ['Lives at Risk', 'High', 'text-red-300'],
                ['Potential Explosion', 'High', 'text-red-300'],
                ['Environmental Impact', 'Severe', 'text-amber-300'],
                ['Operational Impact', 'Severe', 'text-amber-300'],
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between rounded border border-border/70 bg-background/30 px-2 py-1.5">
                  <span className="text-slate-400">{label}</span>
                  <span className={cn('font-bold', color)}>{value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-red-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">EMERGENCY TIMELINE</div>
            </div>

            <div className="space-y-2 pl-2">
              {timeline.map((item, index) => (
                <div key={`${item.time}-${item.text}`} className="relative flex gap-3">
                  {index !== timeline.length - 1 ? <div className="absolute left-[6px] top-5 bottom-[-8px] w-px bg-red-500/30" /> : null}
                  <div className={cn('relative mt-1 size-3 rounded-full border', item.status === 'critical' ? 'border-red-300 bg-red-500' : item.status === 'active' ? 'border-amber-300 bg-amber-500' : 'border-cyan-300 bg-cyan-500')} />
                  <div className="flex-1 pb-2">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{item.time}</div>
                    <div className="text-[10px] text-white">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <Panel className="border-red-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">LIVE SENSOR READINGS (R-101)</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Temperature', value: `${temperature}°C`, status: 'CRITICAL', tone: 'text-red-300', trend: [68, 70, 72, 75, 82, 92] },
                { label: 'Pressure', value: `${pressure} bar`, status: 'HIGH', tone: 'text-amber-300', trend: [4.8, 5.2, 5.6, 5.9, 6.1, 6.5] },
                { label: 'Vibration', value: `${vibration} mm/s`, status: 'HIGH', tone: 'text-amber-300', trend: [4.5, 5.1, 5.6, 6.4, 6.9, 7.2] },
                { label: 'Gas Leak', value: `${gas}% LEL`, status: 'CRITICAL', tone: 'text-red-300', trend: [44, 52, 68, 73, 78, 85] },
              ].map((sensor) => (
                <div key={sensor.label} className="rounded border border-border/70 bg-background/25 p-2">
                  <div className="flex items-center justify-between gap-2 text-[9px] text-slate-400">
                    <span>{sensor.label}</span>
                    <span className={cn('font-semibold uppercase', sensor.tone)}>{sensor.status}</span>
                  </div>
                  <div className="mt-2 text-[16px] font-bold text-white">{sensor.value}</div>
                  <div className="mt-2 h-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sensor.trend.map((value, index) => ({ value, index }))}>
                        <defs>
                          <linearGradient id={`sensor-${sensor.label.toLowerCase().replace(/\s+/g, '-')}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={sensor.status === 'CRITICAL' ? '#ef4444' : '#f59e0b'} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={sensor.status === 'CRITICAL' ? '#ef4444' : '#f59e0b'} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={sensor.status === 'CRITICAL' ? '#ef4444' : '#f59e0b'}
                          fill={`url(#sensor-${sensor.label.toLowerCase().replace(/\s+/g, '-')})`}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-red-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">TREND (LAST 10 MIN)</div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensorTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} name="Temperature (°C)" />
                  <Line type="monotone" dataKey="pressure" stroke="#f59e0b" strokeWidth={2} dot={false} name="Pressure (bar)" />
                  <Line type="monotone" dataKey="vibration" stroke="#fbbf24" strokeWidth={2} dot={false} name="Vibration (mm/s)" />
                  <Line type="monotone" dataKey="gas" stroke="#f97316" strokeWidth={2} dot={false} name="Gas Leak (% LEL)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel className="border-red-500/30 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">RESPONSE ACTIONS</div>
              <span className="text-[9px] text-slate-400">Click an action to advance it</span>
            </div>
            <div className="space-y-2">
              {responseActions.map((action) => (
                <button
                  type="button"
                  key={action.id}
                  onClick={() => {
                    updateActionStatus(action.id)
                    if (action.id === 'evacuate') advanceEvacuation()
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded border border-border/70 bg-background/25 px-2 py-1.5 text-left transition hover:border-red-500/40"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn('flex size-5 items-center justify-center rounded-full border', action.status === 'completed' ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300' : action.status === 'in_progress' ? 'border-amber-500/50 bg-amber-500/20 text-amber-300' : 'border-slate-500/50 bg-slate-500/20 text-slate-300')}>
                      {action.status === 'completed' ? '✓' : action.status === 'in_progress' ? '•' : '○'}
                    </div>
                    <span className="text-[10px] text-white">{action.label}</span>
                  </div>
                  <span className={cn('rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em]', statusBadgeClass[action.status])}>{action.status === 'in_progress' ? 'IN PROGRESS' : action.status === 'completed' ? 'COMPLETED' : 'PENDING'}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid min-h-[160px] gap-3 border-t border-red-500/20 bg-slate-950/60 p-3 xl:grid-cols-[0.9fr_0.9fr_0.78fr_0.78fr_0.9fr_1.2fr]">
        <Panel className="border-red-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">MASS ALERT SENT</div>
            <Megaphone className="size-4 text-red-300" />
          </div>
          <div className="text-[9px] uppercase tracking-[0.14em] text-slate-400">To All Personnel in Plant</div>
          <div className="mt-3 text-[10px] text-slate-200">10:19 AM</div>
          <button type="button" onClick={triggerMassAlert} className="mt-3 w-full rounded border border-red-500/40 bg-red-500/10 px-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-red-300 hover:bg-red-500/20">
            Resend Alert
          </button>
        </Panel>

        <Panel className="border-red-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">ON SITE TEAM (LIVE)</div>
            <Users className="size-4 text-red-300" />
          </div>
          <div className="space-y-2 text-[10px]">
            {teamCategories.map((team) => (
              <div key={team.id} className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-1.5">
                <span className={cn('font-semibold', team.tone)}>{team.label}</span>
                <span className="font-bold text-white">{team.count}</span>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => navigateTo('User Management')} className="mt-3 text-[9px] text-cyan-300">View All</button>
        </Panel>

        <Panel className="border-red-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">WEATHER CONDITIONS</div>
          <div className="flex items-center gap-2 text-red-300">
            <CloudSun className="size-4" />
            <span className="text-[18px] font-bold text-white">32°C</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-300">Clear</div>
          <div className="mt-3 space-y-2 text-[9px] text-slate-300">
            <div className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-1.5">
              <span className="flex items-center gap-1"><Wind className="size-3" /> Wind</span>
              <span className="text-white">14 km/h SW</span>
            </div>
            <div className="flex items-center justify-between rounded border border-border/70 bg-background/25 px-2 py-1.5">
              <span className="flex items-center gap-1"><Droplets className="size-3" /> Humidity</span>
              <span className="text-white">48%</span>
            </div>
          </div>
        </Panel>

        <Panel className="border-red-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">EMERGENCY CONTACTS</div>
          <div className="space-y-2 text-[9px]">
            {contactList.map((contact) => (
              <div key={contact.label} className="flex items-center justify-between gap-2 rounded border border-border/70 bg-background/25 px-2 py-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="size-3 text-red-300" />
                  <div>
                    <div className="text-slate-400">{contact.label}</div>
                    <div className="font-semibold text-white">{contact.value}</div>
                  </div>
                </div>
                <a href={`tel:${contact.value.replace(/\s/g, '')}`} className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-red-300">Call</a>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="border-red-500/30 bg-red-950/35 p-4">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-100">TIME TO CRITICAL IMPACT</div>
          <div className="mb-3 text-[9px] uppercase tracking-[0.12em] text-red-200/80">Estimated</div>
          <div className="text-[32px] font-black text-red-300">{timerValue}</div>
          <div className="mt-3 h-10 overflow-hidden rounded border border-red-500/30 bg-red-900/20">
            <svg viewBox="0 0 220 40" className="h-full w-full">
              <path d="M0 22 L20 20 L36 24 L54 18 L71 30 L88 18 L104 14 L120 30 L136 26 L150 12 L174 18 L192 15 L220 12" fill="none" stroke="#fca5a5" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </Panel>

        <Panel className="border-red-500/30 bg-slate-950/70 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">EMERGENCY SHORTCUT</div>
          <div className="space-y-2 text-[9px]">
            {[
              'Activate Sirens',
              'Mass Alert',
              'Shutdown Systems',
              'Emergency Contacts',
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item === 'Activate Sirens') markSirensActive()
                  if (item === 'Mass Alert') triggerMassAlert()
                  if (item === 'Shutdown Systems') triggerShutdown()
                  if (item === 'Emergency Contacts') navigateTo('User Management')
                }}
                className="flex w-full items-center justify-between rounded border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-left text-red-200 hover:bg-red-500/15"
              >
                <span>{item}</span>
                {item === 'Activate Sirens' && <span className="mr-1 text-[8px] uppercase text-red-300">{alertState.sirensActive ? 'On' : 'Off'}</span>}
                <ChevronRight className="size-3" />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { triggerShutdown(); navigateTo('Dashboard') }} className="mt-4 w-full rounded border border-red-500/50 bg-red-500/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.22)]">
            {alertState.shutdownConfirmed ? 'EMERGENCY MODE ENDED' : 'END EMERGENCY MODE'}
          </button>
        </Panel>
      </div>
    </div>
  )
}

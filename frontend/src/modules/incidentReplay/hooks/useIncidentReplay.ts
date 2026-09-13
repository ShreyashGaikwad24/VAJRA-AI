import { useEffect, useMemo, useState } from 'react'

import { usePlantSimulation } from '@/modules/situationRoom/hooks/usePlantSimulation'
import { usePlantStore } from '@/store/usePlantStore'
import { plantApi, type RiskSnapshot, type TelemetryReading } from '@/services/plantApi'
import type { IncidentEvent, IncidentMetric, NoteEntry, ReplayAction, ReplayShortcut, ReplayState, ReplayTab, SensorReading } from '@/modules/incidentReplay/services/incidentReplayTypes'

function formatTimestamp(value: string | number) {
  return new Date(value).toLocaleString([], {
    month: 'short', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = Math.floor(seconds % 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

function snapshotEvents(history: RiskSnapshot[]): IncidentEvent[] {
  return history.map((snapshot, index) => ({
    id: `risk-${snapshot.id}`,
    time: formatTimestamp(snapshot.timestamp),
    rawSeconds: index === 0 ? 0 : (new Date(snapshot.timestamp).getTime() - new Date(history[0].timestamp).getTime()) / 1000,
    label: `Risk snapshot · ${snapshot.risk_level.toUpperCase()}`,
    detail: `CRI ${Math.round(snapshot.cri)} · PRI ${Math.round(snapshot.pri)} · ERI ${Math.round(snapshot.eri)} · SRI ${Math.round(snapshot.sri)}`,
    severity: snapshot.risk_level === 'critical' ? 'critical' : snapshot.risk_level === 'high' || snapshot.risk_level === 'medium' ? 'warning' : 'info',
  }))
}

function sensorStatus(value: number | undefined, normalMin: number, normalMax: number): SensorReading['status'] {
  if (value === undefined) return 'STABLE'
  if (value < normalMin || value > normalMax) return 'CRITICAL'
  return 'STABLE'
}

export function useIncidentReplay() {
  usePlantSimulation(true)
  const plantName = usePlantStore((state) => state.plantName)
  const sensors = usePlantStore((state) => state.sensors)
  const sensorCodeByBackendId = usePlantStore((state) => state.sensorCodeByBackendId)
  const storeLoading = usePlantStore((state) => state.isLoading)
  const storeError = usePlantStore((state) => state.backendError)

  const [riskHistory, setRiskHistory] = useState<RiskSnapshot[]>([])
  const [telemetryHistory, setTelemetryHistory] = useState<Record<string, TelemetryReading[]>>({})
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ReplayTab>('Replay View')
  const [selectedShortcut, setSelectedShortcut] = useState<ReplayShortcut>('Last 7 Days')
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D')
  const [layersVisible, setLayersVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [currentSecond, setCurrentSecond] = useState(0)
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null)
  const [actions, setActions] = useState<ReplayAction[]>([])
  const [notes, setNotes] = useState<NoteEntry[]>([])
  const [noteDraft, setNoteDraft] = useState('')

  useEffect(() => {
    let cancelled = false
    const loadHistory = async () => {
      setHistoryLoading(true)
      try {
        const history = await plantApi.getRiskHistory()
        const telemetryEntries = await Promise.all(
          Object.entries(sensorCodeByBackendId).map(async ([sensorId, code]) => [
            code,
            await plantApi.getTelemetry(Number(sensorId)),
          ] as const),
        )
        if (!cancelled) {
          setRiskHistory([...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()))
          setTelemetryHistory(Object.fromEntries(telemetryEntries))
          setHistoryError(null)
        }
      } catch (error) {
        if (!cancelled) setHistoryError(error instanceof Error ? error.message : 'Historical risk data unavailable.')
      } finally {
        if (!cancelled) setHistoryLoading(false)
      }
    }

    if (!storeLoading && Object.keys(sensorCodeByBackendId).length > 0) {
      void loadHistory()
    }
    return () => { cancelled = true }
  }, [sensorCodeByBackendId, storeLoading])

  const events = useMemo(() => snapshotEvents(riskHistory), [riskHistory])
  const startTime = riskHistory[0]?.timestamp
  const endTime = riskHistory[riskHistory.length - 1]?.timestamp
  const totalDurationSeconds = startTime && endTime ? Math.max(0, (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000) : 0
  const currentTimestamp = startTime ? new Date(new Date(startTime).getTime() + currentSecond * 1000).toISOString() : undefined
  const currentSnapshot = useMemo(() => {
    if (riskHistory.length === 0) return undefined
    return [...riskHistory].reverse().find((snapshot) => !currentTimestamp || new Date(snapshot.timestamp).getTime() <= new Date(currentTimestamp).getTime()) ?? riskHistory[0]
  }, [currentTimestamp, riskHistory])
  const replayData = useMemo<ReplayState>(() => {
    const snapshots = riskHistory
    const peak = (field: keyof Pick<RiskSnapshot, 'cri' | 'pri' | 'eri' | 'sri'>) => snapshots.length ? Math.round(Math.max(...snapshots.map((snapshot) => snapshot[field]))) : 0
    const sensorReadings: SensorReading[] = sensors.slice(0, 4).map((sensor) => {
      const readings = telemetryHistory[sensor.id] ?? []
      const reading = readings.filter((item) => !currentTimestamp || new Date(item.timestamp).getTime() <= new Date(currentTimestamp).getTime()).at(-1)
      const value = reading?.value ?? (readings.length === 0 ? undefined : readings[0]?.value)
      return {
        id: sensor.id,
        label: `${sensor.id} (${sensor.type})`,
        value: value === undefined ? 'Unavailable' : String(value),
        unit: sensor.unit,
        status: sensorStatus(value, sensor.normalMin, sensor.normalMax),
        tone: value === undefined ? 'text-slate-300' : sensorStatus(value, sensor.normalMin, sensor.normalMax) === 'CRITICAL' ? 'text-red-300' : 'text-cyan-300',
      }
    })
    return {
      incidentId: 'RISK-HISTORY', incidentType: 'Historical Risk Replay',
      location: plantName, severity: currentSnapshot?.risk_level?.toUpperCase() ?? 'UNAVAILABLE',
      startTime: startTime ? formatTimestamp(startTime) : 'Unavailable', endTime: endTime ? formatTimestamp(endTime) : 'Unavailable',
      duration: formatDuration(totalDurationSeconds), status: 'Read-only', plantName,
      summary: historyError ? 'Historical backend risk data is unavailable.' : 'Replay of persisted backend risk snapshots. No incident record is asserted.',
      events, sensorReadings,
      metrics: [
        { id: 'peak-cri', label: 'Peak CRI', value: `${peak('cri')}`, tone: 'text-red-300' },
        { id: 'peak-pri', label: 'Peak PRI', value: `${peak('pri')}`, tone: 'text-amber-300' },
        { id: 'peak-eri', label: 'Peak ERI', value: `${peak('eri')}`, tone: 'text-amber-300' },
        { id: 'peak-sri', label: 'Peak SRI', value: `${peak('sri')}`, tone: 'text-cyan-300' },
        { id: 'snapshot-count', label: 'Snapshots', value: `${snapshots.length}`, tone: 'text-cyan-300' },
        { id: 'duration', label: 'History Duration', value: formatDuration(totalDurationSeconds), tone: 'text-cyan-300' },
      ] as IncidentMetric[], actions, cameraClips: [], notes,
    }
  }, [actions, currentSnapshot, currentTimestamp, endTime, events, historyError, notes, plantName, riskHistory, sensors, startTime, telemetryHistory, totalDurationSeconds])

  useEffect(() => {
    if (!isPlaying) return

    const interval = window.setInterval(() => {
      setCurrentSecond((prev) => {
        if (prev >= totalDurationSeconds) {
          setIsPlaying(false)
          return totalDurationSeconds
        }
        return prev + 1 * playbackSpeed
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isPlaying, playbackSpeed, totalDurationSeconds])

  const currentEvent = useMemo(() => {
    const next = [...events].reverse().find((event) => currentSecond >= event.rawSeconds)
    return next ?? events[0]
  }, [currentSecond, events])

  const endTimestamp = endTime ? formatTimestamp(endTime) : 'Unavailable'
  const progressPercent = totalDurationSeconds > 0 ? Math.min(100, (currentSecond / totalDurationSeconds) * 100) : 0

  const handleTimelineChange = (value: number) => {
    setCurrentSecond(Math.max(0, Math.min(totalDurationSeconds, value)))
  }

  const jumpToEvent = (eventId: string) => {
    const event = events.find((item) => item.id === eventId)
    if (event) setCurrentSecond(event.rawSeconds)
  }

  const togglePlayback = () => setIsPlaying((value) => !value)

  const updateActionStatus = (id: string) => {
    setActions((current) =>
      current.map((action) => {
        if (action.id !== id) return action
        if (action.status === 'PENDING') return { ...action, status: 'COMPLETED' }
        return action
      }),
    )
  }

  const handleAddNote = () => {
    const value = noteDraft.trim()
    if (!value) return
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setNotes((current) => [{ id: `note-${Date.now()}`, text: value, createdAt: now }, ...current])
    setNoteDraft('')
  }

  const handleDownloadReport = () => {
    const report = [
      'SAFE-AI Incident Replay Report',
      `Replay ID: ${replayData.incidentId}`,
      `Type: ${replayData.incidentType}`,
      `Location: ${replayData.location}`,
      `Duration: ${replayData.duration}`,
      `Summary: ${replayData.summary}`,
      '',
      'Timeline:',
      ...replayData.events.map((event) => `${event.time} - ${event.label} (${event.detail})`),
    ].join('\n')

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${replayData.incidentId}-report.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
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
    playbackSpeed,
    setPlaybackSpeed,
    currentSecond,
    totalDurationSeconds,
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
    isLoading: storeLoading || historyLoading,
    backendError: historyError ?? storeError,
  }
}

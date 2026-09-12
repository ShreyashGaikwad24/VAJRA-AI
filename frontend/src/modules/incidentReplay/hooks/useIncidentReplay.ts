import { useEffect, useMemo, useState } from 'react'

import { INCIDENT_REPLAY_DATA } from '@/modules/incidentReplay/services/incidentReplayData'
import type { NoteEntry, ReplayAction, ReplayShortcut, ReplayTab } from '@/modules/incidentReplay/services/incidentReplayTypes'

const START_SECONDS = 10 * 60 + 18 + 2 // 10:18:02
const END_SECONDS = 10 * 60 + 24 + 15 // 10:24:15
const TOTAL_DURATION_SECONDS = END_SECONDS - START_SECONDS

function formatPlaybackTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const hours = Math.floor(minutes / 60)
  const hh = (() => {
    const display = hours % 12 || 12
    return String(display).padStart(2, '0')
  })()
  const mm = String(minutes % 60).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${hh}:${mm}:${ss} ${suffix}`
}

export function useIncidentReplay() {
  const [activeTab, setActiveTab] = useState<ReplayTab>('Replay View')
  const [selectedShortcut, setSelectedShortcut] = useState<ReplayShortcut>('Last 7 Days')
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D')
  const [layersVisible, setLayersVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [currentSecond, setCurrentSecond] = useState(0)
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>('cam-101')
  const [actions, setActions] = useState<ReplayAction[]>(INCIDENT_REPLAY_DATA.actions)
  const [notes, setNotes] = useState<NoteEntry[]>(INCIDENT_REPLAY_DATA.notes)
  const [noteDraft, setNoteDraft] = useState('')

  useEffect(() => {
    if (!isPlaying) return

    const interval = window.setInterval(() => {
      setCurrentSecond((prev) => {
        if (prev >= TOTAL_DURATION_SECONDS) {
          setIsPlaying(false)
          return TOTAL_DURATION_SECONDS
        }
        return prev + 1 * playbackSpeed
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isPlaying, playbackSpeed])

  const currentEvent = useMemo(() => {
    const next = [...INCIDENT_REPLAY_DATA.events].reverse().find((event) => currentSecond >= event.rawSeconds)
    return next ?? INCIDENT_REPLAY_DATA.events[0]
  }, [currentSecond])

  const currentTimestamp = useMemo(() => formatPlaybackTime(START_SECONDS + currentSecond), [currentSecond])
  const endTimestamp = useMemo(() => formatPlaybackTime(END_SECONDS), [])
  const progressPercent = Math.min(100, (currentSecond / TOTAL_DURATION_SECONDS) * 100)

  const handleTimelineChange = (value: number) => {
    setCurrentSecond(Math.max(0, Math.min(TOTAL_DURATION_SECONDS, value)))
  }

  const jumpToEvent = (eventId: string) => {
    const event = INCIDENT_REPLAY_DATA.events.find((item) => item.id === eventId)
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
      `Incident ID: ${INCIDENT_REPLAY_DATA.incidentId}`,
      `Type: ${INCIDENT_REPLAY_DATA.incidentType}`,
      `Location: ${INCIDENT_REPLAY_DATA.location}`,
      `Duration: ${INCIDENT_REPLAY_DATA.duration}`,
      `Summary: ${INCIDENT_REPLAY_DATA.summary}`,
      '',
      'Timeline:',
      ...INCIDENT_REPLAY_DATA.events.map((event) => `${event.time} - ${event.label} (${event.detail})`),
    ].join('\n')

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${INCIDENT_REPLAY_DATA.incidentId}-report.txt`
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
    totalDurationSeconds: TOTAL_DURATION_SECONDS,
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
  }
}

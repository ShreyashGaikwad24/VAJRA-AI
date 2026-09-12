import { useEffect, useMemo, useState } from 'react'

import { usePlantStore } from '@/store/usePlantStore'
import type { EmergencyAlertState, ResponseAction, TeamCategory } from '@/modules/emergency/services/emergencyTypes'

export function useEmergencyMode() {
  const plantName = usePlantStore((state) => state.plantName)
  const equipment = usePlantStore((state) => state.equipment)
  const sensors = usePlantStore((state) => state.sensors)
  const telemetryContext = usePlantStore((state) => state.telemetryContext)
  const riskScores = usePlantStore((state) => state.riskScores)
  const overview = usePlantStore((state) => state.overview)

  const r101 = equipment.find((item) => item.id === 'R-101') ?? equipment[0]
  const tempSensor = sensors.find((sensor) => sensor.equipmentId === 'R-101' && sensor.type === 'temperature')
  const pressureSensor = sensors.find((sensor) => sensor.equipmentId === 'R-101' && sensor.type === 'pressure')
  const gasSensor = sensors.find((sensor) => sensor.equipmentId === 'R-101' && sensor.type === 'gas')
  const vibrationSensor = sensors.find((sensor) => sensor.equipmentId === 'R-101' && sensor.type === 'vibration')

  const [alertState, setAlertState] = useState<EmergencyAlertState>({
    sirensActive: true,
    massAlertSent: true,
    shutdownConfirmed: false,
    alertTimestamp: '10:18 AM',
    evacuationPercent: 68,
  })

  const [timerSeconds, setTimerSeconds] = useState(15 * 60 + 37)
  const [responseActions, setResponseActions] = useState<ResponseAction[]>([
    { id: 'sirens', label: 'Activate Emergency Sirens', status: 'completed' },
    { id: 'notify', label: 'Notify All Personnel', status: 'completed' },
    { id: 'evacuate', label: 'Evacuate Zone C', status: 'in_progress' },
    { id: 'isolate', label: 'Isolate Reactor R-101', status: 'in_progress' },
    { id: 'cooling', label: 'Start Cooling Water System', status: 'pending' },
    { id: 'firegas', label: 'Fire & Gas System On', status: 'pending' },
    { id: 'medical', label: 'Medical Team On Standby', status: 'pending' },
  ])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimerSeconds((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const timerDisplay = useMemo(() => {
    const minutes = Math.floor(timerSeconds / 60)
    const seconds = timerSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [timerSeconds])

  const currentTemperature = Math.round(r101?.temperature ?? tempSensor?.value ?? 0)
  const pressureValue = Number((pressureSensor?.value ?? r101?.pressure ?? 0).toFixed(1))
  const vibrationValue = Number((vibrationSensor?.value ?? r101?.vibration ?? 0).toFixed(1))
  const gasValue = Math.round(gasSensor?.value ?? r101?.gas ?? 0)
  const emergencySince = '10:18 AM'
  const durationDisplay = '00:06:23'

  const teamCategories: TeamCategory[] = [
    { id: 'fire', label: 'Fire Team', count: 12, tone: 'text-red-300' },
    { id: 'medical', label: 'Medical Team', count: 8, tone: 'text-emerald-300' },
    { id: 'safety', label: 'Safety Team', count: 15, tone: 'text-cyan-300' },
    { id: 'maintenance', label: 'Maintenance', count: 10, tone: 'text-amber-300' },
  ]

  const sensorTrend = [
    { name: '00:00', temperature: 76, pressure: 5.1, vibration: 5.4, gas: 52 },
    { name: '02:00', temperature: 80, pressure: 5.4, vibration: 5.8, gas: 58 },
    { name: '04:00', temperature: 84, pressure: 5.7, vibration: 6.1, gas: 64 },
    { name: '06:00', temperature: 88, pressure: 5.9, vibration: 6.4, gas: 70 },
    { name: '08:00', temperature: 91, pressure: 6.2, vibration: 6.7, gas: 75 },
    { name: '10:00', temperature: 92, pressure: 6.5, vibration: 7.2, gas: 85 },
  ]

  const timeline = [
    { time: '10:18 AM', text: 'High temperature detected in R-101', status: 'critical' },
    { time: '10:18 AM', text: 'Automatic alert triggered', status: 'critical' },
    { time: '10:19 AM', text: 'Field team notified', status: 'active' },
    { time: '10:20 AM', text: 'Evacuation initiated in Zone C', status: 'active' },
    { time: '10:21 AM', text: 'Shutdown sequence started', status: 'warning' },
  ]

  const mapLegend = [
    'Incident Location',
    'Evacuation Routes',
    'Assembly Point',
    'On Site Team',
    'Fire Hydrant',
    'First Aid Station',
  ]

  const contactList = [
    { label: 'Control Room', value: '+91 12345 67890' },
    { label: 'Fire Station', value: '+91 12345 67891' },
    { label: 'Medical Center', value: '+91 12345 67892' },
  ]

  const markSirensActive = () => {
    setAlertState((current) => ({ ...current, sirensActive: !current.sirensActive }))
  }

  const triggerMassAlert = () => {
    setAlertState((current) => ({ ...current, massAlertSent: true, alertTimestamp: '10:19 AM' }))
  }

  const triggerShutdown = () => {
    setAlertState((current) => ({ ...current, shutdownConfirmed: true }))
  }

  const advanceEvacuation = () => {
    setAlertState((current) => ({
      ...current,
      evacuationPercent: current.evacuationPercent >= 100 ? 100 : Math.min(current.evacuationPercent + 4, 100),
    }))
  }

  const updateActionStatus = (id: string) => {
    setResponseActions((current) =>
      current.map((action) => {
        if (action.id !== id) return action
        if (action.status === 'pending') return { ...action, status: 'in_progress' }
        if (action.status === 'in_progress') return { ...action, status: 'completed' }
        return action
      }),
    )
  }

  return {
    plantName,
    r101,
    overview,
    telemetryContext,
    riskScores,
    temperature: currentTemperature,
    pressure: pressureValue,
    vibration: vibrationValue,
    gas: gasValue,
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
    markSirensActive,
    triggerMassAlert,
    triggerShutdown,
    advanceEvacuation,
    updateActionStatus,
  }
}

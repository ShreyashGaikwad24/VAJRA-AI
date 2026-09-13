import { useEffect, useMemo, useState } from 'react'

import { usePlantStore } from '@/store/usePlantStore'
import type { EmergencyAlertState, ResponseAction, TeamCategory } from '@/modules/emergency/services/emergencyTypes'
import { usePlantSimulation } from '@/modules/situationRoom/hooks/usePlantSimulation'
import { riskLevelFromScore, riskLevelLabel } from '@/data/plant/types'

export function useEmergencyMode() {
  usePlantSimulation(true)

  const plantName = usePlantStore((state) => state.plantName)
  const equipment = usePlantStore((state) => state.equipment)
  const sensors = usePlantStore((state) => state.sensors)
  const zones = usePlantStore((state) => state.zones)
  const telemetryContext = usePlantStore((state) => state.telemetryContext)
  const riskScores = usePlantStore((state) => state.riskScores)
  const riskContributors = usePlantStore((state) => state.riskContributors)
  const recommendations = usePlantStore((state) => state.recommendations)
  const overview = usePlantStore((state) => state.overview)
  const backendConnected = usePlantStore((state) => state.backendConnected)
  const backendError = usePlantStore((state) => state.backendError)
  const isLoading = usePlantStore((state) => state.isLoading)

  const r101 = equipment.find((item) => item.id === 'R-101') ?? equipment[0]
  const tempSensor = sensors.find((sensor) => sensor.equipmentId === 'R-101' && sensor.type === 'temperature')
  const pressureSensor = sensors.find((sensor) => sensor.equipmentId === 'R-101' && sensor.type === 'pressure')
  const gasSensor = sensors.find((sensor) => sensor.equipmentId === 'R-101' && sensor.type === 'gas')
  const vibrationSensor = sensors.find((sensor) => sensor.equipmentId === 'R-101' && sensor.type === 'vibration')
  const riskLevel = riskLevelFromScore(riskScores.cri)
  const highestRiskZone = zones.reduce((highest, zone) => !highest || zone.riskScore > highest.riskScore ? zone : highest, zones[0])
  const affectedEquipment = equipment.find((item) => item.status === 'Critical') ?? equipment.find((item) => item.status === 'Warning') ?? r101

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
  const emergencySince = backendConnected ? 'LIVE' : 'UNAVAILABLE'
  const durationDisplay = '00:06:23'

  const teamCategories: TeamCategory[] = [
    { id: 'personnel', label: 'On-Site Personnel', count: overview.onSiteWorkers, tone: 'text-cyan-300' },
  ]

  const sensorTrend = Array.from({ length: 6 }, (_, index) => {
    const historyIndex = Math.max(0, (tempSensor?.history.length ?? 1) - 6 + index)
    const valueAt = (sensor: typeof tempSensor) => sensor?.history[historyIndex] ?? sensor?.value ?? 0
    return {
      name: `T-${5 - index}`,
      temperature: valueAt(tempSensor),
      pressure: valueAt(pressureSensor),
      vibration: valueAt(vibrationSensor),
      gas: valueAt(gasSensor),
    }
  })

  const timeline = riskContributors.slice(0, 5).map((item) => ({
    time: 'LIVE',
    text: `${item.factor} risk contributor detected (${item.value})`,
    status: item.trend === 'up' ? 'critical' : 'active',
  }))

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
    riskLevel: riskLevelLabel(riskLevel),
    riskContributors,
    recommendations,
    zones,
    highestRiskZone,
    affectedEquipment,
    backendConnected,
    backendError,
    isLoading,
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

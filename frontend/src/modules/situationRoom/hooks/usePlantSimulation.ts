import { useEffect } from 'react'

import { usePlantStore } from '@/store/usePlantStore'

export function usePlantSimulation(enabled = true) {
  const initialize = usePlantStore((state) => state.initialize)
  const tickTelemetry = usePlantStore((state) => state.tickTelemetry)
  const recalculateRisk = usePlantStore((state) => state.recalculateRisk)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!enabled) return undefined

    const telemetryTimer = window.setInterval(() => {
      tickTelemetry()
    }, 1500)

    const riskTimer = window.setInterval(() => {
      recalculateRisk()
    }, 4000)

    return () => {
      window.clearInterval(telemetryTimer)
      window.clearInterval(riskTimer)
    }
  }, [enabled, tickTelemetry, recalculateRisk])
}

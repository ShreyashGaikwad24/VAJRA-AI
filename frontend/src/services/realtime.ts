import { API_BASE_URL } from './api'

export type TelemetryUpdate = {
  type: 'telemetry_update'
  timestamp: string
  readings: Array<{
    id: number
    sensor_id: number
    timestamp: string
    value: number
    quality: string
  }>
}

export type RiskUpdate = {
  type: 'risk_update'
  timestamp: string
  risk: {
    cri: number
    pri: number
    eri: number
    sri: number
    overall_risk: number
    risk_level: string
    contributors: Array<{
      factor: string
      score: number
      severity: string
      explanation: string
    }>
    recommendations: Array<{
      priority: string
      action: string
      reason: string
    }>
  }
}

export type RealtimeMessage = TelemetryUpdate | RiskUpdate

export type RealtimeHandlers = {
  onMessage: (message: RealtimeMessage) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (event: Event) => void
}

function buildWebSocketUrl(): string {
  const url = new URL(API_BASE_URL)

  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'

  return `${url.origin}/ws`
}

export function connectRealtime(
  handlers: RealtimeHandlers,
): () => void {
  let socket: WebSocket | null = null
  let reconnectTimer: number | null = null
  let stopped = false

  const connect = () => {
    if (stopped) return

    socket = new WebSocket(buildWebSocketUrl())

    socket.onopen = () => {
      handlers.onOpen?.()
    }

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as RealtimeMessage

        if (
          message?.type === 'telemetry_update' ||
          message?.type === 'risk_update'
        ) {
          handlers.onMessage(message)
        }
      } catch (error) {
        console.error(
          'Failed to parse SAFE-AI realtime message:',
          error,
        )
      }
    }

    socket.onerror = (event) => {
      handlers.onError?.(event)
    }

    socket.onclose = () => {
      socket = null
      handlers.onClose?.()

      if (!stopped) {
        reconnectTimer = window.setTimeout(connect, 3000)
      }
    }
  }

  connect()

  return () => {
    stopped = true

    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    if (socket !== null) {
      socket.close()
      socket = null
    }
  }
}
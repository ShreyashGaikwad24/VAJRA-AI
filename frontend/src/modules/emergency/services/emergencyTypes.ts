export type ResponseActionStatus = 'pending' | 'in_progress' | 'completed'

export type ResponseAction = {
  id: string
  label: string
  status: ResponseActionStatus
}

export type TeamCategory = {
  id: string
  label: string
  count: number
  tone: string
}

export type EmergencyAlertState = {
  sirensActive: boolean
  massAlertSent: boolean
  shutdownConfirmed: boolean
  alertTimestamp: string
  evacuationPercent: number
}

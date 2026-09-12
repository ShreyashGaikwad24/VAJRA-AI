import type { EvacuationState, EvacuationTab, RiskZone, TimelineEvent } from '@/modules/evacuationPlanner/services/evacuationTypes'

export const EVACUATION_TABS: EvacuationTab[] = ['Evacuation Map', 'Routes & Zones', 'Assembly Points', 'Scenario Builder', 'Drill Management']

export const INITIAL_TIMELINE: TimelineEvent[] = [
  { id: 't-1', time: '10:18:02 AM', label: 'Emergency Triggered', severity: 'critical' },
  { id: 't-2', time: '10:18:45 AM', label: 'Evacuation Alert Sent', severity: 'warning' },
  { id: 't-3', time: '10:19:12 AM', label: 'Evacuation Started - Zone C', severity: 'warning' },
  { id: 't-4', time: '10:20:10 AM', label: 'AP-1 Reached', count: 120, severity: 'info' },
  { id: 't-5', time: '10:21:05 AM', label: 'AP-2 Reached', count: 95, severity: 'info' },
  { id: 't-6', time: '10:22:18 AM', label: 'AP-3 Reached', count: 80, severity: 'info' },
  { id: 't-7', time: '10:22:50 AM', label: 'In Progress', count: 89, severity: 'warning' },
  { id: 't-8', time: '10:24:15 AM', label: '24 People Remaining', severity: 'critical' },
]

export const INITIAL_RISK_ZONES: RiskZone[] = [
  { id: 'r-101', label: 'R-101 Reactor', level: 'HIGH RISK', tone: 'text-red-300' },
  { id: 'compressor', label: 'Compressor Station', level: 'MEDIUM RISK', tone: 'text-amber-300' },
  { id: 'tank', label: 'Storage Tank Farm', level: 'LOW RISK', tone: 'text-emerald-300' },
]

export const INITIAL_EVACUATION_STATE: EvacuationState = {
  totalPeople: 356,
  evacuated: 243,
  inProgress: 89,
  remaining: 24,
  percent: 68,
  estimatedTimeMinutes: 275,
  elapsedMinutes: 138,
  averageSpeed: 1.8,
  timeline: INITIAL_TIMELINE,
  assemblyPoints: [
    { id: 'ap-1', label: 'AP-1 - Main Gate', goal: 120, current: 120, tone: 'bg-emerald-500' },
    { id: 'ap-2', label: 'AP-2 - North Yard', goal: 100, current: 95, tone: 'bg-cyan-500' },
    { id: 'ap-3', label: 'AP-3 - South Field', goal: 80, current: 80, tone: 'bg-violet-500' },
    { id: 'ap-4', label: 'AP-4 - East Open Area', goal: 60, current: 56, tone: 'bg-amber-500' },
  ],
  riskZones: INITIAL_RISK_ZONES,
}

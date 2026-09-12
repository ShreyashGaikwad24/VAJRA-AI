import { lazy, Suspense } from 'react'

import { motion } from 'framer-motion'

import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard'

const DigitalTwinPage = lazy(async () => import('@/pages/DigitalTwinPage').then((module) => ({ default: module.DigitalTwinPage })))
const SituationRoomPage = lazy(async () => import('@/pages/SituationRoomPage').then((module) => ({ default: module.SituationRoomPage })))
const DecisionSimulationPage = lazy(async () => import('@/pages/DecisionSimulationPage').then((module) => ({ default: module.DecisionSimulationPage })))
const AICopilotPage = lazy(async () => import('@/pages/AICopilotPage').then((module) => ({ default: module.AICopilotPage })))
const EmergencyModePage = lazy(async () => import('@/pages/EmergencyModePage').then((module) => ({ default: module.EmergencyModePage })))
const IncidentReplayPage = lazy(async () => import('@/pages/IncidentReplayPage').then((module) => ({ default: module.IncidentReplayPage })))
const EvacuationPlannerPage = lazy(async () => import('@/pages/EvacuationPlannerPage').then((module) => ({ default: module.EvacuationPlannerPage })))
const AnalyticsInsightsPage = lazy(async () => import('@/pages/AnalyticsInsightsPage').then((module) => ({ default: module.AnalyticsInsightsPage })))
const ReportsPage = lazy(async () => import('@/pages/ReportsPage').then((module) => ({ default: module.ReportsPage })))
const SopKnowledgePage = lazy(async () => import('@/pages/SopKnowledgePage').then((module) => ({ default: module.SopKnowledgePage })))
const AlertsNotificationsPage = lazy(async () => import('@/pages/AlertsNotificationsPage').then((module) => ({ default: module.AlertsNotificationsPage })))
const PermitManagementPage = lazy(async () => import('@/pages/PermitManagementPage').then((module) => ({ default: module.PermitManagementPage })))
const UserManagementPage = lazy(async () => import('@/pages/UserManagementPage').then((module) => ({ default: module.UserManagementPage })))
const SystemSettingsPage = lazy(async () => import('@/pages/SystemSettingsPage').then((module) => ({ default: module.SystemSettingsPage })))

type MainWorkspaceProps = {
  activeModule: 'Dashboard' | 'Digital Twin' | 'Situation Room' | 'Decision Simulation' | 'AI Copilot' | 'Emergency Mode' | 'Incident Replay' | 'Evacuation Planner' | 'Analytics & Insights' | 'Reports' | 'SOP & Knowledge Base' | 'Alerts & Notifications' | 'Permit Management' | 'User Management' | 'System Settings'
}

const LAZY_FALLBACK = (
  <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.14em] text-muted-foreground">
    Loading…
  </div>
)

export function MainWorkspace({ activeModule }: MainWorkspaceProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.08 }}
      className="flex h-full min-h-0 flex-col overflow-auto border-r border-border/80 bg-background/80"
      aria-label="Main workspace"
    >
      {activeModule === 'Dashboard' ? (
        <ExecutiveDashboard />
      ) : activeModule === 'Decision Simulation' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <DecisionSimulationPage />
        </Suspense>
      ) : activeModule === 'AI Copilot' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <AICopilotPage />
        </Suspense>
      ) : activeModule === 'Emergency Mode' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <EmergencyModePage />
        </Suspense>
      ) : activeModule === 'Incident Replay' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <IncidentReplayPage />
        </Suspense>
      ) : activeModule === 'Evacuation Planner' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <EvacuationPlannerPage />
        </Suspense>
      ) : activeModule === 'Analytics & Insights' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <AnalyticsInsightsPage />
        </Suspense>
      ) : activeModule === 'Reports' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <ReportsPage />
        </Suspense>
      ) : activeModule === 'SOP & Knowledge Base' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <SopKnowledgePage />
        </Suspense>
      ) : activeModule === 'Alerts & Notifications' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <AlertsNotificationsPage />
        </Suspense>
      ) : activeModule === 'Permit Management' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <PermitManagementPage />
        </Suspense>
      ) : activeModule === 'User Management' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <UserManagementPage />
        </Suspense>
      ) : activeModule === 'System Settings' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <SystemSettingsPage />
        </Suspense>
      ) : activeModule === 'Situation Room' ? (
        <Suspense fallback={LAZY_FALLBACK}>
          <SituationRoomPage />
        </Suspense>
      ) : (
        <Suspense fallback={LAZY_FALLBACK}>
          <DigitalTwinPage />
        </Suspense>
      )}
    </motion.section>
  )
}

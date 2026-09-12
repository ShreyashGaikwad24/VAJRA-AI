import { useEffect, useState } from 'react'

import { BottomTimeline } from '@/components/layout/BottomTimeline'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { MainWorkspace } from '@/components/layout/MainWorkspace'
import { RightAIPanel } from '@/components/layout/RightAIPanel'
import { TopCommandBar } from '@/components/layout/TopCommandBar'
import { cn } from '@/utils/cn'

type AppModule =
  | 'Dashboard'
  | 'Digital Twin'
  | 'Situation Room'
  | 'Decision Simulation'
  | 'AI Copilot'
  | 'Emergency Mode'
  | 'Incident Replay'
  | 'Evacuation Planner'
  | 'Analytics & Insights'
  | 'Reports'
  | 'SOP & Knowledge Base'
  | 'Alerts & Notifications'
  | 'Permit Management'
  | 'User Management'
  | 'System Settings'

const moduleRoutes: Record<AppModule, string> = {
  Dashboard: '/',
  'Digital Twin': '/digital-twin',
  'Situation Room': '/situation-room',
  'Decision Simulation': '/decision-simulation',
  'AI Copilot': '/ai-copilot',
  'Emergency Mode': '/emergency-mode',
  'Incident Replay': '/incident-replay',
  'Evacuation Planner': '/evacuation-planner',
  'Analytics & Insights': '/analytics-insights',
  Reports: '/reports',
  'SOP & Knowledge Base': '/sop-knowledge',
  'Alerts & Notifications': '/alerts-notifications',
  'Permit Management': '/permit-management',
  'User Management': '/user-management',
  'System Settings': '/system-settings',
}

const moduleLabels: Record<AppModule, string> = {
  Dashboard: 'Executive Dashboard',
  'Digital Twin': 'Digital Twin',
  'Situation Room': 'AI Situation Room',
  'Decision Simulation': 'Decision Simulation',
  'AI Copilot': 'AI Copilot',
  'Emergency Mode': 'Emergency Mode',
  'Incident Replay': 'Incident Replay',
  'Evacuation Planner': 'Evacuation Planner',
  'Analytics & Insights': 'Analytics & Insights',
  Reports: 'Reports',
  'SOP & Knowledge Base': 'SOP & Knowledge Base',
  'Alerts & Notifications': 'Alerts & Notifications',
  'Permit Management': 'Permit Management',
  'User Management': 'User Management',
  'System Settings': 'System Settings',
}

function moduleFromPath(pathname: string): AppModule {
  const entry = (Object.entries(moduleRoutes) as [AppModule, string][]).find(([, route]) => route === pathname)
  return entry?.[0] ?? 'Dashboard'
}

export function CommandCenterLayout() {
  const [activeModule, setActiveModule] = useState<AppModule>(() => moduleFromPath(window.location.pathname))

  const navigateTo = (module: AppModule, replace = false) => {
    setActiveModule(module)
    const route = moduleRoutes[module]
    if (window.location.pathname !== route) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', route)
    }
  }

  useEffect(() => {
    document.title = `${moduleLabels[activeModule]} | SAFE AI`
  }, [activeModule])

  useEffect(() => {
    const handlePopState = () => setActiveModule(moduleFromPath(window.location.pathname))
    const handleNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ module?: string }>).detail?.module
      if (detail) {
        const module = detail === 'AI Situation Room' ? 'Situation Room' : detail
        if (module in moduleRoutes) navigateTo(module as AppModule)
      }
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('safe:module-change', handleNavigate)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('safe:module-change', handleNavigate)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.12),transparent_38%)]" />
      <TopCommandBar activeModule={activeModule} />

      <div className={cn('relative z-10 grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-20')}>
        <div className="hidden min-h-0 md:col-span-3 md:block lg:col-span-3">
          <LeftSidebar
            activeItem={activeModule}
            onSelectItem={(item) => navigateTo(item as AppModule)}
          />
        </div>

        <div
          className={cn(
            'min-h-0 md:col-span-17',
            activeModule === 'Dashboard' ? 'lg:col-span-13' : 'lg:col-span-17',
          )}
        >
          <MainWorkspace
            activeModule={
              activeModule as
                | 'Dashboard'
                | 'Digital Twin'
                | 'Situation Room'
                | 'Decision Simulation'
                | 'AI Copilot'
                | 'Emergency Mode'
                | 'Incident Replay'
                | 'Evacuation Planner'
                | 'Analytics & Insights'
                | 'Reports'
                | 'SOP & Knowledge Base'
                | 'Alerts & Notifications'
                | 'Permit Management'
                | 'User Management'
                | 'System Settings'
            }
          />
        </div>

        {activeModule === 'Dashboard' ? (
          <div className="hidden min-h-0 lg:col-span-4 lg:block">
            <RightAIPanel />
          </div>
        ) : null}
      </div>

      {activeModule === 'Dashboard' ? (
        <div className="relative z-10 border-t border-border/70 bg-background/80 p-2 lg:hidden">
          <RightAIPanel />
        </div>
      ) : null}

      {activeModule === 'Dashboard' ? <BottomTimeline /> : null}
    </div>
  )
}

import { Sidebar } from '@/components/layout/Sidebar'

type LeftSidebarProps = {
  activeItem:
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
  onSelectItem: (item: string) => void
}

export function LeftSidebar({ activeItem, onSelectItem }: LeftSidebarProps) {
  return <Sidebar activeItem={activeItem} onSelectItem={onSelectItem} />
}

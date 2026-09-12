import { motion } from 'framer-motion'
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  FileText,
  Gauge,
  LineChart,
  Radar,
  Settings,
  ShieldAlert,
  Sparkles,
  Tv,
  Users,
} from 'lucide-react'

import { cn } from '@/utils/cn'

type SidebarProps = {
  activeItem?: string
  onSelectItem?: (item: string) => void
}

const sidebarItems = [
  { label: 'Executive Dashboard', icon: Gauge },
  { label: 'Digital Twin', icon: Tv },
  { label: 'AI Situation Room', icon: Radar },
  { label: 'Decision Simulation', icon: Sparkles },
  { label: 'AI Copilot', icon: Bot },
  { label: 'Emergency Mode', icon: ShieldAlert },
  { label: 'Incident Replay', icon: Activity },
  { label: 'Evacuation Planner', icon: Activity },
  { label: 'Analytics & Insights', icon: LineChart },
  { label: 'Reports', icon: FileText },
  { label: 'SOP & Knowledge Base', icon: BookOpen },
  { label: 'Alerts & Notifications', icon: Bell },
  { label: 'Permit Management', icon: BookOpen },
  { label: 'User Management', icon: Users },
  { label: 'System Settings', icon: Settings },
]

export function Sidebar({ activeItem = 'Dashboard', onSelectItem }: SidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex h-full flex-col border-r border-border/80 bg-card/85 px-2 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm"
      aria-label="Primary navigation"
    >
      <div className="mb-3 flex items-center gap-2 px-1.5">
        <div className="flex size-8 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
          <ShieldAlert className="size-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">SAFE AI</div>
          <div className="text-[7px] uppercase tracking-[0.12em] text-muted-foreground">Command Center</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {sidebarItems.map(({ label, icon: Icon }) => {
          const isActive =
            label === activeItem ||
            (label === 'Executive Dashboard' && activeItem === 'Dashboard') ||
            (label === 'AI Situation Room' && activeItem === 'Situation Room')
          const canOpen = [
            'Executive Dashboard',
            'Digital Twin',
            'AI Situation Room',
            'Decision Simulation',
            'AI Copilot',
            'Emergency Mode',
            'Analytics & Insights',
            'Reports',
            'SOP & Knowledge Base',
            'Alerts & Notifications',
            'Permit Management',
          ].includes(label) || label === 'Incident Replay' || label === 'Evacuation Planner' || label === 'User Management' || label === 'System Settings'

          return (
            <button
              key={label}
              type="button"
              aria-label={label}
              aria-disabled={!canOpen}
              title={label}
              onClick={() => {
                if (canOpen) {
                  onSelectItem?.(
                    label === 'Executive Dashboard'
                      ? 'Dashboard'
                      : label === 'AI Situation Room'
                        ? 'Situation Room'
                        : label,
                  )
                }
              }}
              className={cn(
                'group flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-[10px] font-medium transition-all',
                isActive
                  ? 'border-primary/70 bg-primary/15 text-primary shadow-[0_0_24px_rgba(59,130,246,0.2)]'
                  : 'border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-background/70 hover:text-foreground',
                !canOpen && 'cursor-not-allowed opacity-70',
              )}
            >
              <Icon className="size-3.5 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-4 space-y-2 rounded-md border border-border/70 bg-background/40 p-2">
        {activeItem === 'Analytics & Insights' || activeItem === 'Reports' || activeItem === 'SOP & Knowledge Base' || activeItem === 'Alerts & Notifications' || activeItem === 'Permit Management' ? (
          <>
            <div className="text-[8px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
              {activeItem === 'Reports'
                ? 'REPORT SHORTCUTS'
                : activeItem === 'SOP & Knowledge Base'
                  ? 'SOP SHORTCUTS'
                  : activeItem === 'Alerts & Notifications'
                    ? 'QUICK SHORTCUTS'
                    : activeItem === 'Permit Management'
                      ? 'PERMIT SHORTCUTS'
                      : 'Insight Shortcuts'}
            </div>
            <div className="space-y-1.5 text-[9px] text-slate-200">
              {(activeItem === 'Reports'
                ? ['Daily Report', 'Weekly Report', 'Monthly Report', 'Incident Report', 'Compliance Report', 'Custom Report']
                : activeItem === 'SOP & Knowledge Base'
                  ? ['Emergency Shutdown', 'Fire Response', 'Evacuation Procedure', 'First Aid Guide', 'Spill Response']
                  : activeItem === 'Alerts & Notifications'
                    ? ['Active Alerts', 'Alert History', 'Notification Log', 'Escalation Matrix', 'Contact Directory']
                    : activeItem === 'Permit Management'
                      ? ['Create New Permit', 'My Permits', 'Permit Register', 'Expired Permits', 'Cancelled Permits']
                      : ['Risk Analysis', 'Trend Analysis', 'Incident Analysis', 'Performance Summary', 'Predictive Insights']
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center justify-between rounded border border-border/70 bg-background/55 px-2 py-1.5 transition hover:border-primary/40 hover:text-primary"
                >
                  <span>{item}</span>
                  <span className="text-cyan-300">→</span>
                </button>
              ))}
            </div>
            <div className="mt-2 rounded border border-border/70 bg-background/45 p-2">
              <div className="text-[7px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                {activeItem === 'Reports'
                  ? 'Custom Reports'
                  : activeItem === 'SOP & Knowledge Base'
                    ? 'SOP Templates'
                    : activeItem === 'Alerts & Notifications'
                      ? 'Create New Alert'
                      : activeItem === 'Permit Management'
                        ? 'Permit Drafts'
                        : 'Custom Reports'}
              </div>
              <div className="mt-2 space-y-1.5 text-[8px] text-slate-300">
                {(activeItem === 'Alerts & Notifications'
                  ? ['High Temperature', 'Gas Leak', 'Fire Sensor', 'Permit Deviation']
                  : activeItem === 'SOP & Knowledge Base'
                    ? ['Safety Summary', 'Emergency Response', 'Cycle Review']
                    : activeItem === 'Permit Management'
                      ? ['Hot Work Permit', 'Confined Space Entry', 'Electrical Permit']
                      : ['Safety Summary', 'Incident Snapshot', 'Risk Heatmap']
                ).map((item) => (
                  <div key={item} className="rounded border border-border/70 bg-background/55 px-2 py-1">{item}</div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-[8px] font-semibold uppercase tracking-[0.14em] text-red-300">
              {activeItem === 'Evacuation Planner' ? 'EVACUATION SHORTCUT' : 'Emergency Shortcut'}
            </div>
            <div className="space-y-1.5 text-[9px] text-red-100">
              {(activeItem === 'Evacuation Planner'
                ? ['Start Evacuation', 'Evacuation Drill', 'Assembly Points', 'Head Count', 'Evacuation Report']
                : ['Activate Sirens', 'Mass Alert', 'Shutdown Systems', 'Emergency Contacts']
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center justify-between rounded border border-red-500/30 bg-red-500/10 px-2 py-1.5 transition hover:bg-red-500/15"
                >
                  <span>{item}</span>
                  <span className="text-red-200">→</span>
                </button>
              ))}
            </div>
            <div className="mt-1.5 rounded border border-red-500/30 bg-red-500/10 px-2 py-1.5">
              <div className="text-[7px] font-bold uppercase tracking-[0.14em] text-red-200">Emergency Contacts</div>
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded border border-red-500/40 bg-red-500/15 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.18)]"
            >
              {activeItem === 'Evacuation Planner' ? 'END EVACUATION' : 'END EMERGENCY MODE'}
            </button>
          </>
        )}
      </div>

      <div className="mt-2 rounded-md border border-border/70 bg-background/40 p-2">
        <div className="text-[8px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Plant Context</div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-semibold text-foreground">Jamnagar Refinery</div>
            <div className="text-[8px] text-muted-foreground">Zone C • R-101</div>
          </div>
          <div className="rounded border border-success/40 bg-success/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-success">
            Live
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

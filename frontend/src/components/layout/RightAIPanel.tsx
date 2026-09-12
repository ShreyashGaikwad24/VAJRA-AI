import { motion } from 'framer-motion'
import { AlertTriangle, BadgeCheck, BellDot, ShieldAlert, Siren, UserRoundX, WifiOff } from 'lucide-react'

import { Panel } from '@/components/cards/Panel'
import { SectionTitle } from '@/components/layout/SectionTitle'
import { ScrollArea } from '@/components/ui/scroll-area'

const notificationEvents = [
  { id: 'n-1', time: '10:41', message: 'New Critical Alert', priority: 'Critical', tone: 'critical', icon: AlertTriangle },
  { id: 'n-2', time: '10:39', message: 'Emergency Activated', priority: 'High', tone: 'danger', icon: Siren },
  { id: 'n-3', time: '10:37', message: 'AI Recommendation Issued', priority: 'Medium', tone: 'warning', icon: BellDot },
  { id: 'n-4', time: '10:35', message: 'Permit Approved', priority: 'Info', tone: 'success', icon: BadgeCheck },
  { id: 'n-5', time: '10:33', message: 'Sensor Offline', priority: 'High', tone: 'danger', icon: WifiOff },
  { id: 'n-6', time: '10:31', message: 'Worker Evacuated', priority: 'Critical', tone: 'critical', icon: UserRoundX },
  { id: 'n-7', time: '10:29', message: 'Gas Leak Detected', priority: 'Critical', tone: 'critical', icon: ShieldAlert },
]

export function RightAIPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.08 }}
      className="flex h-full min-h-0 flex-col bg-background/70 p-2"
      aria-label="AI live feed panel"
    >
      <Panel className="flex min-h-0 flex-1 flex-col p-2.5">
        <SectionTitle
          title="Live Notifications"
          subtitle="Critical operational stream"
          className="border-b border-border/70 pb-2"
        />
        <ScrollArea className="min-h-0 flex-1 pt-2">
          <ul className="space-y-1.5">
            {notificationEvents.slice(0, 5).map((item) => {
              const Icon = item.icon
              const tone = item.tone === 'critical' ? 'border-critical/35 bg-critical/10 text-critical' : item.tone === 'danger' ? 'border-danger/35 bg-danger/10 text-danger' : item.tone === 'warning' ? 'border-warning/35 bg-warning/10 text-warning' : 'border-success/35 bg-success/10 text-success'
              const pulse = item.tone === 'critical' || item.tone === 'danger' ? 'bg-critical' : item.tone === 'warning' ? 'bg-warning' : 'bg-success'
              return (
                <li key={item.id} className="group rounded-md border border-border/70 bg-background/55 px-2 py-1.5 transition-colors hover:bg-background/70">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex size-5 items-center justify-center rounded-md border ${tone}`}>
                      <Icon className="size-3" />
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{item.time}</span>
                    <span className={`ml-auto rounded-md border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] ${tone}`}>{item.priority}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${pulse} animate-status-blink`} />
                    <p className="truncate text-[11px] text-foreground">{item.message}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </Panel>
    </motion.aside>
  )
}

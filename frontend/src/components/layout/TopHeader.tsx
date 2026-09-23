import { motion } from 'framer-motion'
import { AlertTriangle, Factory } from 'lucide-react'

import { NotificationBell } from '@/components/common/NotificationBell'
import { ProfileMenu } from '@/components/common/ProfileMenu'
import { RiskBadge } from '@/components/common/RiskBadge'
import { SearchBox } from '@/components/common/SearchBox'
import { StatusBadge } from '@/components/common/StatusBadge'
import { riskLevelFromScore } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'

export function TopHeader({ activeModule }: { activeModule: string }) {
  const riskScores = usePlantStore((state) => state.riskScores)
  const backendConnected = usePlantStore((state) => state.backendConnected)

  const riskLevel = riskLevelFromScore(riskScores.cri)
  const badgeRiskLevel = riskLevel === 'safe' ? 'low' : riskLevel

  const now = new Date()
  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="h-13 border-b border-border/80 bg-card/75 px-2.5 backdrop-blur-md sm:px-4"
    >
      <div className="flex h-full items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background/70 px-2.5 py-1">
            <Factory className="size-3.5 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">SAFE AI</span>
          </div>
          <div className="hidden items-center gap-1.5 lg:flex">
            <StatusBadge
  label={`Plant Status: ${backendConnected ? 'Online' : 'Offline'}`}
  variant={backendConnected ? 'stable' : 'active'}
/>
<StatusBadge label="Shift: A · SIM" variant="active" />
            <span className="max-w-52 truncate rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
              {activeModule}
            </span>
          </div>
        </div>

        <div className="hidden w-full max-w-sm lg:block">
          <SearchBox />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="hidden rounded-md border border-border/80 bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground md:inline-flex">
            {timeLabel}
          </span>
          <NotificationBell />
          <ProfileMenu />
          <div className="hidden md:block">
            <RiskBadge level={badgeRiskLevel} />
          </div>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-2.5 text-[11px] font-semibold text-destructive"
          >
            <AlertTriangle className="size-3.5" />
            Emergency
          </button>
        </div>
      </div>
    </motion.header>
  )
}

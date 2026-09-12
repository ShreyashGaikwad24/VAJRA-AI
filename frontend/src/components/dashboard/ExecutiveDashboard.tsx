import { motion } from 'framer-motion'

import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { FooterStatusBar } from '@/components/dashboard/FooterStatusBar'
import { DashboardFeedPanel } from '@/components/dashboard/DashboardFeedPanel'
import { HeatMapCard } from '@/components/dashboard/HeatMapCard'
import { PlantOverviewCard } from '@/components/dashboard/PlantOverviewCard'
import { RecommendationPanel } from '@/components/dashboard/RecommendationPanel'
import { RecentAlertList } from '@/components/dashboard/RecentAlertList'
import { RiskContributorList } from '@/components/dashboard/RiskContributorList'
import { executiveKpis } from '@/constants/executiveDashboard'

export function ExecutiveDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-3 md:p-3.5"
    >
      <DashboardHeader />

      <KPIGrid items={executiveKpis} />

      <div className="grid min-h-0 items-stretch gap-2.5">
        <div className="h-full">
          <PlantOverviewCard />
        </div>
      </div>

      <div className="grid min-h-0 items-stretch gap-2.5">
        <div className="h-full">
          <HeatMapCard />
        </div>
      </div>

      <div className="grid min-h-0 items-stretch gap-2.5 xl:grid-cols-2 xl:auto-rows-fr">
        <div className="h-full">
          <RiskContributorList />
        </div>

        <div className="h-full">
          <RecommendationPanel />
        </div>
      </div>

      <div className="grid min-h-0 items-stretch gap-2.5 xl:grid-cols-2 xl:auto-rows-fr">
        <div className="h-full">
          <RecentAlertList />
        </div>

        <div className="h-full">
          <DashboardFeedPanel />
        </div>
      </div>

      <FooterStatusBar />
    </motion.div>
  )
}

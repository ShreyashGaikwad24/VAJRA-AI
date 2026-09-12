import { motion } from 'framer-motion'

import { AnalyticsInsightsLayout } from '@/modules/analyticsInsights/components/AnalyticsInsightsLayout'

export function AnalyticsInsightsPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="flex h-full min-h-0 flex-col overflow-hidden p-3"
      aria-label="Analytics & Insights"
    >
      <AnalyticsInsightsLayout />
    </motion.section>
  )
}

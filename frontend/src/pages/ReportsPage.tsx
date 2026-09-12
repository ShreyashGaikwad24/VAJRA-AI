import { motion } from 'framer-motion'

import { ReportsLayout } from '@/modules/reports/components/ReportsLayout'

export function ReportsPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="flex h-full min-h-0 flex-col overflow-hidden p-3"
      aria-label="Reports"
    >
      <ReportsLayout />
    </motion.section>
  )
}

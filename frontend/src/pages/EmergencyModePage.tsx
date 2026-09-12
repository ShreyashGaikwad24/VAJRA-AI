import { motion } from 'framer-motion'

import { EmergencyModeLayout } from '@/modules/emergency/components/EmergencyModeLayout'

export function EmergencyModePage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="flex h-full min-h-0 flex-col overflow-hidden p-3"
      aria-label="Emergency Mode"
    >
      <EmergencyModeLayout />
    </motion.section>
  )
}

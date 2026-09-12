import { motion } from 'framer-motion'

import { PermitManagementLayout } from '@/modules/permitManagement/components/PermitManagementLayout'

export function PermitManagementPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="flex h-full min-h-0 flex-col overflow-hidden p-3"
      aria-label="Permit Management"
    >
      <PermitManagementLayout />
    </motion.section>
  )
}

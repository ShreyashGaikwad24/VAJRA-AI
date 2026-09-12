import { motion } from 'framer-motion'

import { UserManagementLayout } from '@/modules/userManagement/components/UserManagementLayout'

export function UserManagementPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="flex h-full min-h-0 flex-col overflow-hidden p-3"
      aria-label="User Management"
    >
      <UserManagementLayout />
    </motion.section>
  )
}

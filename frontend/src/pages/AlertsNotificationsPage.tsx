import { motion } from 'framer-motion'

import { AlertsNotificationsLayout } from '@/modules/alertsNotifications/components/AlertsNotificationsLayout'

export function AlertsNotificationsPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="flex h-full min-h-0 flex-col overflow-hidden p-3"
      aria-label="Alerts and Notifications"
    >
      <AlertsNotificationsLayout />
    </motion.section>
  )
}

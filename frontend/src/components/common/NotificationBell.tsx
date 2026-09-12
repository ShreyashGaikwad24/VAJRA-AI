import { Bell } from 'lucide-react'

export function NotificationBell() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative inline-flex size-8 items-center justify-center rounded-md border border-border/80 bg-card/70 text-muted-foreground transition-all hover:border-primary/60 hover:text-foreground"
    >
      <Bell className="size-3.5" />
      <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
    </button>
  )
}

import { ChevronDown, UserRound } from 'lucide-react'

export function ProfileMenu() {
  return (
    <button
      type="button"
      aria-label="Profile menu"
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/80 bg-card/70 px-2 text-xs text-foreground transition-all hover:border-primary/50"
    >
      <span className="inline-flex size-5 items-center justify-center rounded-md bg-primary/15 text-primary">
        <UserRound className="size-3" />
      </span>
      <span className="hidden sm:inline">Operator</span>
      <ChevronDown className="size-3 text-muted-foreground" />
    </button>
  )
}

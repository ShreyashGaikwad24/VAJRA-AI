import { Search } from 'lucide-react'

import { cn } from '@/utils/cn'

type SearchBoxProps = {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchBox({ placeholder = 'Search modules, assets, events...', className, value, onChange }: SearchBoxProps) {
  return (
    <label
      className={cn(
        'flex h-8.5 w-full items-center gap-2 rounded-md border border-border/80 bg-card/70 px-2.5 text-muted-foreground shadow-inner shadow-black/20 transition-colors focus-within:border-primary/60',
        className,
      )}
    >
      <Search className="size-3.5" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
    </label>
  )
}

import { ChevronDown } from 'lucide-react'

import { cn } from '@/utils/cn'

type SelectFieldProps = {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  className?: string
}

export function SelectField({ label, value, options, onChange, className }: SelectFieldProps) {
  return (
    <label className={cn('block min-w-0', className)}>
      <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-md border border-border/70 bg-[#0f1725] px-2.5 py-1.5 pr-8 text-[10px] text-foreground outline-none transition focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-slate-900 text-foreground">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-cyan-300" />
      </div>
    </label>
  )
}

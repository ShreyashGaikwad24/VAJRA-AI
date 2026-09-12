import type { ReactNode } from 'react'

import { SectionTitle } from '@/components/layout/SectionTitle'

type PageHeaderProps = {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card/70 px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <SectionTitle title={title} subtitle={subtitle} action={action} />
    </div>
  )
}

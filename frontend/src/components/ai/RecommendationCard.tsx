import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

import { Card } from '@/components/cards/Card'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { ActionButton } from '@/components/common/ActionButton'
import { StatusBadge } from '@/components/common/StatusBadge'

type RecommendationCardProps = {
  priority: 1 | 2 | 3 | 4
  category: string
  title: string
  detail: string
  action: string
  impact: string
  eta: string
  zones: string[]
  confidence: string
  status: string
  riskReduction: string
  departments: string[]
  executionProgress: number
  priorityScore: number
  aiExplanation: string
  relatedEquipment: string[]
}

export function RecommendationCard({
  priority,
  category,
  title,
  detail,
  action,
  impact,
  eta,
  zones,
  confidence,
  status,
  riskReduction,
  departments,
  executionProgress,
  priorityScore,
  aiExplanation,
  relatedEquipment,
}: RecommendationCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
      <Card className="bg-card/85">
        <div className="grid gap-2 lg:grid-cols-[1.35fr,1fr,auto] lg:items-center">
          <div className="flex items-start gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="size-3.5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h4 className="text-[13px] font-semibold text-foreground">{title}</h4>
                <PriorityBadge level={priority} />
                <span className="rounded-md border border-border/70 bg-background/60 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{category}</span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5">
              <p className="uppercase tracking-[0.14em] text-muted-foreground">Impact</p>
              <p className="mt-0.5 text-xs font-medium text-foreground">{impact}</p>
            </div>
            <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5">
              <p className="uppercase tracking-[0.14em] text-muted-foreground">ETA</p>
              <p className="mt-0.5 text-xs font-medium text-foreground">{eta}</p>
            </div>
            <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5">
              <p className="uppercase tracking-[0.14em] text-muted-foreground">Risk Reduction</p>
              <p className="mt-0.5 text-xs font-medium text-success">{riskReduction}</p>
            </div>
            <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1.5">
              <p className="uppercase tracking-[0.14em] text-muted-foreground">Priority Score</p>
              <p className="mt-0.5 text-xs font-medium text-foreground">{priorityScore}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
            <StatusBadge label={`Confidence ${confidence}`} variant="active" />
            <StatusBadge label={status} variant="stable" />
            <ActionButton isActive className="h-7.5 px-2.5 text-[10px]">
              {action}
              <ArrowRight className="size-3.5" />
            </ActionButton>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
          {zones.map((zone) => (
            <span key={zone} className="rounded-md border border-border/70 bg-background/55 px-1.5 py-0.5 uppercase tracking-[0.12em] text-muted-foreground">
              {zone}
            </span>
          ))}
          {departments.map((dept) => (
            <span key={dept} className="rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 uppercase tracking-[0.12em] text-primary">
              {dept}
            </span>
          ))}
          {relatedEquipment.map((equipment) => (
            <span key={equipment} className="rounded-md border border-border/70 bg-background/55 px-1.5 py-0.5 uppercase tracking-[0.12em] text-muted-foreground">
              {equipment}
            </span>
          ))}
        </div>

        <div className="mt-1.5 space-y-1.5">
          <div className="h-1.25 overflow-hidden rounded-full bg-background/60">
            <div className="h-full rounded-full bg-linear-to-r from-primary via-success to-success transition-all duration-700" style={{ width: `${executionProgress}%` }} />
          </div>
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>Execution Progress {executionProgress}%</span>
            <span>Confidence Meter {confidence}</span>
          </div>
          <p className="rounded-md border border-border/70 bg-background/45 px-2 py-1.5 text-[10px] text-muted-foreground">AI Explanation: {aiExplanation}</p>
        </div>
      </Card>
    </motion.div>
  )
}

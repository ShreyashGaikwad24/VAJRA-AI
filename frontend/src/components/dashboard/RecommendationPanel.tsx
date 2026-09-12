import { ArrowRight } from 'lucide-react'

import { RecommendationCard } from '@/components/ai/RecommendationCard'
import { ActionButton } from '@/components/common/ActionButton'
import { Card } from '@/components/cards/Card'
import { recommendations } from '@/constants/executiveDashboard'

export function RecommendationPanel() {
  return (
    <Card title="AI Recommendations" subtitle="Static recommendation cards" className="h-full">
      <div className="space-y-2">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.title}
            priority={Number(recommendation.priority.replace(/\D/g, '')) as 1 | 2 | 3 | 4}
            category={recommendation.category}
            title={recommendation.title}
            detail={recommendation.detail}
            action={recommendation.action}
            impact={recommendation.impact}
            eta={recommendation.eta}
            zones={recommendation.zones}
            confidence={recommendation.confidence}
            status={recommendation.status}
            riskReduction={recommendation.riskReduction}
            departments={recommendation.departments}
            executionProgress={recommendation.executionProgress}
            priorityScore={recommendation.priorityScore}
            aiExplanation={recommendation.aiExplanation}
            relatedEquipment={recommendation.relatedEquipment}
          />
        ))}
        <div className="pt-0.5">
          <ActionButton isActive className="w-full justify-center">
            Review Recommendations
            <ArrowRight className="size-3.5" />
          </ActionButton>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">Network Health 98%</div>
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">Model Health Stable</div>
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">Latency 42 ms</div>
          <div className="rounded-md border border-border/70 bg-background/55 px-2 py-1">PLC Link Synced</div>
        </div>
      </div>
    </Card>
  )
}

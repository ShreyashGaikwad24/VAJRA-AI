import { Card } from '@/components/cards/Card'

type AIRecommendationPanelProps = {
  text: string
  checklist: string[]
}

export function AIRecommendationPanel({ text, checklist }: AIRecommendationPanelProps) {
  return (
    <Card title="AI Recommendation" subtitle="Model-generated rationale for selected intervention" className="border-primary/20">
      <p className="rounded border border-border/60 bg-background/30 p-2 text-[10px] leading-relaxed text-foreground/90 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
        {text}
      </p>

      <div className="mt-2 space-y-1 rounded border border-border/60 bg-background/30 p-2 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
        {checklist.length > 0 ? (
          checklist.map((item) => (
            <div key={item} className="text-[10px] text-foreground/90">
              <span className="mr-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-success/35 bg-success/10 text-[9px] text-success">✓</span>
              {item}
            </div>
          ))
        ) : (
          <p className="text-[10px] text-muted-foreground">Run simulation to generate action checklist.</p>
        )}
      </div>
    </Card>
  )
}

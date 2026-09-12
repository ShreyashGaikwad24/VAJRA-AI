import { CheckCircle2, Circle } from 'lucide-react'

import { usePlantStore } from '@/store/usePlantStore'

export function AIExplanationPanel() {
  const explanation = usePlantStore((s) => s.explanation)

  const confidenceColor =
    explanation.confidence >= 90 ? 'text-critical' :
    explanation.confidence >= 75 ? 'text-orange-500' :
    explanation.confidence >= 60 ? 'text-yellow-400' : 'text-success'

  const confidenceBg =
    explanation.confidence >= 90 ? 'bg-critical' :
    explanation.confidence >= 75 ? 'bg-orange-500' :
    explanation.confidence >= 60 ? 'bg-yellow-400' : 'bg-success'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">AI Explanation</span>
          <span className="ml-1.5 text-[9px] text-muted-foreground">(Why It Matters)</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {/* Explanation text */}
        <div className="mb-2.5 rounded-md border border-border/40 bg-background/25 p-2.5">
          <p className="text-[10px] leading-relaxed text-foreground/90">{explanation.text}</p>
        </div>

        {/* Evidence checklist */}
        <div className="mb-2.5 rounded-md border border-border/35 bg-background/20 p-2">
          <div className="mb-1.5 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Evidence</div>
          <div className="space-y-1">
            {explanation.evidence.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.active
                  ? <CheckCircle2 className="size-3 flex-shrink-0 text-success" />
                  : <Circle className="size-3 flex-shrink-0 text-border" />
                }
                <span className={`text-[9.5px] ${item.active ? 'text-foreground/90' : 'text-muted-foreground/60 line-through'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence score */}
        <div className="mb-2 rounded-md border border-border/40 bg-background/25 p-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Confidence Score</span>
            <span className={`text-[13px] font-bold tabular-nums ${confidenceColor}`}>{explanation.confidence}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-border/30">
            <div
              className={`h-full rounded-full transition-all duration-700 ${confidenceBg}`}
              style={{ width: `${explanation.confidence}%` }}
            />
          </div>
        </div>

        {/* Model info */}
        <div className="grid grid-cols-2 gap-1.5 text-[8.5px] text-muted-foreground">
          <div className="rounded-md border border-border/30 bg-background/20 px-2 py-1">
            <span className="text-[8px] uppercase tracking-[0.08em]">AI Model</span>
            <div className="mt-0.5 font-medium text-foreground">RiskPro-XGBoost v2.3</div>
          </div>
          <div className="rounded-md border border-border/30 bg-background/20 px-2 py-1">
            <span className="text-[8px] uppercase tracking-[0.08em]">Last Updated</span>
            <div className="mt-0.5 font-medium text-foreground">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} AM *
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

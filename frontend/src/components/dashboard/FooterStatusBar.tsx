import { Panel } from '@/components/cards/Panel'
import { footerStatusItems } from '@/constants/executiveDashboard'

export function FooterStatusBar() {
  return (
    <Panel className="px-2.5 py-2">
      <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-6">
        {footerStatusItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-md border border-border/70 bg-background/55 px-2.5 py-1.5 transition-all duration-300 hover:border-primary/30 hover:bg-background/70">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
              <p className="mt-0.5 text-[13px] font-medium text-foreground">{item.value}</p>
            </div>
            <span className={`size-1.5 rounded-full ${item.tone === 'success' ? 'bg-success' : item.tone === 'warning' ? 'bg-warning' : item.tone === 'danger' ? 'bg-danger' : item.tone === 'critical' ? 'bg-critical' : 'bg-primary'}`} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

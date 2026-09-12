import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { RiskLevel } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'

function riskHex(level: RiskLevel): string {
  switch (level) {
    case 'critical': return '#dc2626'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    case 'low': return '#22c55e'
    default: return '#3b82f6'
  }
}

function riskLabel(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'VERY HIGH'
    case 'high': return 'HIGH'
    case 'medium': return 'MODERATE'
    case 'low': return 'LOW'
    default: return 'SAFE'
  }
}

export function RiskForecastPanel() {
  const forecast = usePlantStore((s) => s.forecast)

  const openDecisionSimulation = () => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module: 'Decision Simulation' } }))
  }

  const color = riskHex(forecast.status)
  const label = riskLabel(forecast.status)

  const chartData = forecast.points.map((point) => ({
    minute: `${point.minute}m`,
    risk: Math.round(point.risk),
  }))

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">Risk Forecast (Next 1 Hr)</span>
        <button type="button" onClick={openDecisionSimulation} className="text-[9px] text-muted-foreground hover:text-foreground">View All</button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        <div className="mb-2">
          <div className="text-[8.5px] uppercase tracking-widest text-muted-foreground">Risk in next 60 minutes</div>
          <div className="mt-0.5 text-[24px] font-bold leading-none" style={{ color }}>{label}</div>
        </div>

        <div className="mb-2 grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-border/30 bg-background/30 p-1.5 text-center">
            <div className="text-[8px] text-muted-foreground">Probability</div>
            <div className="mt-0.5 text-sm font-bold" style={{ color }}>{forecast.probability}%</div>
          </div>
          <div className="rounded-md border border-border/30 bg-background/30 p-1.5 text-center">
            <div className="text-[8px] text-muted-foreground">Time to Critical</div>
            <div className="mt-0.5 text-sm font-bold text-foreground">{forecast.timeToCriticalMinutes} min</div>
          </div>
        </div>

        <div className="rounded-md border border-border/30 bg-[#081426] p-1" style={{ height: 88 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 6, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.56} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <XAxis dataKey="minute" tick={{ fill: '#64748b', fontSize: 7 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 7 }} tickLine={false} axisLine={false} ticks={[0, 50, 100]} />
              <Tooltip
                contentStyle={{ background: '#0c1725', border: '1px solid #1f3147', borderRadius: 4, fontSize: 9 }}
                labelStyle={{ color: '#a5b4c3', fontSize: 8 }}
              />
              <Area type="monotone" dataKey="risk" stroke={color} strokeWidth={2} fill="url(#forecastGrad)" dot={{ r: 1.6, fill: color, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

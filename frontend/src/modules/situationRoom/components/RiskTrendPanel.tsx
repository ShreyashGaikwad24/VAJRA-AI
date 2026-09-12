import { useMemo } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { usePlantStore } from '@/store/usePlantStore'

export function RiskTrendPanel() {
  const riskTrendHistory = usePlantStore((s) => s.riskTrendHistory)
  const riskScores = usePlantStore((s) => s.riskScores)

  const openAnalytics = () => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module: 'Analytics & Insights' } }))
  }

  const chartData = useMemo(() => {
    if (riskTrendHistory.length >= 8) {
      return riskTrendHistory.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        CRI: point.cri,
        PRI: point.pri,
        ERI: point.eri,
      }))
    }

    // Seed synthetic 24-hour history when insufficient data
    const now = Date.now()
    const baseCRI = riskScores.cri
    const basePRI = riskScores.pri
    const baseERI = riskScores.eri

    const synthetic = Array.from({ length: 24 }, (_, i) => {
      const hoursAgo = 24 - i
      const timestamp = now - hoursAgo * 3_600_000
      const t = i / 4
      return {
        time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        CRI: Math.max(5, Math.min(99, Math.round(baseCRI - (24 - i) * 0.7 + Math.sin(t) * 8))),
        PRI: Math.max(5, Math.min(99, Math.round(basePRI - (24 - i) * 0.55 + Math.cos(t) * 6))),
        ERI: Math.max(5, Math.min(99, Math.round(baseERI - (24 - i) * 0.3 + Math.sin(t + 1) * 5))),
      }
    })

    return [
      ...synthetic,
      ...riskTrendHistory.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        CRI: point.cri,
        PRI: point.pri,
        ERI: point.eri,
      })),
    ]
  }, [riskTrendHistory, riskScores])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">Risk Trend (Past 24 Hours)</span>
        <button type="button" onClick={openAnalytics} className="text-[9px] text-muted-foreground hover:text-foreground">View All</button>
      </div>

      <div className="min-h-0 flex-1 p-2">
        <div className="h-full rounded-md border border-border/30 bg-[#071321] p-1.5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#1f3147" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#64748b', fontSize: 8 }}
              tickLine={false}
              axisLine={{ stroke: '#1f3147' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 8 }}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                background: '#0c1725',
                border: '1px solid #1f3147',
                borderRadius: '6px',
                fontSize: 10,
              }}
              labelStyle={{ color: '#a5b4c3', fontSize: 9 }}
            />
            <Legend wrapperStyle={{ fontSize: 9, paddingTop: 4 }} />
              <Line type="monotone" dataKey="CRI" stroke="#ef4444" strokeWidth={2.1} dot={{ r: 1.7, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 3 }} name="CRI" />
              <Line type="monotone" dataKey="PRI" stroke="#f59e0b" strokeWidth={2.1} dot={{ r: 1.7, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 3 }} name="PRI" />
              <Line type="monotone" dataKey="ERI" stroke="#8b5cf6" strokeWidth={2.1} dot={{ r: 1.7, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 3 }} name="ERI" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

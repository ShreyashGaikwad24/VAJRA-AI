import { AlertTriangle, Info } from 'lucide-react'
import { useMemo } from 'react'

import type { RiskLevel } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'

function riskLevelLabel(cri: number): RiskLevel {
  if (cri >= 80) return 'critical'
  if (cri >= 60) return 'high'
  if (cri >= 40) return 'medium'
  if (cri >= 20) return 'low'
  return 'safe'
}

function riskLabelText(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'CRITICAL RISK'
    case 'high': return 'HIGH RISK'
    case 'medium': return 'MEDIUM RISK'
    case 'low': return 'LOW RISK'
    default: return 'SAFE'
  }
}

function riskHex(level: RiskLevel): string {
  switch (level) {
    case 'critical': return '#dc2626'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    case 'low': return '#22c55e'
    default: return '#3b82f6'
  }
}

function riskTwText(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'text-critical'
    case 'high': return 'text-orange-500'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-success'
    default: return 'text-primary'
  }
}

function polarToSVG(angleDeg: number, cx: number, cy: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

function gaugeArcPath(fromValue: number, toValue: number, cx: number, cy: number, r: number): string {
  const startAngle = 225 - (fromValue / 100) * 270
  const swept = ((Math.max(fromValue + 0.01, toValue) - fromValue) / 100) * 270
  const endAngle = startAngle - swept
  const start = polarToSVG(startAngle, cx, cy, r)
  const end = polarToSVG(endAngle, cx, cy, r)
  const largeArc = swept > 180 ? 1 : 0
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

function CRIGauge({ value }: { value: number }) {
  const cx = 87
  const cy = 87
  const r = 64
  const level = riskLevelLabel(value)
  const color = riskHex(level)

  const bgStart = polarToSVG(225, cx, cy, r)
  const bgEnd = polarToSVG(-45, cx, cy, r)
  const bgPath = `M ${bgStart.x.toFixed(2)} ${bgStart.y.toFixed(2)} A ${r} ${r} 0 1 0 ${bgEnd.x.toFixed(2)} ${bgEnd.y.toFixed(2)}`

  const segments: Array<{ from: number; to: number; color: string }> = [
    { from: 0, to: 20, color: '#22c55e' },
    { from: 20, to: 40, color: '#84cc16' },
    { from: 40, to: 60, color: '#eab308' },
    { from: 60, to: 80, color: '#f97316' },
    { from: 80, to: 100, color: '#dc2626' },
  ]

  const segPaths = segments.map(({ from, to, color: segColor }) => {
    return { path: gaugeArcPath(from, to, cx, cy, r), color: segColor }
  })

  const fillPath = gaugeArcPath(0, value, cx, cy, r)

  const ticks = Array.from({ length: 21 }, (_, i) => {
    const pct = i * 5
    const angle = 225 - (pct / 100) * 270
    const outer = polarToSVG(angle, cx, cy, r + 9)
    const inner = polarToSVG(angle, cx, cy, r + (i % 4 === 0 ? 2 : 5))
    return { key: pct, outer, inner }
  })

  const needleAngle = 225 - (value / 100) * 270
  const needleTip = polarToSVG(needleAngle, cx, cy, r - 6)

  return (
    <svg viewBox="0 0 174 150" className="mx-auto w-full max-w-[240px]">
      {/* Background arc */}
      <path d={bgPath} fill="none" stroke="#0f2133" strokeWidth="13" strokeLinecap="round" />

      {/* Segmented track */}
      {segPaths.map((seg, i) => (
        <path key={i} d={seg.path} fill="none" stroke={seg.color} strokeWidth="13" opacity="0.34" strokeLinecap="butt" />
      ))}

      {/* Major/minor ticks */}
      {ticks.map((tick) => (
        <line
          key={tick.key}
          x1={tick.inner.x}
          y1={tick.inner.y}
          x2={tick.outer.x}
          y2={tick.outer.y}
          stroke="#6b7f98"
          opacity={tick.key % 20 === 0 ? 0.8 : 0.45}
          strokeWidth={tick.key % 20 === 0 ? 1.4 : 0.9}
        />
      ))}

      {/* Value fill arc */}
      <path d={fillPath} fill="none" stroke={color} strokeWidth="13" strokeLinecap="round" />
      {/* Glow effect */}
      <path d={fillPath} fill="none" stroke={color} strokeWidth="17" strokeLinecap="round" opacity="0.18" />

      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill={color} />

      {/* Center value */}
      <text x={cx} y={cy - 7} textAnchor="middle" fill="#dbe8ff" fontSize="19" fontWeight="700" fontFamily="ui-sans-serif, system-ui">
        CRI
      </text>
      <text x={cx} y={cy + 17} textAnchor="middle" fill={color} fontSize="46" fontWeight="800" fontFamily="ui-monospace, SFMono-Regular, Menlo">
        {value}
      </text>

      {/* Risk level text */}
      <text x={cx} y={cy + 35} textAnchor="middle" fill={color} fontSize="8.5" fontWeight="700" letterSpacing="1.7">
        {riskLabelText(level)}
      </text>

      {/* Scale labels */}
      <text x={bgStart.x - 4} y={bgStart.y + 10} textAnchor="middle" fill="#64748b" fontSize="8">0</text>
      <text x={bgEnd.x + 4} y={bgEnd.y + 10} textAnchor="middle" fill="#64748b" fontSize="8">100</text>
    </svg>
  )
}

type MetricRowProps = { label: string; abbr: string; value: number; max?: number }

function MetricRow({ label, abbr, value, max = 99 }: MetricRowProps) {
  const level = riskLevelLabel(value)
  const color = riskHex(level)
  const textColor = riskTwText(level)

  return (
    <div className="flex items-center gap-2.5 rounded-md border border-border/25 bg-background/20 px-2 py-1">
      <span className="w-7 text-[10px] font-bold text-muted-foreground">{abbr}</span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground">{label}</span>
          <span className={`text-[12px] font-bold tabular-nums ${textColor}`}>{value}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border/40">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  )
}

export function RiskOverviewPanel() {
  const riskScores = usePlantStore((s) => s.riskScores)
  const riskSummary = usePlantStore((s) => s.riskSummary)
  const criLevel = useMemo(() => riskLevelLabel(riskScores.cri), [riskScores.cri])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">Risk Overview</span>
        <div className={`flex items-center gap-1 rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase ${
          criLevel === 'critical' ? 'border-critical/50 bg-critical/15 text-critical' :
          criLevel === 'high' ? 'border-orange-500/50 bg-orange-500/15 text-orange-500' :
          'border-yellow-400/50 bg-yellow-400/15 text-yellow-400'
        }`}>
          <AlertTriangle className="size-2.5" />
          {riskLabelText(criLevel)}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="grid gap-2 xl:grid-cols-[1.05fr_1fr] xl:items-center">
          <CRIGauge value={riskScores.cri} />

          <div className="space-y-1.5">
            <MetricRow abbr="CRI" label="Critical Risk Index" value={riskScores.cri} />
            <MetricRow abbr="PRI" label="Predictive Risk Index" value={riskScores.pri} />
            <MetricRow abbr="ERI" label="Exposure Risk Index" value={riskScores.eri} />
            <MetricRow abbr="SRI" label="Safety Readiness Index" value={riskScores.sri} />
          </div>
        </div>

        {riskSummary && (
          <div className="mt-3 rounded-md border border-border/50 bg-background/35 p-2.5">
            <div className="mb-1 flex items-center gap-1">
              <Info className="size-3 text-warning" />
              <span className="text-[9px] font-semibold uppercase text-warning">Risk Summary</span>
            </div>
            <p className="text-[9px] leading-relaxed text-muted-foreground">{riskSummary}</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  Bot,
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  FileText,
  Factory,
  FolderOpen,
  Gauge,
  MessageSquareText,
  Paperclip,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Thermometer,
  Wind,
} from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Panel } from '@/components/cards/Panel'
import { riskLevelFromScore, riskLevelLabel } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'
import { cn } from '@/utils/cn'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
  time: string
}

const suggestedQuestions = [
  'Show me the temperature trend of R-101',
  'What actions can reduce this risk?',
  'Show similar past incidents',
  'What is the impact if this risk escalates?',
  'Show affected permits in this area',
]

const suggestedActions = [
  'Analyze Current Risks',
  'Check Permit Conflicts',
  'View Incident History',
  'Generate Safety Report',
  'Review Maintenance',
  'Weather Impact Analysis',
]

const quickQuestions = [
  'What is the current CRI?',
  'Show me active incidents',
  'Which permits are expiring?',
  'Any weather alerts?',
  'Show high risk zones',
  'Generate daily safety summary',
]

const knowledgeDocs = [
  'SOP-12 High Temp Management',
  'SOP-27 Gas Leak Response',
  'Reactor Unit (R-101) Manual',
  'Incident Report INC-2024-1178',
  'Temperature Limits Reference',
]

function formatTime(value: Date) {
  return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(value: Date) {
  return value.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
}

function getRiskTone(level: string) {
  switch (level) {
    case 'critical':
      return 'text-red-400 border-red-500/40 bg-red-500/10'
    case 'high':
      return 'text-orange-300 border-orange-500/40 bg-orange-500/10'
    case 'medium':
      return 'text-amber-300 border-amber-500/40 bg-amber-500/10'
    case 'low':
      return 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10'
    default:
      return 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10'
  }
}

function buildCopilotReply(query: string, context: {
  cri: number
  temperature: number
  riskLevel: string
  activeIncidents: number
  weather: number
  permits: number
  recommendations: string[]
  incidentTitle: string
  similarIncident: string
}) {
  const text = query.toLowerCase()

  if (text.includes('risk') || text.includes('main risk') || text.includes('current risk')) {
    return `The main current risk is concentrated in Reactor Unit R-101. The CRI is ${context.cri}, classified as ${context.riskLevel.toUpperCase()}, with a temperature of ${Math.round(context.temperature)}°C and elevated thermal stress in the hot work zone.`
  }

  if (text.includes('r-101') || text.includes('temperature')) {
    return `R-101 is running at ${Math.round(context.temperature)}°C, which is above the normal operating envelope and remains the primary thermal risk in the plant. The current trajectory indicates sustained overheating and a narrow response window.`
  }

  if (text.includes('incident') || text.includes('active incidents')) {
    return `${context.activeIncidents} active incidents are currently tracked, with the most significant being ${context.incidentTitle}. The current forecast remains elevated due to thermal drift and concurrent permit activity.`
  }

  if (text.includes('zone') || text.includes('high risk') || text.includes('risk zones')) {
    return `The highest-risk zone is Zone C — Hot Work, where R-101 sits. Secondary concern includes processing areas with active permit overlap and elevated thermal exposure.`
  }

  if (text.includes('action') || text.includes('reduce') || text.includes('risk reduction')) {
    return `Priority actions are to reduce feed rate, increase cooling water throughput, and tighten maintenance coordination. The recommended controls are: ${context.recommendations.join('; ')}.`
  }

  if (text.includes('permit') || text.includes('permits')) {
    return `${context.permits} permits are active in the current operating window, with permit overlap and hot-work controls presenting additional risk exposure near R-101.`
  }

  if (text.includes('weather') || text.includes('wind')) {
    return `Current weather is contributing a moderate risk multiplier. Wind is at ${context.weather} km/h, which increases spread potential and operational sensitivity in hot work and process areas.`
  }

  if (text.includes('similar') || text.includes('past incident') || text.includes('incident history')) {
    return `The closest historical analogue is ${context.similarIncident}. It reflects the same thermal drift pattern, permit overlap, and elevated process loads in a reactor hot-work zone.`
  }

  if (text.includes('report') || text.includes('summary')) {
    return `The current safety summary is critical: CRI ${context.cri}, Reactor R-101 at ${Math.round(context.temperature)}°C, ${context.activeIncidents} active incidents, and ${context.permits} active permits. Prioritize cooling, hot-work controls, and permit coordination.`
  }

  if (text.includes('cri') || text.includes('current cri')) {
    return `Current CRI is ${context.cri}. This indicates a ${context.riskLevel.toUpperCase()} risk posture with elevated temperature and process volatility.`
  }

  return 'My current knowledge scope is limited to this plant’s live sensor, risk, permit, and SOP context. Please ask about current risk, R-101 temperature, active incidents, high-risk zones, permit conflicts, or weather impacts.'
}

export function AICopilotLayout() {
  const initialize = usePlantStore((state) => state.initialize)
  const plantName = usePlantStore((state) => state.plantName)
  const equipment = usePlantStore((state) => state.equipment)
  const riskScores = usePlantStore((state) => state.riskScores)
  const overview = usePlantStore((state) => state.overview)
  const forecast = usePlantStore((state) => state.forecast)
  const recommendations = usePlantStore((state) => state.recommendations)
  const patternMatch = usePlantStore((state) => state.patternMatch)
  const telemetryContext = usePlantStore((state) => state.telemetryContext)

  useEffect(() => {
    initialize()
  }, [initialize])

  const [inputValue, setInputValue] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'I can help with live plant risk analysis, temperature trend checks, permit conflicts, and incident investigation. Ask me anything about current safety conditions.',
      time: formatTime(new Date()),
    },
  ])

  const reactor = useMemo(() => equipment.find((item) => item.id === 'R-101'), [equipment])
  const riskLevel = riskLevelFromScore(riskScores.cri)
  const riskTone = getRiskTone(riskLevel)

  const replyContext = useMemo(
    () => ({
      cri: riskScores.cri,
      temperature: reactor?.temperature ?? 0,
      riskLevel: riskLevelLabel(riskLevel),
      activeIncidents: overview.openIncidents,
      weather: telemetryContext.weatherWind,
      permits: overview.activePermits,
      recommendations: recommendations.slice(0, 3).map((item) => item.title),
      incidentTitle: patternMatch.incident.title || 'Reactor thermal excursion',
      similarIncident: patternMatch.incident.title || 'Thermal drift at reactor manifold',
    }),
    [overview, patternMatch, recommendations, reactor, riskLevel, riskScores, telemetryContext],
  )

  const handleSend = (queryOverride?: string) => {
    const query = (queryOverride ?? inputValue).trim()
    if (!query) return

    const now = formatTime(new Date())

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', text: query, time: now },
      {
        id: `assistant-${Date.now() + 1}`,
        role: 'assistant',
        text: buildCopilotReply(query, replyContext),
        time: now,
      },
    ])

    setInputValue('')
  }

  const navigateTo = (module: string) => {
    window.dispatchEvent(new CustomEvent('safe:module-change', { detail: { module } }))
  }

  const focusGlobalSearch = () => {
    const input = document.querySelector('input[placeholder="Search modules, assets, events..."]') as HTMLInputElement | null
    input?.focus()
  }

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length > 0) {
      setAttachedFiles((current) => [...current, ...files.map((file) => file.name)])
    }
    event.target.value = ''
  }

  const askAboutDocument = (documentName: string) => {
    handleSend(`Summarize ${documentName} and explain how it relates to the current plant risk.`)
  }

  const headerDate = formatDate(new Date())
  const headerTime = formatTime(new Date())

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      <header className="rounded-lg border border-border/80 bg-card/90 px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3 border-b border-border/35 pb-1.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
                <Shield className="size-4 text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">S.A.F.E AI</div>
                <div className="text-[7px] uppercase tracking-[0.14em] text-muted-foreground">SMART AI FOR FACTORY SAFETY &amp; EMERGENCY</div>
              </div>
            </div>

            <h1 className="mt-1 text-sm font-bold uppercase tracking-[0.09em] text-foreground">
              AI Copilot — Intelligent Assistant
            </h1>
            <p className="text-[9px] text-muted-foreground">
              Your AI Partner for Plant Safety, Risk Analysis &amp; Decision Support
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/60 px-2 text-[10px] text-foreground">
              Plant: {plantName}
            </div>
            <span className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/60 px-2 text-[10px] text-muted-foreground">
              {headerDate} {headerTime}
            </span>
            <StatusBadge label="Operational" variant="stable" />
            <button type="button" title="Search" onClick={focusGlobalSearch} className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground">
              <Search className="size-3.5" />
            </button>
            <button type="button" title="Alerts and notifications" onClick={() => navigateTo('Alerts & Notifications')} className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground">
              <Bell className="size-3.5" />
            </button>
            <button type="button" title="Help and guidance" onClick={() => handleSend('What can you help me with?')} className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground">
              <CircleHelp className="size-3.5" />
            </button>
            <button type="button" title="System settings" onClick={() => navigateTo('System Settings')} className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground">
              <Settings className="size-3.5" />
            </button>
            <button type="button" onClick={() => navigateTo('User Management')} className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/60 px-2 text-[10px] font-medium text-foreground">Safety Head</button>
            <button type="button" onClick={() => navigateTo('System Settings')} className="inline-flex h-7 items-center rounded-md border border-border/80 bg-background/60 px-2 text-[10px] font-medium text-foreground">Administrator</button>
            <span className="inline-flex h-7 items-center justify-center rounded-md border border-primary/35 bg-primary/10 px-2 text-[10px] font-medium text-primary">SH</span>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-muted-foreground">
          <span className="uppercase tracking-[0.14em] text-cyan-400/90">AI Copilot Workspace</span>
          <span className="rounded border border-border/60 bg-background/45 px-1.5 py-0.5 uppercase tracking-[0.12em]">Live Safety Intelligence</span>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(0,2.25fr)_340px]">
        <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
          <Panel className="flex items-center gap-3 border-border/80 bg-card/80 p-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
              <Bot className="size-4" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-foreground">Hello Safety Head! 👋</div>
              <div className="text-[10px] text-muted-foreground">How can I help you today?</div>
            </div>
          </Panel>

          <div className="grid min-h-0 gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(240px,0.8fr)]">
            <Panel className="border-border/80 bg-card/80 p-3">
              <div className="rounded-md border border-border/70 bg-background/35 p-2 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.22)]">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-md border border-primary/35 bg-primary/10 text-primary">
                      <MessageSquareText className="size-3.5" />
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">User Query</div>
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground">Now</span>
                </div>
                <div className="text-[11px] leading-5 text-foreground">
                  What is the main risk right now in the plant?
                </div>
              </div>

              <div className="mt-2 rounded-md border border-primary/25 bg-primary/5 p-2">
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md border border-primary/35 bg-primary/10 text-primary">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.14em] text-primary">AI Response</div>
                </div>
                <p className="text-[10px] leading-5 text-foreground/90">
                  The principal risk is in Reactor Unit R-101, where {Math.round(reactor?.temperature ?? 0)}°C operating temperature and elevated gas conditions indicate escalating thermal stress. The current CRI is {riskScores.cri}, and the hot-work zone is experiencing the highest risk concentration.
                </p>
              </div>
            </Panel>

            <Panel className="border-border/80 bg-card/80 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Suggested Follow-up Questions</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handleSend(question)}
                    className="rounded-md border border-border/80 bg-background/40 px-2 py-1.5 text-left text-[9px] text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid min-h-0 gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
            <Panel className="border-border/80 bg-card/80 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md border border-primary/35 bg-primary/10 text-primary">
                    <Factory className="size-3.5" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.14em] text-cyan-400/90">Risk Summary</div>
                    <div className="text-[12px] font-semibold text-foreground">Reactor Unit (R-101)</div>
                  </div>
                </div>
                <div className={cn('rounded border px-1.5 py-0.5 text-[8px] font-semibold uppercase', riskTone)}>
                  {riskLevelLabel(riskLevel)}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[1.05fr_1.2fr]">
                <div className="relative h-44 overflow-hidden rounded border border-border/60 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.22),transparent_40%),linear-gradient(180deg,#0a1220,#05111a)]">
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute left-[20%] top-[62%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-md border border-primary/40 bg-primary/15 shadow-[0_0_18px_rgba(59,130,246,0.25)]" />
                  <div className="absolute left-[42%] top-[58%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-md border border-primary/40 bg-primary/15 shadow-[0_0_18px_rgba(59,130,246,0.25)]" />
                  <div className="absolute left-[70%] top-[52%] h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-md border border-primary/40 bg-primary/15 shadow-[0_0_20px_rgba(59,130,246,0.25)]" />
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded border border-primary/40 bg-background/80 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.09em] text-primary">
                    <Thermometer className="size-2.5" />
                    R-101
                  </div>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className="font-semibold text-foreground">{riskLevelLabel(riskLevel)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                    <span className="text-muted-foreground">CRI Score</span>
                    <span className="font-semibold text-red-400">{riskScores.cri}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                    <span className="text-muted-foreground">Primary Risk</span>
                    <span className="font-semibold text-foreground">Thermal Drift</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                    <span className="text-muted-foreground">Secondary Risk</span>
                    <span className="font-semibold text-foreground">Gas Accumulation</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                    <span className="text-muted-foreground">Affected Area</span>
                    <span className="font-semibold text-foreground">Zone C — Hot Work</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                    <span className="text-muted-foreground">Probability</span>
                    <span className="font-semibold text-amber-300">{forecast.probability}%</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                    <span className="text-muted-foreground">Potential Impact</span>
                    <span className="font-semibold text-foreground">Severe thermal event</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                    <span className="text-muted-foreground">Recommended Action</span>
                    <span className="font-semibold text-foreground">Reduce feed rate</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('Situation Room')}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary/20"
              >
                View in AI Situation Room
                <ChevronRight className="size-3" />
              </button>
            </Panel>

            <Panel className="border-border/80 bg-card/80 p-3">
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Plant Status Snapshot</div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded border border-border/60 bg-background/35 p-2">
                  <div className="text-muted-foreground">CRI Score</div>
                  <div className="mt-1 text-[14px] font-bold text-red-400">{riskScores.cri}</div>
                </div>
                <div className="rounded border border-border/60 bg-background/35 p-2">
                  <div className="text-muted-foreground">Active Incidents</div>
                  <div className="mt-1 text-[14px] font-bold text-amber-300">{overview.openIncidents}</div>
                </div>
                <div className="rounded border border-border/60 bg-background/35 p-2">
                  <div className="text-muted-foreground">Open Permits</div>
                  <div className="mt-1 text-[14px] font-bold text-foreground">{overview.activePermits}</div>
                </div>
                <div className="rounded border border-border/60 bg-background/35 p-2">
                  <div className="text-muted-foreground">Active Workers</div>
                  <div className="mt-1 text-[14px] font-bold text-foreground">{overview.onSiteWorkers}</div>
                </div>
                <div className="rounded border border-border/60 bg-background/35 p-2">
                  <div className="text-muted-foreground">Weather</div>
                  <div className="mt-1 flex items-center gap-1 text-[13px] font-bold text-cyan-300">
                    <Wind className="size-3" />
                    {telemetryContext.weatherWind} km/h
                  </div>
                </div>
                <div className="rounded border border-border/60 bg-background/35 p-2">
                  <div className="text-muted-foreground">System Status</div>
                  <div className="mt-1 text-[12px] font-bold text-emerald-300">Operational</div>
                </div>
              </div>
            </Panel>
          </div>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Ask the Copilot</div>
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1 rounded border border-border/70 bg-background/45 px-1.5 py-0.5 hover:text-foreground">
                  <Paperclip className="size-2.5" />
                  Attach
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1 rounded border border-border/70 bg-background/45 px-1.5 py-0.5 hover:text-foreground">
                  <FolderOpen className="size-2.5" />
                  Files
                </button>
              </div>
            </div>

            <div className="rounded-md border border-border/70 bg-background/45 p-2">
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFilesSelected} />
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask me anything about plant safety, risks, incidents, SOPs..."
                className="h-28 w-full resize-none bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <button type="button" title="Attach files" onClick={() => fileInputRef.current?.click()} className="rounded border border-border/70 bg-background/50 p-1.5 hover:text-foreground">
                    <Paperclip className="size-3" />
                  </button>
                  <button type="button" title="Choose documents" onClick={() => fileInputRef.current?.click()} className="rounded border border-border/70 bg-background/50 p-1.5 hover:text-foreground">
                    <FileText className="size-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary/20"
                >
                  Send
                  <Send className="size-3" />
                </button>
              </div>
              {attachedFiles.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1 border-t border-border/60 pt-2">
                  {attachedFiles.map((fileName, index) => (
                    <button
                      key={`${fileName}-${index}`}
                      type="button"
                      title="Remove attachment"
                      onClick={() => setAttachedFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                      className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[8px] text-primary"
                    >
                      {fileName}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </Panel>

          <div className="grid gap-3 xl:grid-cols-3">
            <Panel className="border-border/80 bg-card/80 p-3">
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Suggested Actions</div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedActions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSend(item)}
                    className="rounded-md border border-border/80 bg-background/40 px-2 py-1 text-[9px] text-foreground hover:border-primary/40 hover:bg-primary/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel className="border-border/80 bg-card/80 p-3">
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Recent Conversations</div>
              <div className="space-y-1.5 text-[10px] text-foreground/90">
                <button type="button" onClick={() => handleSend('Show me the temperature trend of R-101')} className="flex w-full items-center justify-between gap-2 rounded border border-border/70 bg-background/35 px-2 py-1 text-left hover:border-primary/40">
                  <span>R-101 temperature trend</span>
                  <span className="text-[8px] text-muted-foreground">09:42</span>
                </button>
                <button type="button" onClick={() => handleSend('Check permit overlap')} className="flex w-full items-center justify-between gap-2 rounded border border-border/70 bg-background/35 px-2 py-1 text-left hover:border-primary/40">
                  <span>Permit overlap check</span>
                  <span className="text-[8px] text-muted-foreground">08:36</span>
                </button>
                <button type="button" onClick={() => handleSend('What are the risk reduction options?')} className="flex w-full items-center justify-between gap-2 rounded border border-border/70 bg-background/35 px-2 py-1 text-left hover:border-primary/40">
                  <span>Risk reduction options</span>
                  <span className="text-[8px] text-muted-foreground">07:11</span>
                </button>
              </div>
            </Panel>

            <Panel className="border-border/80 bg-card/80 p-3">
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Quick Questions</div>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handleSend(question)}
                    className="rounded-md border border-border/80 bg-background/40 px-2 py-1 text-[9px] text-foreground hover:border-primary/40 hover:bg-primary/10"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          <div className="rounded-lg border border-border/80 bg-card/90 p-2">
            <div className="flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">
              <span>Latest Support Messages</span>
              <span className="text-muted-foreground">{messages.length} items</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {messages.slice(-3).map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'rounded border px-2 py-1.5 text-[10px] leading-5',
                    message.role === 'assistant'
                      ? 'border-primary/30 bg-primary/5 text-foreground/90'
                      : 'border-border/60 bg-background/35 text-foreground/90',
                  )}
                >
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <span className="font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {message.role === 'assistant' ? 'AI' : 'User'}
                    </span>
                    <span className="text-[8px] text-muted-foreground">{message.time}</span>
                  </div>
                  <div>{message.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex min-h-0 flex-col gap-3">
          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md border border-primary/35 bg-primary/10 text-primary">
                  <Gauge className="size-3.5" />
                </div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Knowledge Context</div>
              </div>
              <div className="rounded border border-success/40 bg-success/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-success">Live</div>
            </div>

            <p className="text-[9px] leading-5 text-muted-foreground">
              The assistant uses live plant systems, SOP data, known incidents, permits, maintenance rhythms, and industry best practices to support operational decisions.
            </p>

            <div className="mt-3 space-y-1.5">
              {[
                'Live Sensor Data',
                'SOP & Procedures',
                'Past Incidents DB',
                'Permit System',
                'Maintenance History',
                'Weather Service',
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded border border-border/60 bg-background/35 px-2 py-1 text-[9px] text-foreground">
                  <span>{item}</span>
                  <span className="inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">Related Documents</div>
            <div className="space-y-1.5">
              {knowledgeDocs.map((doc, index) => (
                <button key={doc} type="button" onClick={() => askAboutDocument(doc)} className="flex w-full items-center justify-between gap-2 rounded border border-border/60 bg-background/35 px-2 py-1.5 text-left hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded border border-primary/35 bg-primary/10 text-primary">
                      {index % 2 === 0 ? <FileText className="size-3" /> : <BriefcaseBusiness className="size-3" />}
                    </div>
                    <span className="text-[9px] text-foreground">{doc}</span>
                  </div>
                  <ChevronRight className="size-3 text-muted-foreground" />
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-400/90">AI Copilot Capabilities</div>
            <div className="space-y-1.5 text-[9px] text-foreground/90">
              {[
                'Real-time Risk Analysis',
                'Predictive Insights',
                'SOP Guidance',
                'Incident Investigation',
                'Decision Support',
                'Natural Language Queries',
              ].map((capability) => (
                <div key={capability} className="flex items-center gap-2 rounded border border-border/60 bg-background/35 px-2 py-1">
                  <span className="inline-flex size-2 rounded-full bg-cyan-400" />
                  {capability}
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'

import {
  Bell,
  Check,
  ChevronDown,
  Database,
  Gauge,
  HelpCircle,
  History,
  Loader2,
  Mail,
  Moon,
  RefreshCw,
  Settings,
  ShieldCheck,
  SunMedium,
  Users,
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { MetricCard } from '@/components/cards/MetricCard'
import { Panel } from '@/components/cards/Panel'
import { SelectField } from '@/components/common/SelectField'
import { cn } from '@/utils/cn'
import { riskLevelFromScore } from '@/data/plant/types'
import { usePlantStore } from '@/store/usePlantStore'

const tabs = ['General', 'Notifications', 'Security', 'Integrations', 'Data & Retention', 'Backup & Restore', 'System Maintenance', 'Audit Log'] as const

type SystemSettingsTab = (typeof tabs)[number]

type ToggleRowProps = {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-background/35 px-2.5 py-2">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold text-foreground">{label}</div>
        <div className="mt-0.5 text-[8px] leading-4 text-muted-foreground">{description}</div>
      </div>
      <button
        type="button"
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 items-center rounded-full border transition-colors',
          checked ? 'border-cyan-500/60 bg-cyan-500/30' : 'border-border/80 bg-slate-800/70',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'left-[calc(100%-0.9rem)]' : 'left-0.5',
          )}
        />
      </button>
    </div>
  )
}

function SettingsSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Panel className={cn('border-border/80 bg-card/80 p-3', className)}>
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">{title}</div>
      <div className="space-y-2.5">{children}</div>
    </Panel>
  )
}

function InfoRow({ label, value, progress }: { label: string; value: string; progress?: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[9px] text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      {typeof progress === 'number' ? (
        <div className="h-1.5 rounded-full bg-background/60">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </div>
  )
}

function ActionButton({ label, sublabel, tone = 'default', onClick }: { label: string; sublabel: string; tone?: 'default' | 'danger'; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start justify-between gap-3 rounded-md border px-2.5 py-2 text-left transition-colors',
        tone === 'danger' ? 'border-red-500/40 bg-red-500/10 text-red-100' : 'border-border/70 bg-background/40 text-slate-100 hover:border-primary/40 hover:text-primary',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold text-foreground">{label}</div>
        <div className="mt-0.5 text-[8px] leading-4 text-muted-foreground">{sublabel}</div>
      </div>
      <ChevronDown className="mt-1 size-3.5 rotate-[-90deg] text-muted-foreground" />
    </button>
  )
}

export function SystemSettingsLayout() {
  const plantName = usePlantStore((state) => state.plantName)
  const riskScores = usePlantStore((state) => state.riskScores)
  const backendConnected = usePlantStore((state) => state.backendConnected)
  const currentRiskLevel = riskLevelFromScore(riskScores.cri)

  const [activeTab, setActiveTab] = useState<SystemSettingsTab>('General')
  const [saveState, setSaveState] = useState<'idle' | 'success'>('idle')
  const [connectionTestState, setConnectionTestState] = useState<'idle' | 'running' | 'success'>('idle')
  const [statusText, setStatusText] = useState('')

  const [systemName, setSystemName] = useState('S.A.F.E AI - Jamnagar Refinery')
  const [organizationName, setOrganizationName] = useState('Jamnagar Refinery')
  const [timezone, setTimezone] = useState('(GMT+05:30) Asia/Kolkata')
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY')
  const [timeFormat, setTimeFormat] = useState('12 Hour (AM/PM)')
  const [language, setLanguage] = useState('English')

  const [theme, setTheme] = useState('Dark')
  const [primaryColor, setPrimaryColor] = useState('Blue')
  const [sidebarLayout, setSidebarLayout] = useState('Expanded')
  const [refreshInterval, setRefreshInterval] = useState('30 Seconds')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  const [realTimeUpdates, setRealTimeUpdates] = useState(true)
  const [autoLogout, setAutoLogout] = useState(true)
  const [autoLogoutMinutes, setAutoLogoutMinutes] = useState('30 min')
  const [dataAnalytics, setDataAnalytics] = useState(true)
  const [auditLogging, setAuditLogging] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const [smtpServer, setSmtpServer] = useState('smtp.jamref.com')
  const [smtpPort, setSmtpPort] = useState('587')
  const [emailAddress, setEmailAddress] = useState('alerts@jamref.com')
  const [connectionSecurity, setConnectionSecurity] = useState('TLS')

  const [escalationTime, setEscalationTime] = useState('5 Minutes')
  const [escalationLevels, setEscalationLevels] = useState('4 Levels')
  const [escalationPolicy, setEscalationPolicy] = useState('Sequential')

  const [incidentRetention, setIncidentRetention] = useState('7 Years')
  const [logRetention, setLogRetention] = useState('3 Years')
  const [analyticsRetention, setAnalyticsRetention] = useState('2 Years')

  useEffect(() => {
    if (saveState !== 'success') return
    const timer = window.setTimeout(() => setSaveState('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [saveState])

  useEffect(() => {
    if (connectionTestState !== 'success') return
    const timer = window.setTimeout(() => setConnectionTestState('idle'), 2200)
    return () => window.clearTimeout(timer)
  }, [connectionTestState])

  const handleSave = () => {
    setSaveState('success')
    setStatusText('Changes saved successfully')
  }

  const handleTestConnection = () => {
    setConnectionTestState('running')
    setStatusText('Testing SMTP connection…')
    window.setTimeout(() => {
      setConnectionTestState('success')
      setStatusText('SMTP connection successful')
    }, 1200)
  }

  const handleQuickAction = (label: string) => {
    setStatusText(`${label} initiated`)
  }

  const overviewCards = [
    { title: 'System Version', value: 'v2.4.1', description: 'Latest Version', tone: 'default', trend: 'flat' as const, icon: Settings, sparkline: [150, 170, 177, 190, 206, 220, 238, 248] },
    { title: 'Last Updated', value: '16 May 2025', description: '10:15 AM', tone: 'default', trend: 'flat' as const, icon: History, sparkline: [120, 130, 142, 155, 169, 181, 190, 198] },
    { title: 'System Uptime', value: '15d 6h 24m', description: '99.9% Availability', tone: 'success', trend: 'up' as const, icon: Gauge, sparkline: [18, 22, 24, 26, 30, 32, 38, 44] },
    { title: 'Database Status', value: 'Healthy', description: 'All systems operational', tone: 'success', trend: 'flat' as const, icon: Database, sparkline: [28, 24, 26, 21, 19, 18, 16, 17] },
    { title: 'Active Sessions', value: '24', description: 'Users online', tone: 'default', trend: 'flat' as const, icon: Users, sparkline: [8, 10, 14, 13, 12, 15, 18, 20] },
  ]

  const renderGeneral = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">System Overview</div>
        <button type="button" onClick={handleSave} className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-primary shadow-[0_0_18px_rgba(59,130,246,0.16)] transition hover:border-primary/60">
          {saveState === 'success' ? 'Saved' : 'Save All Changes'}
        </button>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-5">
        {overviewCards.map((item, index) => (
          <MetricCard
            key={item.title}
            label={item.title}
            value={item.value}
            description={item.description}
            tone={item.tone as 'default' | 'success' | 'warning' | 'danger' | 'critical'}
            trend={item.trend}
            icon={item.icon}
            sparkline={item.sparkline}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[1.2fr_1.1fr_0.9fr]">
        <div className="space-y-2.5">
          <SettingsSection title="General Settings">
            <div className="space-y-2.5">
              <label className="block">
                <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">System Name</span>
                <input value={systemName} onChange={(event) => setSystemName(event.target.value)} className="w-full rounded-md border border-border/70 bg-[#0d1724] px-2.5 py-1.5 text-[10px] text-foreground outline-none ring-0 transition focus:border-cyan-500/70" />
              </label>
              <label className="block">
                <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Organization Name</span>
                <input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} className="w-full rounded-md border border-border/70 bg-[#0d1724] px-2.5 py-1.5 text-[10px] text-foreground outline-none ring-0 transition focus:border-cyan-500/70" />
              </label>
              <SelectField label="Timezone" value={timezone} options={['(GMT+05:30) Asia/Kolkata', '(GMT+00:00) UTC', '(GMT-05:00) America/New_York']} onChange={setTimezone} />
              <div className="grid gap-2 sm:grid-cols-2">
                <SelectField label="Date Format" value={dateFormat} options={['DD MMM YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']} onChange={setDateFormat} />
                <SelectField label="Time Format" value={timeFormat} options={['12 Hour (AM/PM)', '24 Hour (24H)']} onChange={setTimeFormat} />
              </div>
              <SelectField label="Language" value={language} options={['English', 'Hindi', 'Arabic']} onChange={setLanguage} />
            </div>
          </SettingsSection>

          <SettingsSection title="Email Settings">
            <div className="space-y-2.5">
              <label className="block">
                <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">SMTP Server</span>
                <input value={smtpServer} onChange={(event) => setSmtpServer(event.target.value)} className="w-full rounded-md border border-border/70 bg-[#0d1724] px-2.5 py-1.5 text-[10px] text-foreground outline-none ring-0 transition focus:border-cyan-500/70" />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">SMTP Port</span>
                  <input value={smtpPort} onChange={(event) => setSmtpPort(event.target.value)} className="w-full rounded-md border border-border/70 bg-[#0d1724] px-2.5 py-1.5 text-[10px] text-foreground outline-none ring-0 transition focus:border-cyan-500/70" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Email Address</span>
                  <input value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} className="w-full rounded-md border border-border/70 bg-[#0d1724] px-2.5 py-1.5 text-[10px] text-foreground outline-none ring-0 transition focus:border-cyan-500/70" />
                </label>
              </div>
              <SelectField label="Connection Security" value={connectionSecurity} options={['TLS', 'SSL', 'STARTTLS']} onChange={setConnectionSecurity} />
              <button type="button" onClick={handleTestConnection} className="flex w-full items-center justify-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-400/60">
                {connectionTestState === 'running' ? <Loader2 className="size-3.5 animate-spin" /> : <Mail className="size-3.5" />}
                {connectionTestState === 'success' ? 'Connection OK' : connectionTestState === 'running' ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </SettingsSection>
        </div>

        <div className="space-y-2.5">
          <SettingsSection title="Appearance Settings">
            <div className="space-y-2.5">
              <div className="space-y-1.5">
                <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Theme</div>
                <div className="grid grid-cols-3 gap-2">
                  {['Dark', 'Light', 'System'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTheme(option)}
                      className={cn(
                        'flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] transition',
                        theme === option ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300' : 'border-border/70 bg-background/35 text-muted-foreground',
                      )}
                    >
                      {option === 'Dark' ? <Moon className="size-3" /> : option === 'Light' ? <SunMedium className="size-3" /> : <Settings className="size-3" />}
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[8px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Primary Color</div>
                <div className="flex flex-wrap gap-2">
                  {['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'pink'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={color}
                      onClick={() => setPrimaryColor(color.charAt(0).toUpperCase() + color.slice(1))}
                      className={cn(
                        'relative flex size-6 items-center justify-center rounded-full border-2 transition',
                        primaryColor.toLowerCase() === color ? 'border-white' : 'border-transparent',
                      )}
                      style={{ backgroundColor: color === 'red' ? '#ef4444' : color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'purple' ? '#8b5cf6' : color === 'orange' ? '#f59e0b' : color === 'cyan' ? '#06b6d4' : '#ec4899' }}
                    >
                      {primaryColor.toLowerCase() === color ? <Check className="size-3 text-white" /> : null}
                    </button>
                  ))}
                </div>
              </div>

              <SelectField label="Sidebar Layout" value={sidebarLayout} options={['Expanded', 'Collapsed', 'Compact']} onChange={setSidebarLayout} />
              <SelectField label="Dashboard Refresh Interval" value={refreshInterval} options={['10 Seconds', '30 Seconds', '60 Seconds']} onChange={setRefreshInterval} />
              <div className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-background/35 px-2.5 py-2">
                <div>
                  <div className="text-[10px] font-semibold text-foreground">Enable Animations</div>
                </div>
                <button type="button" onClick={() => setAnimationsEnabled((value) => !value)} className={cn('relative inline-flex h-5 w-9 items-center rounded-full border transition-colors', animationsEnabled ? 'border-cyan-500/60 bg-cyan-500/30' : 'border-border/80 bg-slate-800/70')}>
                  <span className={cn('absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform', animationsEnabled ? 'left-[calc(100%-0.9rem)]' : 'left-0.5')} />
                </button>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Alert Escalation Settings">
            <SelectField label="Default Escalation Time" value={escalationTime} options={['5 Minutes', '10 Minutes', '15 Minutes']} onChange={setEscalationTime} />
            <SelectField label="Max Escalation Levels" value={escalationLevels} options={['4 Levels', '3 Levels', '5 Levels']} onChange={setEscalationLevels} />
            <SelectField label="Escalation Policy" value={escalationPolicy} options={['Sequential', 'Parallel', 'Hybrid']} onChange={setEscalationPolicy} />
            <button type="button" className="flex w-full items-center justify-between rounded-md border border-border/70 bg-background/35 px-2.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-foreground hover:border-primary/40 hover:text-primary">
              <span>Manage Escalation Rules</span>
              <ChevronDown className="size-3.5 rotate-[-90deg]" />
            </button>
          </SettingsSection>
        </div>

        <div className="space-y-2.5">
          <SettingsSection title="System Preferences">
            <div className="space-y-2.5">
              <ToggleRow label="Enable Real-time Updates" description="Receive real-time updates for all systems" checked={realTimeUpdates} onChange={setRealTimeUpdates} />
              <div className="rounded-md border border-border/70 bg-background/35 px-2.5 py-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold text-foreground">Enable Auto Logout</div>
                    <div className="mt-0.5 text-[8px] text-muted-foreground">Automatically logout inactive users</div>
                  </div>
                  <button type="button" onClick={() => setAutoLogout((value) => !value)} className={cn('relative inline-flex h-5 w-9 items-center rounded-full border transition-colors', autoLogout ? 'border-cyan-500/60 bg-cyan-500/30' : 'border-border/80 bg-slate-800/70')}>
                    <span className={cn('absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform', autoLogout ? 'left-[calc(100%-0.9rem)]' : 'left-0.5')} />
                  </button>
                </div>
                <div className="mt-2">
                  <SelectField label="" value={autoLogoutMinutes} options={['30 min', '15 min', '1 hour']} onChange={setAutoLogoutMinutes} />
                </div>
              </div>
              <ToggleRow label="Enable Data Analytics" description="Collect anonymous usage analytics" checked={dataAnalytics} onChange={setDataAnalytics} />
              <ToggleRow label="Enable Audit Logging" description="Log all user activities and changes" checked={auditLogging} onChange={setAuditLogging} />
              <ToggleRow label="Enable Maintenance Mode" description="Put system in maintenance mode" checked={maintenanceMode} onChange={setMaintenanceMode} />
            </div>
          </SettingsSection>

          <SettingsSection title="Data Retention Settings">
            <SelectField label="Incident Data Retention" value={incidentRetention} options={['7 Years', '5 Years', '10 Years']} onChange={setIncidentRetention} />
            <SelectField label="Log Data Retention" value={logRetention} options={['3 Years', '1 Year', '5 Years']} onChange={setLogRetention} />
            <SelectField label="Analytics Data Retention" value={analyticsRetention} options={['2 Years', '1 Year', '3 Years']} onChange={setAnalyticsRetention} />
            <button type="button" className="flex w-full items-center justify-between rounded-md border border-border/70 bg-background/35 px-2.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-foreground hover:border-primary/40 hover:text-primary">
              <span>Manage Data Retention Policy</span>
              <ChevronDown className="size-3.5 rotate-[-90deg]" />
            </button>
          </SettingsSection>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">Quick Actions</div>
          </div>
          <div className="space-y-2">
            <ActionButton label="Clear System Cache" sublabel="Free up system memory" onClick={() => handleQuickAction('Clear System Cache')} />
            <ActionButton label="Export System Configuration" sublabel="Download current settings" onClick={() => handleQuickAction('Export System Configuration')} />
            <ActionButton label="Import Configuration" sublabel="Import settings from backup" onClick={() => handleQuickAction('Import Configuration')} />
            <ActionButton label="Restart System Services" sublabel="Restart all system services" onClick={() => handleQuickAction('Restart System Services')} />
            <ActionButton label="Check System Health" sublabel="Run system diagnostics" onClick={() => handleQuickAction('Check System Health')} />
          </div>
        </Panel>

        <div className="space-y-2.5">
          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">System Information</div>
            <div className="space-y-2.5 text-[9px] text-muted-foreground">
              <InfoRow label="Server Name" value="SAFE-AI-SERVER-01" />
              <InfoRow label="IP Address" value="10.10.25.15" />
              <InfoRow label="OS" value="Ubuntu 22.04 LTS" />
              <InfoRow label="Web Server" value="Nginx 1.24.0" />
              <InfoRow label="Database" value="PostgreSQL 14.8" />
              <InfoRow label="Storage Used" value="2.4 TB / 5.0 TB" progress={48} />
              <InfoRow label="Memory Usage" value="65%" progress={65} />
              <InfoRow label="CPU Usage" value="32%" progress={32} />
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">Storage Usage</div>
            <div className="flex items-center justify-center">
              <div className="relative h-[150px] w-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: 'Incident Data', value: 50 }, { name: 'Logs', value: 25 }, { name: 'Analytics', value: 17 }, { name: 'Others', value: 8 }]} dataKey="value" innerRadius={42} outerRadius={60} paddingAngle={3} stroke="none">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#8b5cf6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[20px] font-black text-foreground">2.4</div>
                    <div className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">TB</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[9px] text-muted-foreground">
              <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="inline-flex size-2.5 rounded-full bg-primary" /><span>Incident Data</span></div><span className="text-foreground">1.2 TB (50%)</span></div>
              <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="inline-flex size-2.5 rounded-full bg-emerald-500" /><span>Logs</span></div><span className="text-foreground">0.6 TB (25%)</span></div>
              <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="inline-flex size-2.5 rounded-full bg-amber-500" /><span>Analytics</span></div><span className="text-foreground">0.4 TB (17%)</span></div>
              <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="inline-flex size-2.5 rounded-full bg-violet-500" /><span>Others</span></div><span className="text-foreground">0.2 TB (8%)</span></div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <SettingsSection title="Notifications">
      <div className="space-y-2.5">
        <ToggleRow label="Critical Alerts" description="Notify on high-priority plant events" checked={true} onChange={() => {}} />
        <ToggleRow label="Email Digest" description="Send daily operational summary by email" checked={true} onChange={() => {}} />
        <ToggleRow label="SMS Escalations" description="Send escalation SMS for critical conditions" checked={true} onChange={() => {}} />
        <SelectField label="Default Alert Channel" value="Email + SMS" options={['Email + SMS', 'Email', 'SMS', 'Pager']} onChange={() => {}} />
      </div>
    </SettingsSection>
  )

  const renderSecurity = () => (
    <SettingsSection title="Security">
      <div className="space-y-2.5">
        <ToggleRow label="Multi-Factor Authentication" description="Require MFA for all operators" checked={true} onChange={() => {}} />
        <ToggleRow label="Password Rotation" description="Remind users to rotate credentials on schedule" checked={true} onChange={() => {}} />
        <ToggleRow label="Network Access Control" description="Restrict access from untrusted endpoints" checked={true} onChange={() => {}} />
        <SelectField label="Security Policy" value="High" options={['High', 'Medium', 'Low']} onChange={() => {}} />
      </div>
    </SettingsSection>
  )

  const renderIntegrations = () => (
    <SettingsSection title="Integrations">
      <div className="space-y-2.5">
        <ToggleRow label="SCADA Sync" description="Synchronize with plant control systems" checked={true} onChange={() => {}} />
        <ToggleRow label="ERP Feed" description="Push inventory and permit data to ERP" checked={true} onChange={() => {}} />
        <ToggleRow label="External Weather API" description="Pull weather and anomaly telemetry" checked={false} onChange={() => {}} />
        <SelectField label="Integration Mode" value="Bidirectional" options={['Bidirectional', 'Inbound Only', 'Outbound Only']} onChange={() => {}} />
      </div>
    </SettingsSection>
  )

  const renderDataRetention = () => (
    <SettingsSection title="Data & Retention">
      <div className="space-y-2.5">
        <SelectField label="Incident Retention" value={incidentRetention} options={['7 Years', '5 Years', '10 Years']} onChange={setIncidentRetention} />
        <SelectField label="Log Retention" value={logRetention} options={['3 Years', '1 Year', '5 Years']} onChange={setLogRetention} />
        <SelectField label="Analytics Retention" value={analyticsRetention} options={['2 Years', '1 Year', '3 Years']} onChange={setAnalyticsRetention} />
        <ToggleRow label="Archive Cold Storage" description="Move old records to low-cost storage" checked={true} onChange={() => {}} />
      </div>
    </SettingsSection>
  )

  const renderBackupRestore = () => (
    <SettingsSection title="Backup & Restore">
      <div className="space-y-2.5">
        <ToggleRow label="Auto Backup" description="Create nightly system backups" checked={true} onChange={() => {}} />
        <ToggleRow label="Geo-Redundant Storage" description="Mirror backup data to secondary site" checked={true} onChange={() => {}} />
        <SelectField label="Backup Window" value="02:00 AM" options={['02:00 AM', '01:00 AM', '03:00 AM']} onChange={() => {}} />
        <button type="button" className="flex w-full items-center justify-between rounded-md border border-border/70 bg-background/35 px-2.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-foreground hover:border-primary/40 hover:text-primary">
          <span>Restore from Latest Snapshot</span>
          <RefreshCw className="size-3.5" />
        </button>
      </div>
    </SettingsSection>
  )

  const renderMaintenance = () => (
    <SettingsSection title="System Maintenance">
      <div className="space-y-2.5">
        <ToggleRow label="Scheduled Maintenance" description="Allow planned future maintenance windows" checked={true} onChange={() => {}} />
        <ToggleRow label="Auto Health Checks" description="Run background diagnostics on each subsystem" checked={true} onChange={() => {}} />
        <SelectField label="Maintenance Window" value="Sunday 02:00" options={['Sunday 02:00', 'Saturday 02:00', 'Friday 02:00']} onChange={() => {}} />
        <ActionButton label="Run System Diagnostics" sublabel="Check health and patch readiness" onClick={() => handleQuickAction('Run System Diagnostics')} />
      </div>
    </SettingsSection>
  )

  const renderAuditLog = () => (
    <SettingsSection title="Audit Log">
      <div className="space-y-2.5">
        <ToggleRow label="Audit Trail Capture" description="Record all admin and user actions" checked={true} onChange={() => {}} />
        <SelectField label="Retention Policy" value="7 Years" options={['7 Years', '3 Years', '1 Year']} onChange={() => {}} />
        <SelectField label="Log Level" value="Info" options={['Info', 'Warn', 'Error']} onChange={() => {}} />
        <ActionButton label="Export Audit Activity" sublabel="Download compliance report" onClick={() => handleQuickAction('Export Audit Activity')} />
      </div>
    </SettingsSection>
  )

  const tabContent = {
    General: renderGeneral(),
    Notifications: renderNotifications(),
    Security: renderSecurity(),
    Integrations: renderIntegrations(),
    'Data & Retention': renderDataRetention(),
    'Backup & Restore': renderBackupRestore(),
    'System Maintenance': renderMaintenance(),
    'Audit Log': renderAuditLog(),
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-3.5">
      <div className="rounded-lg border border-border/80 bg-card/85 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-red-500/40 bg-red-500/10 text-red-300">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-red-300">SAFE.AI</div>
              <div className="text-[17px] font-bold text-foreground">System Settings</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">Configure system preferences, integrations &amp; security settings</div>
            </div>
          </div>

<div className="flex items-center gap-2 text-[10px] text-muted-foreground">
  <div className="rounded border border-border/70 bg-background/40 px-2 py-1">
    Plant: {plantName || 'Unknown Plant'}
  </div>

  <div className="rounded border border-border/70 bg-background/40 px-2 py-1">
    Date &amp; Time: {new Date().toLocaleString()}
  </div>

  <div
    className={cn(
      'rounded border px-2 py-1 font-semibold uppercase tracking-[0.14em]',
!backendConnected
  ? 'border-border/70 bg-background/40 text-muted-foreground'
  : currentRiskLevel === 'critical'
    ? 'border-critical/40 bg-critical/10 text-critical'
    : currentRiskLevel === 'high'
      ? 'border-danger/40 bg-danger/10 text-danger'
      : currentRiskLevel === 'medium'
        ? 'border-warning/40 bg-warning/10 text-warning'
        : 'border-success/40 bg-success/10 text-success',
    )}
  >
    System Status: {backendConnected ? currentRiskLevel.toUpperCase() : 'OFFLINE'}
  </div>
</div>

          <div className="flex items-center gap-2">
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground"><Bell className="size-3.5" /></button>
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground"><HelpCircle className="size-3.5" /></button>
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground"><Settings className="size-3.5" /></button>
            <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-2 py-1.5">
              <div className="flex size-6 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-[8px] font-bold text-primary">SH</div>
              <div className="leading-none">
                <div className="text-[9px] font-semibold text-foreground">Safety Head</div>
                <div className="text-[8px] text-muted-foreground">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <nav className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all',
                activeTab === tab
                  ? 'border-red-500/50 bg-red-500/10 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.12)]'
                  : 'border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-background/60 hover:text-foreground',
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-lg border border-border/80 bg-card/80 px-3 py-2.5">
        {statusText ? <div className="mb-2 text-[9px] uppercase tracking-[0.14em] text-cyan-300">{statusText}</div> : null}
        {tabContent[activeTab]}
      </div>
    </div>
  )
}

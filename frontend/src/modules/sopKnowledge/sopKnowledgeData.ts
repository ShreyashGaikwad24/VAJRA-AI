import {
  Activity,
  BookOpen,
  BookText,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileCog,
  Flame,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  Wrench,
} from 'lucide-react'

export const sopTabs = ['SOP Library', 'Knowledge Base', 'Training Materials', 'FAQs'] as const
export type SopTab = (typeof sopTabs)[number]

export const sopKpis = [
  {
    title: 'TOTAL SOPs',
    value: '128',
    delta: 'All Published SOPs',
    tone: 'default',
    trend: 'up',
    icon: BookText,
    sparkline: [72, 78, 82, 88, 94, 100, 116, 128],
    description: 'All Published SOPs',
  },
  {
    title: 'CATEGORIES',
    value: '12',
    delta: 'SOP Categories',
    tone: 'default',
    trend: 'flat',
    icon: ClipboardCheck,
    sparkline: [8, 9, 9, 10, 11, 11, 12, 12],
    description: 'SOP Categories',
  },
  {
    title: 'RECENTLY UPDATED',
    value: '18',
    delta: 'In Last 30 Days',
    tone: 'success',
    trend: 'up',
    icon: Sparkles,
    sparkline: [10, 12, 12, 14, 14, 15, 17, 18],
    description: 'In Last 30 Days',
  },
  {
    title: 'MOST VIEWED',
    value: 'SOP-021',
    delta: 'Emergency Shutdown',
    tone: 'default',
    trend: 'up',
    icon: ShieldCheck,
    sparkline: [8, 12, 14, 16, 18, 19, 21, 24],
    description: 'Emergency Shutdown',
  },
]

export const sopCategories = [
  {
    id: 'Emergency Procedures',
    name: 'Emergency Procedures',
    description: 'Response procedures for emergencies',
    count: '24 SOPs',
    icon: Flame,
    color: 'border-red-500/40 bg-red-500/10 text-red-200',
    area: 'All Areas',
  },
  {
    id: 'Operations',
    name: 'Operations',
    description: 'Standard operating procedures',
    count: '32 SOPs',
    icon: Activity,
    color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
    area: 'Process Area',
  },
  {
    id: 'Maintenance',
    name: 'Maintenance',
    description: 'Equipment maintenance procedures',
    count: '18 SOPs',
    icon: Wrench,
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
    area: 'Mechanical Area',
  },
  {
    id: 'Safety',
    name: 'Safety',
    description: 'Safety protocols & guidelines',
    count: '26 SOPs',
    icon: ShieldPlus,
    color: 'border-violet-500/40 bg-violet-500/10 text-violet-200',
    area: 'All Areas',
  },
  {
    id: 'Environment',
    name: 'Environment',
    description: 'Environmental protection procedures',
    count: '12 SOPs',
    icon: Building2,
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    area: 'Chemical Storage',
  },
  {
    id: 'Security',
    name: 'Security',
    description: 'Physical & cyber security procedures',
    count: '8 SOPs',
    icon: ShieldCheck,
    color: 'border-pink-500/40 bg-pink-500/10 text-pink-200',
    area: 'All Areas',
  },
  {
    id: 'Quality',
    name: 'Quality',
    description: 'Quality control & assurance procedures',
    count: '6 SOPs',
    icon: BriefcaseBusiness,
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
    area: 'Quality Lab',
  },
  {
    id: 'Training',
    name: 'Training',
    description: 'Training & competency procedures',
    count: '2 SOPs',
    icon: FileCog,
    color: 'border-sky-500/40 bg-sky-500/10 text-sky-200',
    area: 'Training Center',
  },
] as const

export const sopRows = [
  {
    id: 'SOP-021',
    title: 'Emergency Shutdown Procedure',
    category: 'Emergency Procedures',
    area: 'Reactor Area - Zone C',
    updated: '16 May 2025',
    version: '2.1',
    status: 'Published',
  },
  {
    id: 'SOP-015',
    title: 'Fire Response Procedure',
    category: 'Emergency Procedures',
    area: 'All Areas',
    updated: '15 May 2025',
    version: '3.0',
    status: 'Published',
  },
  {
    id: 'SOP-034',
    title: 'Permit to Work System',
    category: 'Safety',
    area: 'All Areas',
    updated: '14 May 2025',
    version: '1.4',
    status: 'Published',
  },
  {
    id: 'SOP-008',
    title: 'Equipment Lockout/Tagout',
    category: 'Maintenance',
    area: 'Mechanical Area',
    updated: '13 May 2025',
    version: '2.2',
    status: 'Published',
  },
  {
    id: 'SOP-042',
    title: 'Chemical Spill Response',
    category: 'Environment',
    area: 'Chemical Storage',
    updated: '12 May 2025',
    version: '1.8',
    status: 'Published',
  },
  {
    id: 'SOP-011',
    title: 'Gas Leak Isolation Checklist',
    category: 'Operations',
    area: 'Process Area',
    updated: '10 May 2025',
    version: '2.0',
    status: 'Published',
  },
  {
    id: 'SOP-013',
    title: 'Confined Space Entry Permit',
    category: 'Safety',
    area: 'Process Area',
    updated: '09 May 2025',
    version: '1.9',
    status: 'Published',
  },
] as const

export const popularSops = [
  { id: 'SOP-021', title: 'Emergency Shutdown Procedure', views: '1,248', area: 'Reactor Area - Zone C' },
  { id: 'SOP-015', title: 'Fire Response Procedure', views: '987', area: 'All Areas' },
  { id: 'SOP-034', title: 'Permit to Work System', views: '856', area: 'All Areas' },
  { id: 'SOP-008', title: 'Equipment Lockout/Tagout', views: '743', area: 'Mechanical Area' },
  { id: 'SOP-042', title: 'Chemical Spill Response', views: '652', area: 'Chemical Storage' },
] as const

export const knowledgeArticles = [
  { title: 'Understanding High Temperature Risks in Reactors', date: '18 May 2025', views: '512' },
  { title: 'Preventing Gas Leaks: Best Practices', date: '16 May 2025', views: '436' },
  { title: 'Emergency Communication Protocols', date: '15 May 2025', views: '398' },
  { title: 'PPE Guidelines for High Risk Areas', date: '14 May 2025', views: '287' },
  { title: 'Confined Space Entry Guidelines', date: '13 May 2025', views: '265' },
] as const

export const articleCategories = [
  { name: 'Process Safety', count: '42 articles', icon: BookOpen },
  { name: 'Maintenance', count: '18 articles', icon: Wrench },
  { name: 'Emergency Response', count: '25 articles', icon: Flame },
  { name: 'Compliance', count: '12 articles', icon: ShieldCheck },
] as const

export const trainingModules = [
  { title: 'Emergency Response Drills', category: 'Emergency Response', duration: '45 min', completion: '92%', nextDue: 'Due in 6 days', level: 'Mandatory' },
  { title: 'Fire Safety and Extinguisher Handling', category: 'Fire Safety', duration: '30 min', completion: '86%', nextDue: 'Due in 12 days', level: 'Mandatory' },
  { title: 'Process Safety Fundamentals', category: 'Process Safety', duration: '60 min', completion: '74%', nextDue: 'Due in 18 days', level: 'Recommended' },
  { title: 'PPE and Hazard Identification', category: 'PPE', duration: '25 min', completion: '98%', nextDue: 'Completed', level: 'Completed' },
] as const

export const faqItems = [
  {
    question: 'Who is authorized to approve a temporary process deviation?',
    answer: 'Temporary process deviations require approval from the shift supervisor and the designated process safety officer before the deviation is implemented.',
    category: 'Operations',
  },
  {
    question: 'What is the required response time for gas leak alarms?',
    answer: 'Gas leak alarms must be acknowledged immediately, and the affected area must be isolated within 5 minutes under the emergency response procedure.',
    category: 'Safety',
  },
  {
    question: 'How often should fire extinguishers be inspected?',
    answer: 'Fire extinguishers are inspected monthly and serviced quarterly, with records retained for audit and compliance review.',
    category: 'Fire Safety',
  },
  {
    question: 'When should PPE fit checks be completed?',
    answer: 'PPE fit checks are required before each shift for high-risk tasks and after any equipment or role reassignment. This is documented by the supervisor.',
    category: 'PPE',
  },
] as const

export const quickActions = ['Create New SOP', 'Upload Document', 'Request Review'] as const

export const sopShortcuts = ['Emergency Shutdown', 'Fire Response', 'Evacuation Procedure', 'First Aid Guide', 'Spill Response'] as const
export const areaOptions = ['All Areas', 'Reactor Area - Zone C', 'Mechanical Area', 'Chemical Storage', 'Process Area']
export const categoryOptions = ['All Categories', 'Emergency Procedures', 'Operations', 'Maintenance', 'Safety', 'Environment', 'Security', 'Quality', 'Training']

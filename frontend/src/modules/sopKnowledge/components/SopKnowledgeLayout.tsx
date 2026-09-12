import { useMemo, useState } from 'react'

import {
  ArrowRight,
  Bell,
  BookOpen,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Filter,
  FolderOpen,
  PencilLine,
  Plus,
  ShieldAlert,
  Upload,
} from 'lucide-react'

import { MetricCard } from '@/components/cards/MetricCard'
import { Panel } from '@/components/cards/Panel'
import { SelectField } from '@/components/common/SelectField'
import { SearchBox } from '@/components/common/SearchBox'
import { cn } from '@/utils/cn'
import {
  areaOptions,
  articleCategories,
  categoryOptions,
  faqItems,
  knowledgeArticles,
  popularSops,
  quickActions,
  sopCategories,
  sopKpis,
  sopRows,
  sopShortcuts,
  sopTabs,
  trainingModules,
  type SopTab,
} from '@/modules/sopKnowledge/sopKnowledgeData'

function filterSopRows(search: string, category: string, area: string) {
  const query = search.trim().toLowerCase()

  return sopRows.filter((row) => {
    const haystack = [row.id, row.title, row.category, row.area].join(' ').toLowerCase()
    const matchesSearch = !query || haystack.includes(query)
    const matchesCategory = category === 'All Categories' || row.category === category
    const matchesArea = area === 'All Areas' || row.area === area
    return matchesSearch && matchesCategory && matchesArea
  })
}

function SopsView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedArea, setSelectedArea] = useState('All Areas')
  const [selectedCategoryCard, setSelectedCategoryCard] = useState<string | null>(null)

  const visibleRows = useMemo(
    () => filterSopRows(searchTerm, selectedCategory, selectedArea),
    [searchTerm, selectedCategory, selectedArea],
  )

  return (
    <>
      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1.8fr)_1fr_1fr_auto] xl:grid-cols-[minmax(0,1.8fr)_1fr_1fr_auto]">
          <div className="min-w-0">
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search SOPs, procedures, or keywords..."
              className="h-9 border-border/70 bg-[#0f1725] text-[10px]"
            />
          </div>

          <SelectField label="Category" value={selectedCategory} options={categoryOptions} onChange={setSelectedCategory} />
          <SelectField label="Area" value={selectedArea} options={areaOptions} onChange={setSelectedArea} />

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All Categories')
                setSelectedArea('All Areas')
                setSelectedCategoryCard(null)
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground hover:border-cyan-500/40 hover:text-cyan-300"
            >
              <Filter className="size-3.5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-4">
        {sopKpis.map((item, index) => (
          <MetricCard
            key={item.title}
            label={item.title}
            value={item.value}
            delta={item.delta}
            description={item.description}
            tone={item.tone as 'default' | 'success' | 'warning' | 'danger' | 'critical'}
            trend={item.trend as 'up' | 'down' | 'flat'}
            icon={item.icon}
            sparkline={item.sparkline as number[]}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.72fr)_minmax(260px,0.78fr)]">
        <div className="space-y-2.5">
          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">SOP CATEGORIES</div>
              <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
                View All Categories
              </button>
            </div>

            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {sopCategories.map((category) => {
                const Icon = category.icon
                const isActive = (selectedCategoryCard ?? 'All Categories') === category.name
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryCard((current) => (current === category.name ? null : category.name))
                      setSelectedCategory(category.name)
                    }}
                    className={cn(
                      'rounded-md border border-border/70 bg-background/30 p-2 text-left transition-all hover:border-cyan-500/40 hover:bg-background/45',
                      isActive && 'border-cyan-500/40 bg-cyan-500/10',
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className={cn('flex size-7 items-center justify-center rounded-md border', category.color)}>
                        <Icon className="size-3.5" />
                      </span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">{category.name}</div>
                    <div className="mt-1 line-clamp-2 text-[9px] leading-[1.4] text-muted-foreground">{category.description}</div>
                    <div className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-cyan-300">{category.count}</div>
                  </button>
                )
              })}
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENT SOPs</div>
              <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
                View All SOPs
              </button>
            </div>

            {visibleRows.length === 0 ? (
              <div className="rounded border border-dashed border-border/70 bg-background/30 px-3 py-6 text-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                No SOPs found for the selected filters.
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded border border-border/70 bg-background/40">
                  <div className="overflow-x-auto">
                    <table className="min-w-[760px] w-full border-collapse text-[9px] text-slate-200">
                      <thead>
                        <tr className="border-b border-border/70 bg-background/60">
                          {['SOP ID', 'Title', 'Category', 'Area / Unit', 'Last Updated', 'Version', 'Status', 'Actions'].map((column) => (
                            <th key={column} className="px-2 py-2 text-left font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.map((row) => (
                          <tr key={row.id} className="border-b border-border/60 last:border-b-0">
                            <td className="px-2 py-2 text-slate-200">{row.id}</td>
                            <td className="px-2 py-2 text-slate-200">{row.title}</td>
                            <td className="px-2 py-2 text-slate-200">{row.category}</td>
                            <td className="px-2 py-2 text-slate-200">{row.area}</td>
                            <td className="px-2 py-2 text-slate-200">{row.updated}</td>
                            <td className="px-2 py-2 text-slate-200">{row.version}</td>
                            <td className="px-2 py-2">
                              <span className="inline-flex rounded border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-200">
                                {row.status}
                              </span>
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1.5">
                                <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                                  <Eye className="size-3.5" />
                                </button>
                                <button type="button" className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-primary">
                                  <Download className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span>Showing 1 to {Math.min(visibleRows.length, 5)} of {visibleRows.length} SOPs</span>
                  <div className="flex items-center gap-1">
                    <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">&lt;</button>
                    <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-primary/40 bg-primary/10 text-primary">1</button>
                    <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">2</button>
                    <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">3</button>
                    <span className="px-1 text-slate-300">...</span>
                    <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">26</button>
                    <button type="button" className="inline-flex size-6 items-center justify-center rounded border border-border/70 bg-background/40 text-slate-200">&gt;</button>
                  </div>
                </div>
              </>
            )}
          </Panel>
        </div>

        <div className="space-y-2.5">
          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">POPULAR SOPs</div>
              <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
                View All
              </button>
            </div>
            <div className="space-y-2">
              {popularSops.map((item) => (
                <button key={item.id} type="button" className="flex w-full items-center gap-2 rounded border border-border/70 bg-background/35 p-2 text-left transition hover:border-primary/40 hover:bg-background/45">
                  <span className="flex size-7 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-200">
                    <FileText className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                      <span className="font-semibold uppercase tracking-[0.12em] text-cyan-300">{item.id}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[9px] font-medium text-foreground">{item.title}</div>
                    <div className="mt-1 flex items-center gap-1 text-[8px] text-muted-foreground">
                      <Eye className="size-3" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">KNOWLEDGE BASE ARTICLES</div>
              <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
                View All
              </button>
            </div>
            <div className="space-y-2">
              {knowledgeArticles.map((item) => (
                <button key={item.title} type="button" className="flex w-full items-center gap-2 rounded border border-border/70 bg-background/35 p-2 text-left transition hover:border-primary/40 hover:bg-background/45">
                  <span className="flex size-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                    <BookOpen className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[9px] font-medium text-foreground">{item.title}</div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-[8px] text-muted-foreground">
                      <span>{item.date}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {item.views}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="border-border/80 bg-card/80 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">QUICK ACTIONS</div>
            <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-1">
              {quickActions.map((action, index) => {
                const Icon = index === 0 ? Plus : index === 1 ? Upload : PencilLine
                return (
                  <button
                    key={action}
                    type="button"
                    className="flex items-center gap-2 rounded border border-border/70 bg-background/35 p-2.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary/40 hover:bg-background/45"
                  >
                    <span className="flex size-8 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
                      <Icon className="size-3.5" />
                    </span>
                    {action}
                    <ArrowRight className="ml-auto size-3 text-muted-foreground" />
                  </button>
                )
              })}
            </div>
          </Panel>
        </div>
      </div>

      <div className="rounded-lg border border-border/80 bg-card/80 p-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-red-300">SOP SHORTCUTS</span>
          </div>
        </div>
        <div className="mt-2 grid gap-2 md:grid-cols-5">
          {sopShortcuts.map((shortcut) => (
            <button key={shortcut} type="button" className="rounded border border-border/70 bg-background/35 px-2 py-1.5 text-[9px] text-foreground hover:border-primary/40 hover:text-primary">
              {shortcut}
            </button>
          ))}
        </div>
        <button type="button" className="mt-3 inline-flex items-center gap-2 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-red-100 hover:bg-red-500/15">
          <ShieldAlert className="size-3.5" />
          Request New SOP
        </button>
      </div>
    </>
  )
}

function KnowledgeBaseView() {
  return (
    <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.72fr)_minmax(260px,0.78fr)]">
      <div className="space-y-2.5">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">KNOWLEDGE BASE ARTICLES</div>
            <button type="button" className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">View Library</button>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {knowledgeArticles.map((article) => (
              <div key={article.title} className="rounded border border-border/70 bg-background/35 p-2.5">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-cyan-300">
                  <BookOpen className="size-3.5" />
                  Safety Article
                </div>
                <div className="mt-2 text-[10px] font-semibold text-foreground">{article.title}</div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[8px] text-muted-foreground">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1"><Eye className="size-3" />{article.views}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">RECENTLY UPDATED ARTICLES</div>
          <div className="space-y-2">
            {knowledgeArticles.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded border border-border/70 bg-background/35 px-2.5 py-2">
                <div>
                  <div className="text-[9px] font-medium text-foreground">{item.title}</div>
                  <div className="mt-1 text-[8px] text-muted-foreground">{item.date}</div>
                </div>
                <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-cyan-200">Updated</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-2.5">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">POPULAR TOPICS</div>
          <div className="space-y-2">
            {articleCategories.map((item) => {
              const Icon = item.icon
              return (
                <button key={item.name} type="button" className="flex w-full items-center justify-between rounded border border-border/70 bg-background/35 px-2.5 py-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/10 text-cyan-200"><Icon className="size-3.5" /></span>
                    <div>
                      <div className="text-[9px] font-semibold text-foreground">{item.name}</div>
                      <div className="text-[8px] text-muted-foreground">{item.count}</div>
                    </div>
                  </div>
                  <ArrowRight className="size-3 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">QUICK ACTIONS</div>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = index === 0 ? Plus : index === 1 ? Upload : PencilLine
              return (
                <button key={action} type="button" className="flex w-full items-center gap-2 rounded border border-border/70 bg-background/35 p-2.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground">
                  <span className="flex size-8 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"><Icon className="size-3.5" /></span>
                  {action}
                </button>
              )
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function TrainingView() {
  return (
    <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.72fr)_minmax(260px,0.78fr)]">
      <div className="space-y-2.5">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">TRAINING MODULES</div>
          <div className="space-y-2">
            {trainingModules.map((item) => (
              <div key={item.title} className="rounded border border-border/70 bg-background/35 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-cyan-300">{item.category}</div>
                  <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-amber-200">{item.level}</span>
                </div>
                <div className="mt-2 text-[10px] font-semibold text-foreground">{item.title}</div>
                <div className="mt-2 flex items-center justify-between text-[8px] text-muted-foreground">
                  <span>{item.duration}</span>
                  <span>{item.nextDue}</span>
                </div>
                <div className="mt-2 h-2 rounded bg-border/80">
                  <div className="h-full rounded bg-cyan-500" style={{ width: item.completion }} />
                </div>
                <div className="mt-1 text-right text-[8px] uppercase tracking-[0.12em] text-cyan-200">{item.completion}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-2.5">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">TRAINING CATEGORIES</div>
          <div className="space-y-2">
            {['Emergency Response', 'Fire Safety', 'Process Safety', 'Equipment Safety', 'PPE', 'Chemical Safety', 'First Aid', 'Evacuation Training'].map((item) => (
              <button key={item} type="button" className="flex w-full items-center justify-between rounded border border-border/70 bg-background/35 px-2.5 py-2 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground">
                {item}
                <FolderOpen className="size-3.5 text-cyan-300" />
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">QUICK ACTIONS</div>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = index === 0 ? Plus : index === 1 ? Upload : PencilLine
              return (
                <button key={action} type="button" className="flex w-full items-center gap-2 rounded border border-border/70 bg-background/35 p-2.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground">
                  <span className="flex size-8 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"><Icon className="size-3.5" /></span>
                  {action}
                </button>
              )
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function FaqsView() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqItems[0].question)

  return (
    <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.72fr)_minmax(260px,0.78fr)]">
      <div className="space-y-2.5">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">FREQUENTLY ASKED QUESTIONS</div>
          <div className="space-y-2">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded border border-border/70 bg-background/35">
                <button
                  type="button"
                  onClick={() => setOpenQuestion((current) => (current === item.question ? '' : item.question))}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
                >
                  <div className="text-[9px] font-semibold text-foreground">{item.question}</div>
                  <ChevronDown className={cn('size-3.5 text-muted-foreground transition', openQuestion === item.question && 'rotate-180')} />
                </button>
                {openQuestion === item.question ? (
                  <div className="border-t border-border/70 px-3 py-2.5 text-[9px] leading-5 text-muted-foreground">{item.answer}</div>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-2.5">
        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">POPULAR FAQs</div>
          <div className="space-y-2 text-[9px]">
            {faqItems.map((item) => (
              <button key={item.question} type="button" className="flex w-full items-center justify-between rounded border border-border/70 bg-background/35 px-2.5 py-2 text-left">
                <span>{item.question}</span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="border-border/80 bg-card/80 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">QUICK ACTIONS</div>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = index === 0 ? Plus : index === 1 ? Upload : PencilLine
              return (
                <button key={action} type="button" className="flex w-full items-center gap-2 rounded border border-border/70 bg-background/35 p-2.5 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground">
                  <span className="flex size-8 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"><Icon className="size-3.5" /></span>
                  {action}
                </button>
              )
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}

export function SopKnowledgeLayout() {
  const [activeTab, setActiveTab] = useState<SopTab>('SOP Library')

  const content =
    activeTab === 'SOP Library' ? (
      <SopsView />
    ) : activeTab === 'Knowledge Base' ? (
      <KnowledgeBaseView />
    ) : activeTab === 'Training Materials' ? (
      <TrainingView />
    ) : (
      <FaqsView />
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-3.5">
      <header className="rounded-lg border border-border/80 bg-card/80 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
              <ShieldAlert className="size-4" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-primary">SAFE.AI</div>
              <div className="text-[7px] uppercase tracking-[0.14em] text-muted-foreground">SOP &amp; Knowledge Base</div>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 text-[10px] lg:flex">
            <div className="rounded border border-border/70 bg-background/40 px-2 py-1 text-muted-foreground">Plant: Jamnagar Refinery</div>
            <div className="rounded border border-border/70 bg-background/40 px-2 py-1 text-muted-foreground">Date &amp; Time: 17 May 2025, 10:24:35 AM</div>
            <div className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 font-semibold uppercase tracking-[0.14em] text-red-300">System Status: EMERGENCY</div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground"><Bell className="size-3.5" /></button>
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground"><Filter className="size-3.5" /></button>
            <button type="button" className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-background/40 text-muted-foreground hover:text-foreground"><ShieldAlert className="size-3.5" /></button>
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">SOP &amp; KNOWLEDGE BASE</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Standard Operating Procedures &amp; Safety Knowledge Hub</div>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-2 rounded border border-border/70 bg-background/40 px-2 py-1 text-[10px] text-muted-foreground">
                <ShieldAlert className="size-3.5 text-cyan-300" />
                Safety Head / Administrator
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="rounded-lg border border-border/80 bg-card/80 px-2 py-2">
        <nav className="flex flex-wrap items-center gap-1.5">
          {sopTabs.map((tab) => (
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

      {content}
    </div>
  )
}

import type { HistoricalIncident } from '@/data/plant/types'

export const HISTORICAL_INCIDENTS: HistoricalIncident[] = [
  {
    id: 'INC-2019-042',
    title: 'Reactor Thermal Runaway — Unit R-101',
    description:
      'High reactor temperature combined with gas accumulation and concurrent hot work led to thermal runaway conditions.',
    similarityFactors: [
      'High temperature > 90°C',
      'Pressure trend increasing',
      'Gas leak probability > 80%',
      'Hot work activity in same zone',
      'Vibration trend increasing',
    ],
    outcome: 'EXPLOSION OCCURRED',
    downtime: '14 days',
    totalLoss: '$2.4M',
    injuries: 3,
    tags: ['thermal', 'gas', 'hot-work', 'reactor', 'R-101'],
  },
  {
    id: 'INC-2021-118',
    title: 'Pipeline Gas Release — Line 27A',
    description: 'Gradual seal degradation with rising LEL readings near manifold junction during peak throughput.',
    similarityFactors: ['Gas leak probability > 70%', 'Pressure transient spike', 'Maintenance overdue'],
    outcome: 'Controlled shutdown, no explosion',
    downtime: '4 days',
    totalLoss: '$680K',
    injuries: 0,
    tags: ['gas', 'pipeline', 'PL-27A'],
  },
  {
    id: 'INC-2023-007',
    title: 'Pump Vibration Failure — P-204',
    description: 'Sustained vibration above baseline with impeller wear led to catastrophic seal failure.',
    similarityFactors: ['Vibration trend increasing', 'Maintenance overdue', 'Equipment drift'],
    outcome: 'Equipment failure, localized fire contained',
    downtime: '7 days',
    totalLoss: '$1.1M',
    injuries: 1,
    tags: ['vibration', 'pump', 'P-204'],
  },
]

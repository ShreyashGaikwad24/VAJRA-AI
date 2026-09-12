import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from 'react'

import {
  Camera,
  Download,
  Factory,
  Focus,
  Home,
  Layers3,
  LocateFixed,
  MapPinned,
  Radar,
  RefreshCcw,
  RotateCw,
  ScanSearch,
  Search,
  Shield,
  Siren,
  SunMoon,
  ZoomIn,
  Hand,
  Flame,
  Users,
  Wifi,
  ShieldAlert,
  X,
  ChevronRight,
  Activity,
  Gauge,
  Cpu,
  Clock3,
  CalendarDays,
  Wrench,
  TrendingUp,
  TriangleAlert,
  HeartPulse,
} from 'lucide-react'

import { cn } from '@/utils/cn'
import refineryStep25Bg from '@/assets/refinery-step25-bg.png'

type Status = 'Healthy' | 'Warning' | 'Critical' | 'Maintenance' | 'Offline'

type ZoneOverlay = {
  id: string
  name: string
  cri: number
  risk: string
  status: string
  x: string
  y: string
  w: string
  h: string
  tone: string
  chipTone: string
  cardLeft: string
  cardTop: string
}

type EquipmentType =
  | 'Storage Tanks'
  | 'Cooling Towers'
  | 'Distillation Towers'
  | 'Reactor Units'
  | 'Heat Exchangers'
  | 'Pump Stations'
  | 'Warehouse'
  | 'Loading Bay'
  | 'Control Room'
  | 'Pipeline Junctions'
  | 'Valve Stations'
  | 'Substation'

const statusTone: Record<Status, { badge: string; glow: string; ring: string }> = {
  Healthy: {
    badge: 'border-success/40 bg-success/15 text-success',
    glow: 'shadow-[0_0_18px_rgba(16,185,129,0.25)]',
    ring: 'stroke-success',
  },
  Warning: {
    badge: 'border-warning/40 bg-warning/15 text-warning',
    glow: 'shadow-[0_0_18px_rgba(245,158,11,0.24)]',
    ring: 'stroke-warning',
  },
  Critical: {
    badge: 'border-critical/45 bg-critical/15 text-critical',
    glow: 'shadow-[0_0_20px_rgba(220,38,38,0.3)]',
    ring: 'stroke-critical',
  },
  Maintenance: {
    badge: 'border-primary/45 bg-primary/15 text-primary',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    ring: 'stroke-primary',
  },
  Offline: {
    badge: 'border-border bg-secondary/40 text-muted-foreground',
    glow: 'shadow-[0_0_12px_rgba(148,163,184,0.2)]',
    ring: 'stroke-muted-foreground',
  },
}

type Equipment = {
  id: string
  name: string
  type: EquipmentType
  zone: string
  status: Status
  health: number
  risk: string
  left: string
  top: string
  w: string
  h: string
  temperature: number
  pressure: number
  flow: number
  gas: number
  humidity: number
  power: number
  vibration: number
  workersNearby: number
  lastUpdated: string
  manufacturer: string
  installDate: string
  operatingHours: string
  location: string
  lastMaintenance: string
  nextInspection: string
  openTickets: number
  rootCause: string
  recommendation: string
  confidence: string
  failureWindow: string
}

type MarkerType = 'worker' | 'sensor' | 'camera' | 'alarm' | 'hydrant'

type Marker = {
  id: string
  type: MarkerType
  left: string
  top: string
  zone: string
  status: Status
  data: Record<string, string>
}

type PipelinePath = {
  id: string
  left: string
  top: string
  width: string
  rotate: string
  height?: string
  flow: number
  pressure: number
  valveState: string
  status: Status
}

type UtilityType = 'permit' | 'inspection' | 'emergency'

type UtilityPoint = {
  id: string
  type: UtilityType
  left: string
  top: string
  zone: string
  label: string
  detail: string
}

const topModes = [
  { label: 'Plant View', icon: Layers3 },
  { label: 'Zone View', icon: ScanSearch },
  { label: 'Sensor View', icon: Radar },
  { label: 'Heat Map', icon: Flame },
  { label: 'Risk View', icon: Shield },
]

const topActions = [
  { label: 'Fullscreen', icon: Focus },
  { label: 'Export Snapshot', icon: Download },
]

const sideControls = [
  { label: 'Rotate', icon: RotateCw },
  { label: 'Pan', icon: Hand },
  { label: 'Zoom', icon: ZoomIn },
  { label: 'Reset', icon: RefreshCcw },
  { label: 'Layers', icon: Layers3 },
  { label: 'Labels', icon: MapPinned },
  { label: 'Night Mode', icon: SunMoon },
]

const bottomNav = [
  { label: 'Home', icon: Home },
  { label: 'Fit View', icon: LocateFixed },
  { label: 'Zone A', icon: MapPinned },
  { label: 'Zone B', icon: MapPinned },
  { label: 'Zone C', icon: MapPinned },
  { label: 'Zone D', icon: MapPinned },
  { label: 'Zone E', icon: MapPinned },
  { label: 'Custom View', icon: LocateFixed },
]

const zones: ZoneOverlay[] = [
  {
    id: 'ZONE A',
    name: 'Storage',
    cri: 24,
    risk: 'Low Risk',
    status: 'Nominal',
    x: '6%',
    y: '13%',
    w: '22%',
    h: '24%',
    tone: 'border-success/40 bg-success/15',
    chipTone: 'text-success',
    cardLeft: '2%',
    cardTop: '2%',
  },
  {
    id: 'ZONE B',
    name: 'Processing',
    cri: 56,
    risk: 'Elevated Risk',
    status: 'Watch',
    x: '31%',
    y: '12%',
    w: '24%',
    h: '25%',
    tone: 'border-warning/45 bg-warning/18',
    chipTone: 'text-warning',
    cardLeft: '66%',
    cardTop: '2%',
  },
  {
    id: 'ZONE C',
    name: 'Hot Work',
    cri: 89,
    risk: 'Critical Risk',
    status: 'Critical',
    x: '57%',
    y: '22%',
    w: '20%',
    h: '27%',
    tone: 'border-critical/55 bg-critical/20 animate-zone-glow',
    chipTone: 'text-critical',
    cardLeft: '4%',
    cardTop: '74%',
  },
  {
    id: 'ZONE D',
    name: 'Control',
    cri: 31,
    risk: 'Stable Risk',
    status: 'Stable',
    x: '76%',
    y: '8%',
    w: '18%',
    h: '20%',
    tone: 'border-primary/45 bg-primary/15',
    chipTone: 'text-primary',
    cardLeft: '62%',
    cardTop: '4%',
  },
  {
    id: 'ZONE E',
    name: 'Loading',
    cri: 63,
    risk: 'High Risk',
    status: 'High Activity',
    x: '69%',
    y: '58%',
    w: '24%',
    h: '25%',
    tone: 'border-yellow-400/50 bg-yellow-400/15',
    chipTone: 'text-yellow-300',
    cardLeft: '60%',
    cardTop: '72%',
  },
]

const equipmentData: Equipment[] = [
  {
    id: 'ST-201',
    name: 'Storage Tanks',
    type: 'Storage Tanks',
    zone: 'ZONE A',
    status: 'Healthy',
    health: 95,
    risk: 'Low',
    left: '10%',
    top: '15%',
    w: '14%',
    h: '10%',
    temperature: 37,
    pressure: 4.1,
    flow: 56,
    gas: 7,
    humidity: 61,
    power: 42,
    vibration: 0.9,
    workersNearby: 6,
    lastUpdated: '8 sec ago',
    manufacturer: 'FlowCore Systems',
    installDate: '2018-03-14',
    operatingHours: '48,220 h',
    location: 'North storage lane',
    lastMaintenance: '2026-06-21',
    nextInspection: '2026-08-04',
    openTickets: 0,
    rootCause: 'No active anomaly',
    recommendation: 'Maintain current operating profile',
    confidence: '97%',
    failureWindow: 'None predicted',
  },
  {
    id: 'CT-015',
    name: 'Cooling Towers',
    type: 'Cooling Towers',
    zone: 'ZONE A',
    status: 'Warning',
    health: 84,
    risk: 'Moderate',
    left: '18%',
    top: '30%',
    w: '15%',
    h: '10%',
    temperature: 52,
    pressure: 3.8,
    flow: 61,
    gas: 5,
    humidity: 70,
    power: 57,
    vibration: 1.8,
    workersNearby: 4,
    lastUpdated: '12 sec ago',
    manufacturer: 'AquaTherm',
    installDate: '2019-01-06',
    operatingHours: '39,440 h',
    location: 'Cooling block 2',
    lastMaintenance: '2026-06-11',
    nextInspection: '2026-07-30',
    openTickets: 1,
    rootCause: 'Fan balance drift',
    recommendation: 'Schedule balancing during next low-load window',
    confidence: '88%',
    failureWindow: '11-16 days',
  },
  {
    id: 'DT-110',
    name: 'Distillation Towers',
    type: 'Distillation Towers',
    zone: 'ZONE B',
    status: 'Healthy',
    health: 91,
    risk: 'Low',
    left: '36%',
    top: '10%',
    w: '15%',
    h: '13%',
    temperature: 301,
    pressure: 9.2,
    flow: 72,
    gas: 11,
    humidity: 39,
    power: 68,
    vibration: 1.2,
    workersNearby: 8,
    lastUpdated: '9 sec ago',
    manufacturer: 'Siemens Process',
    installDate: '2017-11-23',
    operatingHours: '66,012 h',
    location: 'Central distillation row',
    lastMaintenance: '2026-05-17',
    nextInspection: '2026-08-19',
    openTickets: 1,
    rootCause: 'Transient pressure oscillation normalized',
    recommendation: 'Continue predictive pressure trend monitoring',
    confidence: '93%',
    failureWindow: 'None predicted',
  },
  {
    id: 'R-101',
    name: 'Reactor Units',
    type: 'Reactor Units',
    zone: 'ZONE C',
    status: 'Critical',
    health: 92,
    risk: 'Critical',
    left: '60%',
    top: '24%',
    w: '14%',
    h: '12%',
    temperature: 421,
    pressure: 17.2,
    flow: 82,
    gas: 39,
    humidity: 34,
    power: 88,
    vibration: 2.7,
    workersNearby: 12,
    lastUpdated: '10 sec ago',
    manufacturer: 'ABB Process Dynamics',
    installDate: '2016-07-05',
    operatingHours: '82,904 h',
    location: 'Hot work corridor',
    lastMaintenance: '2026-06-30',
    nextInspection: '2026-07-24',
    openTickets: 3,
    rootCause: 'Thermal drift at catalyst feed manifold',
    recommendation: 'Reduce feed rate 8% and re-balance coolant loops',
    confidence: '94%',
    failureWindow: '6-10 hours if unmitigated',
  },
  {
    id: 'HX-044',
    name: 'Heat Exchangers',
    type: 'Heat Exchangers',
    zone: 'ZONE B',
    status: 'Warning',
    health: 79,
    risk: 'Elevated',
    left: '56%',
    top: '36%',
    w: '14%',
    h: '10%',
    temperature: 287,
    pressure: 11.4,
    flow: 69,
    gas: 13,
    humidity: 37,
    power: 64,
    vibration: 2.1,
    workersNearby: 5,
    lastUpdated: '14 sec ago',
    manufacturer: 'Honeywell Thermal',
    installDate: '2020-02-18',
    operatingHours: '26,553 h',
    location: 'Process lane 3',
    lastMaintenance: '2026-06-15',
    nextInspection: '2026-08-02',
    openTickets: 2,
    rootCause: 'Fouling factor climbing above baseline',
    recommendation: 'Plan wash cycle and reduce differential stress load',
    confidence: '86%',
    failureWindow: '9-13 days',
  },
  {
    id: 'PS-023',
    name: 'Pump Stations',
    type: 'Pump Stations',
    zone: 'ZONE D',
    status: 'Maintenance',
    health: 71,
    risk: 'Medium',
    left: '18%',
    top: '64%',
    w: '14%',
    h: '10%',
    temperature: 88,
    pressure: 6.4,
    flow: 53,
    gas: 4,
    humidity: 56,
    power: 59,
    vibration: 3.2,
    workersNearby: 3,
    lastUpdated: '16 sec ago',
    manufacturer: 'GE Rotating Systems',
    installDate: '2015-04-13',
    operatingHours: '93,102 h',
    location: 'Utility ring 1',
    lastMaintenance: '2026-07-17',
    nextInspection: '2026-07-27',
    openTickets: 2,
    rootCause: 'Impeller wear pattern detected',
    recommendation: 'Replace impeller and verify shaft alignment',
    confidence: '90%',
    failureWindow: '5-8 days',
  },
  {
    id: 'WH-090',
    name: 'Warehouse',
    type: 'Warehouse',
    zone: 'ZONE E',
    status: 'Offline',
    health: 62,
    risk: 'High',
    left: '46%',
    top: '73%',
    w: '14%',
    h: '9%',
    temperature: 42,
    pressure: 1.9,
    flow: 0,
    gas: 6,
    humidity: 49,
    power: 12,
    vibration: 0.4,
    workersNearby: 2,
    lastUpdated: '22 sec ago',
    manufacturer: 'AVEVA Facilities',
    installDate: '2014-10-01',
    operatingHours: '110,302 h',
    location: 'South logistics yard',
    lastMaintenance: '2026-04-28',
    nextInspection: '2026-07-29',
    openTickets: 4,
    rootCause: 'Power rail isolation for panel replacement',
    recommendation: 'Keep zone isolated until panel diagnostics complete',
    confidence: '92%',
    failureWindow: 'N/A while offline',
  },
  {
    id: 'LB-071',
    name: 'Loading Bay',
    type: 'Loading Bay',
    zone: 'ZONE E',
    status: 'Warning',
    health: 76,
    risk: 'High',
    left: '74%',
    top: '70%',
    w: '14%',
    h: '10%',
    temperature: 65,
    pressure: 3.9,
    flow: 58,
    gas: 18,
    humidity: 51,
    power: 49,
    vibration: 1.6,
    workersNearby: 11,
    lastUpdated: '11 sec ago',
    manufacturer: 'Siemens Yard Ops',
    installDate: '2021-05-19',
    operatingHours: '17,441 h',
    location: 'Outbound lane B',
    lastMaintenance: '2026-07-02',
    nextInspection: '2026-07-25',
    openTickets: 2,
    rootCause: 'Worker and truck overlap risk spike',
    recommendation: 'Throttle lane throughput and stagger dispatch',
    confidence: '84%',
    failureWindow: '12-18 hours under current load',
  },
  {
    id: 'CR-010',
    name: 'Control Room',
    type: 'Control Room',
    zone: 'ZONE D',
    status: 'Healthy',
    health: 97,
    risk: 'Low',
    left: '80%',
    top: '11%',
    w: '14%',
    h: '9%',
    temperature: 24,
    pressure: 1.1,
    flow: 22,
    gas: 1,
    humidity: 41,
    power: 46,
    vibration: 0.2,
    workersNearby: 9,
    lastUpdated: '6 sec ago',
    manufacturer: 'Honeywell Forge Console',
    installDate: '2022-03-03',
    operatingHours: '11,940 h',
    location: 'Supervisory quadrant',
    lastMaintenance: '2026-07-10',
    nextInspection: '2026-08-10',
    openTickets: 0,
    rootCause: 'No anomaly',
    recommendation: 'Maintain current command profile',
    confidence: '99%',
    failureWindow: 'None predicted',
  },
  {
    id: 'PJ-114',
    name: 'Pipeline Junctions',
    type: 'Pipeline Junctions',
    zone: 'ZONE B',
    status: 'Warning',
    health: 81,
    risk: 'Elevated',
    left: '49%',
    top: '43%',
    w: '10%',
    h: '8%',
    temperature: 103,
    pressure: 8.9,
    flow: 74,
    gas: 9,
    humidity: 36,
    power: 34,
    vibration: 1.4,
    workersNearby: 3,
    lastUpdated: '15 sec ago',
    manufacturer: 'ABB FlowLogic',
    installDate: '2018-11-28',
    operatingHours: '52,113 h',
    location: 'Central manifold',
    lastMaintenance: '2026-06-05',
    nextInspection: '2026-07-31',
    openTickets: 1,
    rootCause: 'Intermittent valve lag on branch C',
    recommendation: 'Run branch valve diagnostics and tune actuator curve',
    confidence: '87%',
    failureWindow: '3-5 days',
  },
  {
    id: 'VS-307',
    name: 'Valve Stations',
    type: 'Valve Stations',
    zone: 'ZONE C',
    status: 'Critical',
    health: 68,
    risk: 'Critical',
    left: '66%',
    top: '31%',
    w: '11%',
    h: '8%',
    temperature: 166,
    pressure: 14.6,
    flow: 81,
    gas: 22,
    humidity: 33,
    power: 39,
    vibration: 2.4,
    workersNearby: 7,
    lastUpdated: '7 sec ago',
    manufacturer: 'GE Valve Tech',
    installDate: '2017-08-09',
    operatingHours: '70,911 h',
    location: 'Reactor branch C',
    lastMaintenance: '2026-05-29',
    nextInspection: '2026-07-23',
    openTickets: 4,
    rootCause: 'Actuator response degradation',
    recommendation: 'Switch to safe profile and replace actuator block',
    confidence: '95%',
    failureWindow: '2-4 hours under current load',
  },
  {
    id: 'SS-014',
    name: 'Substation',
    type: 'Substation',
    zone: 'ZONE D',
    status: 'Healthy',
    health: 93,
    risk: 'Low',
    left: '33%',
    top: '54%',
    w: '11%',
    h: '9%',
    temperature: 41,
    pressure: 1.3,
    flow: 32,
    gas: 2,
    humidity: 44,
    power: 81,
    vibration: 0.7,
    workersNearby: 2,
    lastUpdated: '9 sec ago',
    manufacturer: 'Siemens GridSense',
    installDate: '2019-08-12',
    operatingHours: '31,821 h',
    location: 'Power corridor D-2',
    lastMaintenance: '2026-07-03',
    nextInspection: '2026-08-08',
    openTickets: 0,
    rootCause: 'No anomaly',
    recommendation: 'Continue nominal load balancing profile',
    confidence: '96%',
    failureWindow: 'None predicted',
  },
]

const markers: Marker[] = [
  {
    id: 'worker-1',
    type: 'worker',
    left: '61%',
    top: '38%',
    zone: 'ZONE C',
    status: 'Warning',
    data: {
      id: 'W-203',
      role: 'Hot Work Specialist',
      task: 'Catalyst feed inspection',
      ppe: 'Compliant',
      heartRate: '102 bpm',
      zone: 'ZONE C',
    },
  },
  {
    id: 'worker-2',
    type: 'worker',
    left: '75%',
    top: '67%',
    zone: 'ZONE E',
    status: 'Healthy',
    data: {
      id: 'W-118',
      role: 'Loading Supervisor',
      task: 'Truck lane sequencing',
      ppe: 'Compliant',
      heartRate: '88 bpm',
      zone: 'ZONE E',
    },
  },
  {
    id: 'sensor-1',
    type: 'sensor',
    left: '39%',
    top: '26%',
    zone: 'ZONE B',
    status: 'Healthy',
    data: {
      id: 'S-88',
      type: 'Temperature',
      reading: '88.3 C',
      status: 'Nominal',
      temperature: '88.3 C',
      pressure: '6.1 bar',
      humidity: '48%',
      battery: '91%',
      signal: '-58 dBm',
      updated: '5 sec ago',
    },
  },
  {
    id: 'sensor-2',
    type: 'sensor',
    left: '27%',
    top: '65%',
    zone: 'ZONE D',
    status: 'Warning',
    data: {
      id: 'S-09',
      type: 'Pressure',
      reading: '6.8 bar',
      status: 'Elevated',
      temperature: '73.8 C',
      pressure: '6.8 bar',
      humidity: '51%',
      battery: '73%',
      signal: '-64 dBm',
      updated: '8 sec ago',
    },
  },
  {
    id: 'camera-1',
    type: 'camera',
    left: '82%',
    top: '19%',
    zone: 'ZONE D',
    status: 'Healthy',
    data: {
      id: 'C-12',
      status: 'Online',
      recording: 'Active',
      direction: 'North-East',
      fov: '120 deg',
      latency: '112 ms',
      updated: '2 sec ago',
    },
  },
  {
    id: 'camera-2',
    type: 'camera',
    left: '48%',
    top: '73%',
    zone: 'ZONE E',
    status: 'Warning',
    data: {
      id: 'C-21',
      status: 'Online',
      recording: 'Active',
      direction: 'South-West',
      fov: '95 deg',
      latency: '182 ms',
      updated: '4 sec ago',
    },
  },
  {
    id: 'hydrant-1',
    type: 'hydrant',
    left: '14%',
    top: '50%',
    zone: 'ZONE D',
    status: 'Healthy',
    data: {
      id: 'H-08',
      status: 'Ready',
      pressure: '7.2 bar',
      flow: '1100 L/min',
      lastTest: '2026-07-04',
      updated: '1 min ago',
    },
  },
  {
    id: 'alarm-1',
    type: 'alarm',
    left: '66%',
    top: '32%',
    zone: 'ZONE C',
    status: 'Critical',
    data: {
      id: 'A-03',
      status: 'Active',
      level: 'High',
      source: 'Valve station VS-307',
      ack: 'Pending',
      updated: '3 sec ago',
    },
  },
]

const pipelinePaths: PipelinePath[] = [
  { id: 'P-01', left: '16%', top: '23%', width: '34%', rotate: '0deg', flow: 76, pressure: 8.1, valveState: 'Open', status: 'Healthy' },
  { id: 'P-02', left: '47%', top: '23%', width: '20%', rotate: '0deg', flow: 81, pressure: 9.4, valveState: 'Open', status: 'Warning' },
  { id: 'P-03', left: '67%', top: '23%', width: '18%', rotate: '0deg', flow: 68, pressure: 10.8, valveState: 'Throttled', status: 'Warning' },
  { id: 'P-04', left: '49%', top: '23%', width: '1%', rotate: '90deg', height: '34%', flow: 72, pressure: 7.9, valveState: 'Open', status: 'Healthy' },
  { id: 'P-05', left: '28%', top: '57%', width: '42%', rotate: '0deg', flow: 61, pressure: 6.7, valveState: 'Open', status: 'Maintenance' },
  { id: 'P-06', left: '69%', top: '57%', width: '13%', rotate: '0deg', flow: 57, pressure: 5.9, valveState: 'Open', status: 'Healthy' },
  { id: 'P-07', left: '19%', top: '72%', width: '62%', rotate: '0deg', flow: 49, pressure: 4.2, valveState: 'Partial', status: 'Warning' },
  { id: 'P-08', left: '35%', top: '31%', width: '18%', rotate: '0deg', flow: 64, pressure: 7.1, valveState: 'Open', status: 'Healthy' },
  { id: 'P-09', left: '53%', top: '31%', width: '1%', rotate: '90deg', height: '20%', flow: 66, pressure: 7.3, valveState: 'Open', status: 'Healthy' },
  { id: 'P-10', left: '54%', top: '50%', width: '18%', rotate: '0deg', flow: 54, pressure: 5.4, valveState: 'Partial', status: 'Warning' },
  { id: 'P-11', left: '72%', top: '46%', width: '1%', rotate: '90deg', height: '13%', flow: 52, pressure: 5.1, valveState: 'Open', status: 'Healthy' },
  { id: 'P-12', left: '73%', top: '46%', width: '11%', rotate: '0deg', flow: 51, pressure: 4.7, valveState: 'Open', status: 'Healthy' },
  { id: 'P-13', left: '33%', top: '58%', width: '1%', rotate: '90deg', height: '13%', flow: 46, pressure: 4.4, valveState: 'Open', status: 'Healthy' },
]

const assemblyPoints = [
  { left: '9%', top: '78%' },
  { left: '36%', top: '82%' },
  { left: '88%', top: '84%' },
]

const utilityPoints: UtilityPoint[] = [
  { id: 'permit-zc-12', type: 'permit', left: '59%', top: '47%', zone: 'ZONE C', label: 'Permit Zone', detail: 'PZ-12 hot work permit active' },
  { id: 'permit-zb-07', type: 'permit', left: '44%', top: '34%', zone: 'ZONE B', label: 'Permit Zone', detail: 'PZ-07 process maintenance permit' },
  { id: 'insp-za-02', type: 'inspection', left: '22%', top: '27%', zone: 'ZONE A', label: 'Inspection Point', detail: 'IP-02 cooling loop visual checks' },
  { id: 'insp-ze-05', type: 'inspection', left: '77%', top: '76%', zone: 'ZONE E', label: 'Inspection Point', detail: 'IP-05 loading bay compliance walk' },
  { id: 'est-zd-01', type: 'emergency', left: '86%', top: '30%', zone: 'ZONE D', label: 'Emergency Station', detail: 'ES-01 control block response station' },
  { id: 'est-zc-03', type: 'emergency', left: '68%', top: '42%', zone: 'ZONE C', label: 'Emergency Station', detail: 'ES-03 reactor corridor response station' },
]

const equipmentLabelOffsets: Record<string, { x: string; y: string; anchor: 'left' | 'center' | 'right' }> = {
  'ST-201': { x: '-4%', y: '-26%', anchor: 'left' },
  'CT-015': { x: '104%', y: '-28%', anchor: 'left' },
  'DT-110': { x: '50%', y: '-28%', anchor: 'center' },
  'R-101': { x: '50%', y: '-30%', anchor: 'center' },
  'HX-044': { x: '50%', y: '-28%', anchor: 'center' },
  'PS-023': { x: '104%', y: '-24%', anchor: 'left' },
  'WH-090': { x: '50%', y: '-28%', anchor: 'center' },
  'LB-071': { x: '100%', y: '-24%', anchor: 'left' },
  'CR-010': { x: '50%', y: '-26%', anchor: 'center' },
  'PJ-114': { x: '50%', y: '-26%', anchor: 'center' },
  'VS-307': { x: '50%', y: '-30%', anchor: 'center' },
  'SS-014': { x: '50%', y: '-26%', anchor: 'center' },
}

type SelectedEntity =
  | { kind: 'equipment'; id: string }
  | { kind: 'worker'; id: string }
  | { kind: 'sensor'; id: string }
  | { kind: 'camera'; id: string }
  | { kind: 'pipeline'; id: string }
  | { kind: 'alarm'; id: string }
  | { kind: 'hydrant'; id: string }

type DrawerTab = 'Overview' | 'Telemetry' | 'Maintenance' | 'AI Insights'

type ViewMode = 'Plant View' | 'Zone View' | 'Sensor View' | 'Heat Map' | 'Risk View'
type CameraPreset = 'Overview' | 'North' | 'South' | 'East' | 'West'
type LayerKey = 'workers' | 'sensors' | 'cameras' | 'permits' | 'hydrants' | 'assembly'
type SceneTransform = { x: number; y: number; scale: number }

type ControlLayerKey = 'equipment' | 'pipelines' | 'workers' | 'sensors' | 'cameras' | 'labels'

type DigitalTwinViewportProps = {
  search?: string
  onSearchChange?: (value: string) => void
  selectedZone?: string
  onZoneChange?: (value: string) => void
  viewMode?: ViewMode
  onViewModeChange?: (value: ViewMode) => void
  layersVisible?: Record<ControlLayerKey, boolean>
  showChrome?: boolean
  showLabels?: boolean
}

type MockAlert = {
  id: string
  severity: 'critical' | 'warning'
  message: string
  source: string
  timestamp: string
}

const cameraPresetLabels: CameraPreset[] = ['Overview', 'North', 'South', 'East', 'West']

const sceneByZone: Record<string, SceneTransform> = {
  'ZONE A': { x: 10, y: 8, scale: 1.18 },
  'ZONE B': { x: 3, y: 4, scale: 1.16 },
  'ZONE C': { x: -8, y: 1, scale: 1.22 },
  'ZONE D': { x: -13, y: 8, scale: 1.2 },
  'ZONE E': { x: -10, y: -10, scale: 1.2 },
  HOME: { x: 0, y: 0, scale: 1 },
}

const sceneByCamera: Record<CameraPreset, SceneTransform> = {
  Overview: { x: 0, y: 0, scale: 1 },
  North: { x: 0, y: 7, scale: 1.14 },
  South: { x: 0, y: -8, scale: 1.14 },
  East: { x: -10, y: 0, scale: 1.14 },
  West: { x: 10, y: 0, scale: 1.14 },
}

const mockAlertTemplates: Array<{ severity: MockAlert['severity']; message: string; source: string }> = [
  { severity: 'critical', message: 'High reactor temperature in Zone C', source: 'R-101' },
  { severity: 'warning', message: 'Pressure spike detected on branch line', source: 'P-03' },
  { severity: 'warning', message: 'Worker entered restricted hot-work lane', source: 'W-203' },
  { severity: 'warning', message: 'Sensor heartbeat dropped below threshold', source: 'S-09' },
  { severity: 'critical', message: 'Permit conflict in maintenance corridor', source: 'PZ-12' },
  { severity: 'critical', message: 'Potential leak signature near valve block', source: 'VS-307' },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function formatAgo(seconds: number) {
  return `${Math.max(1, Math.round(seconds))} sec ago`
}

function getMarkerVisual(type: MarkerType) {
  if (type === 'worker') {
    return { tone: 'bg-primary', border: 'border-primary/50', Icon: Users }
  }
  if (type === 'sensor') {
    return { tone: 'bg-success', border: 'border-success/50', Icon: Wifi }
  }
  if (type === 'camera') {
    return { tone: 'bg-warning', border: 'border-warning/50', Icon: Camera }
  }
  if (type === 'alarm') {
    return { tone: 'bg-critical', border: 'border-critical/55', Icon: Siren }
  }
  return { tone: 'bg-danger', border: 'border-danger/55', Icon: ShieldAlert }
}

function formatNumber(value: number, unit: string) {
  if (Number.isInteger(value)) {
    return `${value}${unit}`
  }
  return `${value.toFixed(1)}${unit}`
}

function HealthRing({ health, status }: { health: number; status: Status }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const stroke = circumference - (health / 100) * circumference

  return (
    <div className="relative inline-flex size-16 items-center justify-center">
      <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} className="stroke-border" strokeWidth="6" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          className={statusTone[status].ring}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={stroke}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-semibold text-foreground">{health}%</span>
    </div>
  )
}

function TelemetryBar({ label, value, max, unit, tone }: { label: string; value: number; max: number; unit: string; tone: string }) {
  const ratio = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div className="rounded-md border border-border/70 bg-background/50 p-1.5">
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{formatNumber(value, unit)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-background/70">
        <div className={cn('h-full rounded-full transition-all duration-300', tone)} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  )
}

function EquipmentSilhouette({ type, status }: { type: EquipmentType; status: Status }) {
  const accent =
    status === 'Critical'
      ? '#ef4444'
      : status === 'Warning'
        ? '#f59e0b'
        : status === 'Maintenance'
          ? '#3b82f6'
          : '#10b981'

  if (type === 'Storage Tanks') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <ellipse cx="34" cy="20" rx="18" ry="7" fill="rgba(148,163,184,0.7)" />
        <rect x="16" y="20" width="36" height="24" rx="4" fill="rgba(71,85,105,0.88)" />
        <ellipse cx="34" cy="44" rx="18" ry="7" fill="rgba(51,65,85,0.95)" />
        <ellipse cx="82" cy="22" rx="16" ry="6" fill="rgba(148,163,184,0.7)" />
        <rect x="66" y="22" width="32" height="21" rx="4" fill="rgba(71,85,105,0.88)" />
        <ellipse cx="82" cy="43" rx="16" ry="6" fill="rgba(51,65,85,0.95)" />
        <path d="M52 30 L66 30" stroke={accent} strokeWidth="2.2" />
      </svg>
    )
  }

  if (type === 'Cooling Towers') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <polygon points="20,46 31,16 45,16 56,46" fill="rgba(71,85,105,0.9)" />
        <polygon points="64,46 75,16 89,16 100,46" fill="rgba(71,85,105,0.9)" />
        <rect x="16" y="46" width="44" height="8" rx="3" fill="rgba(51,65,85,0.95)" />
        <rect x="60" y="46" width="44" height="8" rx="3" fill="rgba(51,65,85,0.95)" />
        <path d="M38 12 C38 8 40 7 40 4" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M82 12 C82 8 84 7 84 4" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'Distillation Towers') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <rect x="22" y="10" width="18" height="44" rx="7" fill="rgba(71,85,105,0.9)" />
        <rect x="48" y="6" width="20" height="48" rx="8" fill="rgba(100,116,139,0.9)" />
        <rect x="76" y="12" width="18" height="42" rx="7" fill="rgba(71,85,105,0.9)" />
        <path d="M40 23 L48 23 M68 31 L76 31" stroke={accent} strokeWidth="2" />
      </svg>
    )
  }

  if (type === 'Reactor Units') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <rect x="22" y="14" width="34" height="36" rx="12" fill="rgba(71,85,105,0.9)" />
        <rect x="64" y="10" width="34" height="40" rx="12" fill="rgba(51,65,85,0.9)" />
        <rect x="34" y="6" width="10" height="10" rx="2" fill="rgba(148,163,184,0.8)" />
        <rect x="76" y="2" width="10" height="10" rx="2" fill="rgba(148,163,184,0.8)" />
        <circle cx="39" cy="31" r="4" fill={accent} opacity="0.8" />
        <circle cx="81" cy="30" r="4" fill={accent} opacity="0.8" />
      </svg>
    )
  }

  if (type === 'Heat Exchangers') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <rect x="16" y="20" width="88" height="24" rx="10" fill="rgba(71,85,105,0.9)" />
        <path d="M24 24 L24 40 M34 24 L34 40 M44 24 L44 40 M54 24 L54 40 M64 24 L64 40 M74 24 L74 40 M84 24 L84 40 M94 24 L94 40" stroke="rgba(148,163,184,0.65)" strokeWidth="1.5" />
        <path d="M8 32 L16 32 M104 32 L112 32" stroke={accent} strokeWidth="2.2" />
      </svg>
    )
  }

  if (type === 'Pump Stations') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <circle cx="36" cy="32" r="13" fill="rgba(71,85,105,0.9)" />
        <circle cx="36" cy="32" r="5" fill="rgba(148,163,184,0.85)" />
        <rect x="52" y="20" width="50" height="24" rx="7" fill="rgba(51,65,85,0.95)" />
        <path d="M20 32 L14 32 M102 32 L112 32" stroke={accent} strokeWidth="2" />
      </svg>
    )
  }

  if (type === 'Warehouse') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <polygon points="16,26 60,10 104,26" fill="rgba(100,116,139,0.9)" />
        <rect x="16" y="26" width="88" height="28" rx="3" fill="rgba(51,65,85,0.95)" />
        <rect x="52" y="36" width="16" height="18" fill="rgba(148,163,184,0.75)" />
        <rect x="28" y="34" width="14" height="8" fill={accent} opacity="0.5" />
      </svg>
    )
  }

  if (type === 'Loading Bay') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <rect x="18" y="24" width="84" height="26" rx="4" fill="rgba(51,65,85,0.95)" />
        <rect x="24" y="30" width="16" height="16" fill="rgba(148,163,184,0.78)" />
        <rect x="44" y="30" width="16" height="16" fill="rgba(148,163,184,0.78)" />
        <rect x="64" y="30" width="16" height="16" fill="rgba(148,163,184,0.78)" />
        <path d="M18 22 L102 22" stroke={accent} strokeWidth="2" />
      </svg>
    )
  }

  if (type === 'Control Room') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <rect x="24" y="16" width="72" height="36" rx="6" fill="rgba(51,65,85,0.95)" />
        <rect x="30" y="22" width="60" height="12" rx="3" fill="rgba(96,165,250,0.32)" />
        <rect x="52" y="36" width="16" height="16" rx="2" fill="rgba(148,163,184,0.72)" />
        <circle cx="86" cy="18" r="3" fill={accent} />
      </svg>
    )
  }

  if (type === 'Pipeline Junctions') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <rect x="14" y="28" width="92" height="8" rx="4" fill="rgba(71,85,105,0.95)" />
        <rect x="56" y="12" width="8" height="40" rx="4" fill="rgba(100,116,139,0.95)" />
        <rect x="50" y="24" width="20" height="16" rx="4" fill="rgba(148,163,184,0.8)" />
        <circle cx="60" cy="32" r="3" fill={accent} />
      </svg>
    )
  }

  if (type === 'Substation') {
    return (
      <svg viewBox="0 0 120 64" className="h-9 w-full">
        <rect x="18" y="22" width="84" height="26" rx="4" fill="rgba(51,65,85,0.95)" />
        <rect x="24" y="16" width="10" height="10" rx="2" fill="rgba(148,163,184,0.78)" />
        <rect x="44" y="16" width="10" height="10" rx="2" fill="rgba(148,163,184,0.78)" />
        <rect x="64" y="16" width="10" height="10" rx="2" fill="rgba(148,163,184,0.78)" />
        <rect x="84" y="16" width="10" height="10" rx="2" fill="rgba(148,163,184,0.78)" />
        <path d="M24 52 L24 58 M44 52 L44 58 M64 52 L64 58 M84 52 L84 58" stroke={accent} strokeWidth="1.8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 120 64" className="h-9 w-full">
      <rect x="22" y="20" width="76" height="24" rx="6" fill="rgba(71,85,105,0.9)" />
      <circle cx="60" cy="32" r="5" fill={accent} />
    </svg>
  )
}

export function DigitalTwinViewport({
  search = '',
  onSearchChange = () => undefined,
  selectedZone: controlledZone = 'All Zones',
  onZoneChange = () => undefined,
  viewMode = 'Plant View',
  onViewModeChange = () => undefined,
  layersVisible: controlLayersVisible = {
    equipment: true,
    pipelines: true,
    workers: true,
    sensors: true,
    cameras: true,
    labels: true,
  },
  showChrome = true,
  showLabels = true,
}: DigitalTwinViewportProps) {
  const [selected, setSelected] = useState<SelectedEntity | null>(null)
  const [hoveredEquipment, setHoveredEquipment] = useState<string | null>(null)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [hoveredPipeline, setHoveredPipeline] = useState<string | null>(null)
  const [hoveredUtility, setHoveredUtility] = useState<string | null>(null)
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('Overview')
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('Overview')
  const [sceneTransform, setSceneTransform] = useState<SceneTransform>(sceneByCamera.Overview)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreenMode, setIsFullscreenMode] = useState(false)
  const [labelsVisible, setLabelsVisible] = useState(true)
  const [nightMode, setNightMode] = useState(false)
  const [layersPanelOpen, setLayersPanelOpen] = useState(false)
  const [navFocus, setNavFocus] = useState('Home')
  const [viewportLayersVisible, setViewportLayersVisible] = useState<Record<LayerKey, boolean>>({
    workers: true,
    sensors: true,
    cameras: true,
    permits: true,
    hydrants: true,
    assembly: true,
  })
  const [liveEquipment, setLiveEquipment] = useState<Equipment[]>(equipmentData)
  const [liveMarkers, setLiveMarkers] = useState<Marker[]>(markers)
  const [activeAlert, setActiveAlert] = useState<MockAlert | null>(null)
  const [telemetryTick, setTelemetryTick] = useState(0)

  const selectedZone = controlledZone === 'All Zones' ? null : controlledZone
  const setSelectedZone = (zone: string | null) => onZoneChange(zone ?? 'All Zones')
  const setSearch = onSearchChange
  const setViewMode = (mode: ViewMode) => onViewModeChange(mode)
  const layersVisible = {
    ...viewportLayersVisible,
    equipment: controlLayersVisible.equipment,
    pipelines: controlLayersVisible.pipelines,
    labels: controlLayersVisible.labels,
    workers: controlLayersVisible.workers && viewportLayersVisible.workers,
    sensors: controlLayersVisible.sensors && viewportLayersVisible.sensors,
    cameras: controlLayersVisible.cameras && viewportLayersVisible.cameras,
  }

  const applySceneTransform = useCallback((next: SceneTransform) => {
    setSceneTransform(next)
    setZoomLevel(next.scale)
  }, [])

  const focusZone = useCallback((zone: string) => {
    const pose = sceneByZone[zone] ?? sceneByZone.HOME
    applySceneTransform(pose)
    setSelectedZone(zone)
  }, [applySceneTransform])

  useEffect(() => {
    if (controlledZone === 'All Zones') {
      return
    }

    focusZone(controlledZone)
    setNavFocus(controlledZone)
  }, [controlledZone, focusZone])

  const applyCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset)
    applySceneTransform(sceneByCamera[preset])
  }, [applySceneTransform])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    const tick = () => {
      setTelemetryTick((prev) => prev + 1)

      setLiveEquipment((prev) =>
        prev.map((equipment) => {
          const temperature = clamp(equipment.temperature + (Math.random() - 0.5) * 6, 0, 500)
          const pressure = clamp(equipment.pressure + (Math.random() - 0.5) * 0.35, 0, 22)
          const flow = clamp(equipment.flow + (Math.random() - 0.5) * 4, 0, 100)
          const gas = clamp(equipment.gas + (Math.random() - 0.5) * 2, 0, 80)
          const power = clamp(equipment.power + (Math.random() - 0.5) * 3, 0, 100)
          const humidity = clamp(equipment.humidity + (Math.random() - 0.5) * 2.8, 0, 100)
          const vibration = clamp(equipment.vibration + (Math.random() - 0.5) * 0.15, 0, 5)
          const health = clamp(equipment.health + (Math.random() - 0.5) * 1.8, 50, 100)

          const autoStatus: Status = temperature > 410 || gas > 35
            ? 'Critical'
            : temperature > 280 || pressure > 12
              ? 'Warning'
              : equipment.status === 'Offline'
                ? 'Offline'
                : equipment.status === 'Maintenance'
                  ? 'Maintenance'
                  : 'Healthy'

          const autoRisk = autoStatus === 'Critical'
            ? 'Critical'
            : autoStatus === 'Warning'
              ? 'Elevated'
              : autoStatus === 'Maintenance'
                ? 'Medium'
                : 'Low'

          const recommendation = autoStatus === 'Critical'
            ? 'Reduce process load, inspect cooling loop, and isolate unstable branch valve'
            : autoStatus === 'Warning'
              ? 'Stabilize pressure profile and schedule predictive maintenance check'
              : equipment.recommendation

          const confidence = autoStatus === 'Critical' ? '94%' : autoStatus === 'Warning' ? '88%' : equipment.confidence

          return {
            ...equipment,
            status: autoStatus,
            risk: autoRisk,
            health,
            temperature,
            pressure,
            flow,
            gas,
            humidity,
            power,
            vibration,
            recommendation,
            confidence,
            lastUpdated: 'just now',
          }
        }),
      )

      setLiveMarkers((prev) =>
        prev.map((marker) => {
          if (marker.type !== 'sensor') {
            return {
              ...marker,
              data: {
                ...marker.data,
                updated: marker.type === 'camera' ? formatAgo(2 + Math.random() * 8) : marker.data.updated,
              },
            }
          }

          const isThermal = marker.data.type?.toLowerCase().includes('temperature')
          const readingValue = isThermal
            ? `${(86 + Math.random() * 9).toFixed(1)} C`
            : `${(6 + Math.random() * 1.3).toFixed(1)} bar`
          const temperatureValue = `${(72 + Math.random() * 24).toFixed(1)} C`
          const pressureValue = `${(5.4 + Math.random() * 2.2).toFixed(1)} bar`
          const humidityValue = `${Math.round(40 + Math.random() * 22)}%`
          const battery = clamp(Number.parseInt(marker.data.battery ?? '80', 10) + (Math.random() > 0.6 ? -1 : 0), 58, 99)
          const signal = -52 - Math.round(Math.random() * 14)
          const status: Status = isThermal
            ? Number.parseFloat(readingValue) > 92
              ? 'Warning'
              : 'Healthy'
            : Number.parseFloat(readingValue) > 7
              ? 'Warning'
              : 'Healthy'

          return {
            ...marker,
            status,
            data: {
              ...marker.data,
              reading: readingValue,
              status: status === 'Warning' ? 'Elevated' : 'Nominal',
              temperature: temperatureValue,
              pressure: pressureValue,
              humidity: humidityValue,
              battery: `${battery}%`,
              signal: `${signal} dBm`,
              updated: 'just now',
            },
          }
        }),
      )

      if (Math.random() > 0.55) {
        const template = mockAlertTemplates[Math.floor(Math.random() * mockAlertTemplates.length)]
        setActiveAlert({
          id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
          severity: template.severity,
          message: template.message,
          source: template.source,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      }

      timer = window.setTimeout(tick, 5000 + Math.floor(Math.random() * 5000))
    }

    timer = window.setTimeout(tick, 5400)

    return () => {
      if (timer) {
        window.clearTimeout(timer)
      }
    }
  }, [applyCameraPreset])

  useEffect(() => {
    if (!activeAlert) {
      return
    }

    window.dispatchEvent(new CustomEvent('safe:digital-twin-alert', { detail: activeAlert }))
  }, [activeAlert])

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() === 'f' && !event.ctrlKey) {
        event.preventDefault()
        setSelected(null)
      }

      if (event.key === 'Escape') {
        setSelected(null)
      }

      if (event.key.toLowerCase() === 'f' && event.ctrlKey) {
        event.preventDefault()
        const input = document.getElementById('digital-twin-equipment-search') as HTMLInputElement | null
        input?.focus()
      }

      if (event.key === '+') {
        setZoomLevel((prev) => clamp(prev + 0.08, 0.86, 1.8))
      }

      if (event.key === '-') {
        setZoomLevel((prev) => clamp(prev - 0.08, 0.86, 1.8))
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const button = target?.closest('button')
      if (!button) {
        return
      }

      const label = button.textContent?.trim() as CameraPreset | undefined
      if (!label || !cameraPresetLabels.includes(label)) {
        return
      }

      const cardText = button.closest('div')?.parentElement?.textContent ?? ''
      if (!cardText.includes('Camera Presets')) {
        return
      }

      applyCameraPreset(label)
    }

    document.addEventListener('click', onDocumentClick)

    return () => document.removeEventListener('click', onDocumentClick)
  }, [applyCameraPreset])

  const equipmentById = useMemo(() => new Map(liveEquipment.map((item) => [item.id, item])), [liveEquipment])

  const selectedEquipment = selected?.kind === 'equipment' ? equipmentById.get(selected.id) ?? null : null

  const selectedMarker = selected && selected.kind !== 'equipment' && selected.kind !== 'pipeline'
    ? liveMarkers.find((marker) => marker.id === selected.id) ?? null
    : null

  const selectedPipeline = selected?.kind === 'pipeline' ? pipelinePaths.find((pipe) => pipe.id === selected.id) ?? null : null

  const searchTerm = search.trim().toLowerCase()
  const highlightedEquipmentIds = useMemo(() => {
    if (!searchTerm) {
      return new Set<string>()
    }

    return new Set(
      liveEquipment
        .filter((item) => {
          const hay = `${item.id} ${item.name} ${item.type} ${item.zone}`.toLowerCase()
          return hay.includes(searchTerm)
        })
        .map((item) => item.id),
    )
  }, [liveEquipment, searchTerm])

  useEffect(() => {
    if (!searchTerm) {
      return
    }

    const matches = liveEquipment.filter((item) => {
      const hay = `${item.id} ${item.name} ${item.type}`.toLowerCase()
      return hay.includes(searchTerm)
    })

    if (matches.length === 0) {
      return
    }

    const shouldFocus = matches.length === 1 || /^[a-z]{1,3}-?\d+/i.test(searchTerm)
    if (!shouldFocus) {
      return
    }

    const target = matches[0]
    setSelected({ kind: 'equipment', id: target.id })
    setDrawerTab('Overview')
    focusZone(target.zone)
    setNavFocus(target.zone)
  }, [focusZone, liveEquipment, searchTerm])

  const telemetry = useMemo(() => {
    if (!selectedEquipment) {
      return null
    }

    const phase = telemetryTick % 10
    const jitter = (phase - 5) * 0.16

    return {
      temperature: Math.max(0, selectedEquipment.temperature + jitter * 2.4),
      pressure: Math.max(0, selectedEquipment.pressure + jitter * 0.08),
      flow: Math.max(0, selectedEquipment.flow + jitter * 1.2),
      gas: Math.max(0, selectedEquipment.gas + jitter * 0.4),
      humidity: Math.max(0, selectedEquipment.humidity + jitter * 0.5),
      power: Math.max(0, selectedEquipment.power + jitter * 0.9),
      vibration: Math.max(0, selectedEquipment.vibration + jitter * 0.04),
    }
  }, [selectedEquipment, telemetryTick])

  const breadcrumb = useMemo(() => {
    if (selectedEquipment) {
      return `Plant > ${selectedEquipment.zone} > ${selectedEquipment.id}`
    }

    if (selectedMarker) {
      return `Plant > ${selectedMarker.zone} > ${selectedMarker.data.id ?? selectedMarker.id}`
    }

    if (selectedPipeline) {
      return `Plant > Network > ${selectedPipeline.id}`
    }

    if (selectedZone && viewMode === 'Zone View') {
      return `Plant > ${selectedZone} > Operational Focus`
    }

    return 'Plant > Overview'
  }, [selectedEquipment, selectedMarker, selectedPipeline, selectedZone, viewMode])

  const contextCards = useMemo(() => {
    if (selectedEquipment) {
      return {
        plantHealth: `${selectedEquipment.health}%`,
        riskSummary: selectedEquipment.risk,
        aiInsight: selectedEquipment.recommendation,
        alerts: activeAlert ? `${activeAlert.severity.toUpperCase()}: ${activeAlert.message}` : `${selectedEquipment.openTickets} open ticket(s)`,
      }
    }

    if (selectedPipeline) {
      return {
        plantHealth: 'Network 84%',
        riskSummary: selectedPipeline.status,
        aiInsight: `Flow ${selectedPipeline.flow}% with ${selectedPipeline.valveState} valve state`,
        alerts: `${selectedPipeline.id} pressure ${selectedPipeline.pressure.toFixed(1)} bar`,
      }
    }

    if (selectedMarker) {
      return {
        plantHealth: selectedMarker.status,
        riskSummary: selectedMarker.zone,
        aiInsight: selectedMarker.data.task ?? selectedMarker.data.reading ?? selectedMarker.data.recording ?? 'Context linked',
        alerts: selectedMarker.data.updated ?? 'Live',
      }
    }

    return {
      plantHealth: '76%',
      riskSummary: 'Balanced',
      aiInsight: activeAlert
        ? `AI response: ${activeAlert.message}. Source ${activeAlert.source}.`
        : 'Select equipment for contextual operational intelligence',
      alerts: activeAlert ? `${activeAlert.severity.toUpperCase()} @ ${activeAlert.timestamp}` : '3 active alerts',
    }
  }, [activeAlert, selectedEquipment, selectedPipeline, selectedMarker])

  const visibleEquipment = useMemo(() => {
    if (viewMode === 'Sensor View') {
      return []
    }

    if (viewMode === 'Risk View') {
      return liveEquipment.filter((item) => item.status === 'Critical' || item.status === 'Warning' || item.risk === 'High' || item.risk === 'Critical')
    }

    return layersVisible.equipment ? liveEquipment : []
  }, [layersVisible.equipment, liveEquipment, viewMode])

  const visiblePipelines = useMemo(() => {
    if (viewMode === 'Sensor View') {
      return []
    }

    if (viewMode === 'Risk View') {
      return pipelinePaths.filter((path) => path.status !== 'Healthy')
    }

    return pipelinePaths.filter(() => layersVisible.pipelines)
  }, [layersVisible.pipelines, viewMode])

  const visibleMarkers = useMemo(() => {
    const base = liveMarkers.filter((marker) => {
      if (viewMode === 'Sensor View') {
        return marker.type === 'sensor'
      }

      if (marker.type === 'worker' && !layersVisible.workers) {
        return false
      }

      if (marker.type === 'sensor' && !layersVisible.sensors) {
        return false
      }

      if (marker.type === 'camera' && !layersVisible.cameras) {
        return false
      }

      if (marker.type === 'hydrant' && !layersVisible.hydrants) {
        return false
      }

      if (viewMode === 'Risk View') {
        return marker.type === 'alarm' || marker.status === 'Critical' || marker.status === 'Warning'
      }

      return true
    })

    return base
  }, [layersVisible, liveMarkers, viewMode])

  const isHeatMapView = viewMode === 'Heat Map'
  const isZoneView = viewMode === 'Zone View'
  const isRiskView = viewMode === 'Risk View'
  const showEquipmentLabels = showLabels && controlLayersVisible.labels && labelsVisible && viewMode !== 'Heat Map' && viewMode !== 'Sensor View'

  const onTopModeClick = (mode: ViewMode) => {
    setViewMode(mode)

    if (mode === 'Plant View') {
      setSelectedZone(null)
      setNavFocus('Home')
      applySceneTransform(sceneByZone.HOME)
    }

    if (mode === 'Zone View' && !selectedZone) {
      setSelectedZone('ZONE C')
    }
  }

  const onBottomNavClick = (label: string) => {
    setNavFocus(label)

    if (label === 'Home' || label === 'Fit View' || label === 'Custom View') {
      setSelectedZone(null)
      applySceneTransform(label === 'Custom View' ? { x: -4, y: -3, scale: 1.12 } : sceneByZone.HOME)
      return
    }

    const zone = label.toUpperCase()
    focusZone(zone)
  }

  const onSideControlClick = (label: string) => {
    if (label === 'Zoom') {
      setZoomLevel((prev) => clamp(prev + 0.08, 0.86, 1.8))
      return
    }

    if (label === 'Pan') {
      setZoomLevel((prev) => clamp(prev - 0.08, 0.86, 1.8))
      return
    }

    if (label === 'Reset') {
      setSelectedZone(null)
      setNavFocus('Home')
      setCameraPreset('Overview')
      setViewMode('Plant View')
      applySceneTransform(sceneByCamera.Overview)
      return
    }

    if (label === 'Layers') {
      setLayersPanelOpen((prev) => !prev)
      return
    }

    if (label === 'Labels') {
      setLabelsVisible((prev) => !prev)
      return
    }

    if (label === 'Night Mode') {
      setNightMode((prev) => !prev)
      return
    }

    if (label === 'Rotate') {
      const currentIndex = cameraPresetLabels.findIndex((preset) => preset === cameraPreset)
      const next = cameraPresetLabels[(currentIndex + 1) % cameraPresetLabels.length]
      applyCameraPreset(next)
    }
  }

  const onTopActionClick = (label: string) => {
    if (label === 'Fullscreen') {
      setIsFullscreenMode((prev) => !prev)
      setZoomLevel((prev) => (prev < 1.1 ? 1.12 : 1))
      return
    }

    if (label === 'Export Snapshot') {
      setActiveAlert({
        id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
        severity: 'warning',
        message: 'Snapshot exported to operations archive',
        source: 'Digital Twin Viewport',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }
  }

  const sceneMotionStyle = useMemo(
    () => ({
      transform: `translate(${sceneTransform.x}%, ${sceneTransform.y}%) scale(${zoomLevel})`,
      transformOrigin: 'center center',
      transition: 'transform 460ms cubic-bezier(0.22, 0.6, 0.2, 1)',
    }),
    [sceneTransform.x, sceneTransform.y, zoomLevel],
  )

  const onViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setSelected(null)
    }
  }

  return (
    <div
      className={cn(
        'relative h-full min-h-0 overflow-hidden rounded-lg border border-border/80 bg-[linear-gradient(180deg,rgba(7,13,23,0.98),rgba(11,20,33,0.95))] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.14),0_14px_34px_rgba(0,0,0,0.42)]',
        isFullscreenMode && 'shadow-[inset_0_0_0_1px_rgba(59,130,246,0.24),0_18px_42px_rgba(0,0,0,0.5)]',
      )}
      onKeyDown={onViewportKeyDown}
      tabIndex={0}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${refineryStep25Bg})` }}
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/35" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_22%_26%,rgba(59,130,246,0.2),transparent_38%),radial-gradient(circle_at_77%_18%,rgba(245,158,11,0.13),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(148,163,184,0.12),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(2,8,18,0.45)_0%,rgba(3,10,20,0.18)_38%,rgba(2,8,18,0.58)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_50%,transparent_55%,rgba(0,0,0,0.38)_100%)]" />
      <div className="pointer-events-none absolute -left-20 -top-14 z-[2] h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-8 z-[2] h-52 w-52 rounded-full bg-warning/8 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 z-[2] opacity-50 [background-image:radial-gradient(rgba(191,219,254,0.35)_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
      {nightMode ? (
        <div className="pointer-events-none absolute inset-0 z-[4] bg-[linear-gradient(180deg,rgba(4,10,23,0.68),rgba(4,10,23,0.45),rgba(3,8,20,0.78))]" />
      ) : null}

      <div className={cn('absolute left-2 right-2 top-2 z-36 rounded-md border border-border/85 bg-background/70 px-2 py-1.5 backdrop-blur-sm', !showChrome && 'hidden')}>
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <ChevronRight className="size-3" />
            {breadcrumb}
          </div>
          <div className="relative w-56 max-w-full">
            <Search className="pointer-events-none absolute left-2 top-1.5 size-3.5 text-muted-foreground" />
            <input
              id="digital-twin-equipment-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search equipment (R-101, Pump, Tank)"
              className="h-7 w-full rounded-md border border-border/80 bg-background/65 pl-7 pr-2 text-[11px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary/60"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1">
            {topModes.map((mode) => {
              const Icon = mode.icon
              return (
                <button
                  key={mode.label}
                  type="button"
                  onClick={() => onTopModeClick(mode.label as ViewMode)}
                  className={cn(
                    'inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[10px] font-medium uppercase tracking-[0.12em] transition-all duration-200',
                    viewMode === mode.label
                      ? 'border-primary/70 bg-primary/15 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
                      : 'border-border/80 bg-background/70 text-muted-foreground hover:border-primary/35 hover:text-foreground',
                  )}
                >
                  <Icon className="size-3" />
                  {mode.label}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-1">
            {topActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => onTopActionClick(action.label)}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-border/80 bg-background/70 px-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition-all duration-200 hover:border-primary/35 hover:text-foreground"
                >
                  <Icon className="size-3" />
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {showChrome && activeAlert ? (
        <div
          className={cn(
            'pointer-events-none absolute right-3 top-[5.3rem] z-36 max-w-72 rounded-md border px-2 py-1 text-[10px] backdrop-blur-sm transition-all duration-300',
            activeAlert.severity === 'critical'
              ? 'border-critical/60 bg-critical/16 text-critical'
              : 'border-warning/60 bg-warning/16 text-warning',
          )}
        >
          <p className="font-semibold uppercase tracking-[0.12em]">Live Alert {activeAlert.id}</p>
          <p className="mt-0.5 text-foreground">{activeAlert.message}</p>
          <p className="mt-0.5 text-muted-foreground">{activeAlert.source} • {activeAlert.timestamp}</p>
        </div>
      ) : null}

      <div
        className={cn(
          'absolute inset-x-2 bottom-12 top-16 z-10 overflow-hidden rounded-md border border-border/70 bg-[linear-gradient(180deg,rgba(10,19,31,0.35),rgba(8,16,28,0.45))]',
          !showChrome && 'inset-0 rounded-none border-0',
          isZoneView && 'saturate-[0.75] brightness-[0.88]',
          viewMode === 'Sensor View' && 'brightness-[0.72] saturate-[0.7]',
          isRiskView && 'contrast-[1.04] brightness-[0.84]',
        )}
        style={sceneMotionStyle}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_88%,rgba(148,163,184,0.1),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-70 mask-[linear-gradient(to_bottom,transparent,black_16%,black_86%,transparent)]">
          <div className="h-full w-[38%] -translate-x-1/2 animate-pulse bg-linear-to-r from-transparent via-primary/14 to-transparent" />
        </div>

        {isHeatMapView ? (
          <>
            <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(circle_at_62%_30%,rgba(239,68,68,0.35),transparent_35%),radial-gradient(circle_at_45%_44%,rgba(245,158,11,0.28),transparent_36%),radial-gradient(circle_at_74%_66%,rgba(220,38,38,0.25),transparent_32%),radial-gradient(circle_at_24%_63%,rgba(245,158,11,0.24),transparent_34%)] animate-heat-shimmer" />
            <div className="pointer-events-none absolute bottom-3 left-3 z-[7] rounded-md border border-border/80 bg-background/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground">Heat Intensity</p>
              <div className="mt-1 h-2 w-28 rounded-full bg-linear-to-r from-success via-warning to-critical" />
              <div className="mt-1 flex justify-between text-[8px] uppercase tracking-[0.1em]">
                <span>Low</span><span>Mid</span><span>High</span>
              </div>
            </div>
          </>
        ) : null}

        {isRiskView ? (
          <svg viewBox="0 0 1000 620" className="pointer-events-none absolute inset-0 z-[6] h-full w-full" aria-hidden="true">
            <path d="M 606 220 L 670 278 L 742 334 L 806 388" stroke="rgba(220,38,38,0.72)" strokeWidth="2.8" strokeDasharray="8 7" fill="none" />
            <path d="M 670 278 L 622 354 L 588 426" stroke="rgba(245,158,11,0.68)" strokeWidth="2.4" strokeDasharray="7 8" fill="none" />
            <circle cx="606" cy="220" r="7" fill="rgba(220,38,38,0.9)" />
            <circle cx="670" cy="278" r="6" fill="rgba(245,158,11,0.82)" />
            <circle cx="742" cy="334" r="6" fill="rgba(220,38,38,0.82)" />
          </svg>
        ) : null}

        <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="steelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(148,163,184,0.35)" />
              <stop offset="100%" stopColor="rgba(30,41,59,0.5)" />
            </linearGradient>
            <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(51,65,85,0.8)" />
              <stop offset="50%" stopColor="rgba(100,116,139,0.92)" />
              <stop offset="100%" stopColor="rgba(51,65,85,0.8)" />
            </linearGradient>
            <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(51,65,85,0.45)" />
              <stop offset="100%" stopColor="rgba(30,41,59,0.72)" />
            </linearGradient>
          </defs>

          <rect x="40" y="40" width="920" height="540" rx="18" fill="rgba(15,23,42,0.22)" stroke="rgba(148,163,184,0.22)" />

          <path d="M 68 300 L 942 300" stroke="url(#roadGrad)" strokeWidth="18" strokeLinecap="round" opacity="0.75" />
          <path d="M 68 300 L 942 300" stroke="rgba(148,163,184,0.42)" strokeWidth="1.4" strokeDasharray="10 10" opacity="0.5" />
          <path d="M 70 336 L 944 336" stroke="rgba(51,65,85,0.52)" strokeWidth="7" strokeLinecap="round" opacity="0.65" />
          <path d="M 70 336 L 944 336" stroke="rgba(148,163,184,0.34)" strokeWidth="1" strokeDasharray="8 10" opacity="0.45" />
          <path d="M 312 84 L 312 556" stroke="url(#roadGrad)" strokeWidth="14" strokeLinecap="round" opacity="0.65" />
          <path d="M 312 84 L 312 556" stroke="rgba(148,163,184,0.38)" strokeWidth="1.2" strokeDasharray="7 9" opacity="0.46" />
          <path d="M 256 84 L 256 556" stroke="rgba(51,65,85,0.48)" strokeWidth="7" strokeLinecap="round" opacity="0.62" />
          <path d="M 670 126 L 868 126 L 868 536" stroke="rgba(71,85,105,0.6)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 124 520 L 244 520 L 244 580" stroke="rgba(71,85,105,0.58)" strokeWidth="9" fill="none" strokeLinecap="round" />

          <rect x="790" y="522" width="122" height="44" rx="6" fill="rgba(51,65,85,0.55)" stroke="rgba(148,163,184,0.28)" />
          <path d="M 750 516 L 942 516" stroke="rgba(71,85,105,0.55)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 752 522 L 942 522" stroke="rgba(148,163,184,0.32)" strokeWidth="1" strokeDasharray="6 8" />
          <path d="M 804 536 L 900 536 M 804 548 L 900 548" stroke="rgba(148,163,184,0.4)" strokeWidth="1" />
          <rect x="84" y="88" width="2" height="460" fill="rgba(148,163,184,0.3)" />
          <rect x="92" y="88" width="2" height="460" fill="rgba(148,163,184,0.22)" />
          <rect x="906" y="88" width="2" height="460" fill="rgba(148,163,184,0.3)" />
          <rect x="914" y="88" width="2" height="460" fill="rgba(148,163,184,0.22)" />

          <rect x="704" y="500" width="56" height="52" rx="5" fill="rgba(51,65,85,0.72)" stroke="rgba(148,163,184,0.32)" />
          <rect x="634" y="504" width="48" height="42" rx="4" fill="rgba(51,65,85,0.66)" stroke="rgba(148,163,184,0.28)" />
          <rect x="560" y="520" width="40" height="32" rx="4" fill="rgba(51,65,85,0.62)" stroke="rgba(148,163,184,0.24)" />

          <path d="M 332 156 L 572 156" stroke="rgba(100,116,139,0.55)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 332 164 L 572 164" stroke="rgba(148,163,184,0.42)" strokeWidth="1.2" strokeDasharray="4 6" />
          <path d="M 572 164 L 740 164" stroke="rgba(100,116,139,0.48)" strokeWidth="5" strokeLinecap="round" />

          <rect x="95" y="118" width="170" height="124" rx="14" fill="url(#steelGrad)" stroke="rgba(148,163,184,0.35)" />
          <circle cx="150" cy="175" r="26" fill="rgba(51,65,85,0.88)" stroke="rgba(148,163,184,0.32)" />
          <circle cx="205" cy="175" r="26" fill="rgba(51,65,85,0.88)" stroke="rgba(148,163,184,0.32)" />

          <rect x="318" y="92" width="188" height="170" rx="14" fill="url(#steelGrad)" stroke="rgba(148,163,184,0.35)" />
          <rect x="355" y="52" width="28" height="58" rx="10" fill="rgba(71,85,105,0.9)" />
          <rect x="414" y="44" width="28" height="66" rx="10" fill="rgba(71,85,105,0.9)" />

          <rect x="575" y="120" width="158" height="180" rx="16" fill="url(#steelGrad)" stroke="rgba(148,163,184,0.35)" />
          <rect x="622" y="62" width="54" height="62" rx="12" fill="rgba(71,85,105,0.88)" />

          <rect x="776" y="78" width="160" height="122" rx="14" fill="url(#steelGrad)" stroke="rgba(148,163,184,0.35)" />
          <rect x="776" y="242" width="160" height="114" rx="14" fill="url(#steelGrad)" stroke="rgba(148,163,184,0.35)" />

          <rect x="140" y="374" width="188" height="134" rx="15" fill="url(#steelGrad)" stroke="rgba(148,163,184,0.35)" />
          <circle cx="182" cy="432" r="20" fill="rgba(71,85,105,0.9)" />
          <circle cx="238" cy="432" r="20" fill="rgba(71,85,105,0.9)" />

          <rect x="378" y="402" width="236" height="102" rx="14" fill="url(#steelGrad)" stroke="rgba(148,163,184,0.35)" />
          <rect x="648" y="392" width="280" height="124" rx="14" fill="url(#steelGrad)" stroke="rgba(148,163,184,0.35)" />

          <rect x="278" y="176" width="32" height="10" rx="5" fill="rgba(148,163,184,0.45)" />
          <rect x="560" y="205" width="28" height="10" rx="5" fill="rgba(148,163,184,0.45)" />
          <rect x="642" y="445" width="30" height="10" rx="5" fill="rgba(148,163,184,0.45)" />
          <rect x="768" y="205" width="26" height="10" rx="5" fill="rgba(148,163,184,0.45)" />

          <path d="M 228 182 L 318 182 L 318 176 L 506 176 L 506 210 L 575 210" stroke="url(#pipeGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 506 210 L 506 432 L 648 432" stroke="url(#pipeGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 228 432 L 378 432" stroke="url(#pipeGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 614 452 L 648 452 L 648 452 L 896 452" stroke="url(#pipeGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 648 210 L 776 210" stroke="url(#pipeGrad)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 396 264 L 396 326 L 572 326" stroke="url(#pipeGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 708 268 L 708 336 L 808 336" stroke="url(#pipeGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 186 460 L 186 506 L 408 506" stroke="url(#pipeGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 572 326 L 572 382 L 680 382" stroke="url(#pipeGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 680 382 L 680 452" stroke="url(#pipeGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M 346 482 L 346 542 L 570 542" stroke="url(#pipeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 804 336 L 900 336 L 900 392" stroke="url(#pipeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 208 258 L 208 330 L 312 330" stroke="url(#pipeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 312 330 L 312 392 L 378 392" stroke="url(#pipeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 808 452 L 868 452" stroke="url(#pipeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />

          <rect x="202" y="326" width="12" height="8" rx="2" fill="rgba(148,163,184,0.74)" />
          <rect x="566" y="538" width="10" height="8" rx="2" fill="rgba(148,163,184,0.74)" />
          <rect x="896" y="332" width="10" height="8" rx="2" fill="rgba(148,163,184,0.74)" />

          <circle cx="506" cy="210" r="7" fill="rgba(59,130,246,0.35)" stroke="rgba(96,165,250,0.9)" />
          <circle cx="396" cy="326" r="6" fill="rgba(59,130,246,0.3)" stroke="rgba(96,165,250,0.75)" />
          <circle cx="708" cy="336" r="6" fill="rgba(59,130,246,0.3)" stroke="rgba(96,165,250,0.75)" />
          <circle cx="648" cy="452" r="7" fill="rgba(59,130,246,0.35)" stroke="rgba(96,165,250,0.9)" />
          <circle cx="680" cy="382" r="5" fill="rgba(59,130,246,0.3)" stroke="rgba(96,165,250,0.75)" />
          <circle cx="570" cy="542" r="4" fill="rgba(59,130,246,0.3)" stroke="rgba(96,165,250,0.75)" />
          <circle cx="900" cy="336" r="4" fill="rgba(59,130,246,0.3)" stroke="rgba(96,165,250,0.75)" />
          <circle cx="208" cy="330" r="4" fill="rgba(59,130,246,0.3)" stroke="rgba(96,165,250,0.75)" />
          <circle cx="312" cy="330" r="4" fill="rgba(59,130,246,0.3)" stroke="rgba(96,165,250,0.75)" />

          <polygon points="579,206 587,214 579,222 571,214" fill="rgba(245,158,11,0.9)" />
          <polygon points="647,448 655,456 647,464 639,456" fill="rgba(245,158,11,0.9)" />
          <polygon points="395,322 403,330 395,338 387,330" fill="rgba(245,158,11,0.9)" />

          <polygon points="462,170 474,176 462,182" fill="rgba(96,165,250,0.85)" />
          <polygon points="548,210 560,216 548,222" fill="rgba(96,165,250,0.85)" />
          <polygon points="506,320 512,332 500,332" fill="rgba(96,165,250,0.85)" />
          <polygon points="305,432 318,438 305,444" fill="rgba(96,165,250,0.85)" />
          <polygon points="742,452 755,458 742,464" fill="rgba(96,165,250,0.85)" />

          <circle cx="110" cy="108" r="4" fill="rgba(250,204,21,0.85)" />
          <circle cx="268" cy="108" r="4" fill="rgba(250,204,21,0.85)" />
          <circle cx="318" cy="82" r="4" fill="rgba(250,204,21,0.82)" />
          <circle cx="506" cy="82" r="4" fill="rgba(250,204,21,0.82)" />
          <circle cx="596" cy="108" r="4" fill="rgba(250,204,21,0.85)" />
          <circle cx="735" cy="108" r="4" fill="rgba(250,204,21,0.85)" />
          <circle cx="776" cy="64" r="4" fill="rgba(250,204,21,0.82)" />
          <circle cx="936" cy="64" r="4" fill="rgba(250,204,21,0.82)" />
          <circle cx="648" cy="382" r="4" fill="rgba(250,204,21,0.85)" />
          <circle cx="928" cy="382" r="4" fill="rgba(250,204,21,0.82)" />

          <rect x="126" y="278" width="2" height="26" fill="rgba(250,204,21,0.72)" />
          <rect x="278" y="278" width="2" height="26" fill="rgba(250,204,21,0.72)" />
          <rect x="446" y="278" width="2" height="26" fill="rgba(250,204,21,0.72)" />
          <rect x="604" y="278" width="2" height="26" fill="rgba(250,204,21,0.72)" />
          <rect x="762" y="278" width="2" height="26" fill="rgba(250,204,21,0.72)" />
          <rect x="902" y="278" width="2" height="26" fill="rgba(250,204,21,0.72)" />

          <path d="M 70 568 L 930 568" stroke="rgba(30,41,59,0.74)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 70 568 L 930 568" stroke="rgba(148,163,184,0.3)" strokeWidth="1" strokeDasharray="9 10" />
          <path d="M 96 378 L 96 536" stroke="rgba(15,23,42,0.64)" strokeWidth="4" strokeLinecap="round" />
          <path d="M 942 378 L 942 536" stroke="rgba(15,23,42,0.64)" strokeWidth="4" strokeLinecap="round" />
          <rect x="726" y="540" width="14" height="22" rx="2" fill="rgba(71,85,105,0.9)" />
          <rect x="746" y="542" width="14" height="20" rx="2" fill="rgba(71,85,105,0.9)" />
          <rect x="766" y="544" width="14" height="18" rx="2" fill="rgba(71,85,105,0.9)" />
        </svg>

        {visiblePipelines.map((path, index) => {
          const isSelected = selected?.kind === 'pipeline' && selected.id === path.id
          const isHovered = hoveredPipeline === path.id
          return (
            <button
              key={path.id}
              type="button"
              onMouseEnter={() => setHoveredPipeline(path.id)}
              onMouseLeave={() => setHoveredPipeline(null)}
              onClick={() => {
                setSelected({ kind: 'pipeline', id: path.id })
                setDrawerTab('Overview')
              }}
              className={cn(
                'absolute overflow-hidden rounded-full border transition-all duration-200',
                isSelected || isHovered
                  ? 'cursor-pointer border-primary/70 bg-primary/20 shadow-[0_0_18px_rgba(59,130,246,0.35)]'
                  : cn(
                    'border-border/70 bg-linear-to-r from-primary/15 via-border/85 to-primary/15',
                    isRiskView && path.status === 'Healthy' && 'opacity-25',
                  ),
              )}
              style={{
                left: path.left,
                top: path.top,
                width: path.width,
                height: path.height ?? '0.85%',
                transform: `rotate(${path.rotate})`,
                transformOrigin: 'left center',
                transitionDelay: `${index * 20}ms`,
              }}
            >
              <span className="absolute inset-y-0 left-[-38%] w-1/3 bg-linear-to-r from-transparent via-primary/80 to-transparent animate-pipeline-flow" />
              <span className="absolute left-1/6 top-1/2 size-1 -translate-y-1/2 rounded-full bg-primary/85 animate-pipeline-flow" style={{ animationDelay: `${index * 0.17}s` }} />
              <span className="absolute left-1/2 top-1/2 size-1 -translate-y-1/2 rounded-full bg-primary/80 animate-pipeline-flow" style={{ animationDelay: `${0.35 + index * 0.13}s` }} />
              <span className="absolute left-5/6 top-1/2 size-1 -translate-y-1/2 rounded-full bg-primary/75 animate-pipeline-flow" style={{ animationDelay: `${0.62 + index * 0.11}s` }} />
              {isHovered ? (
                <span className="pointer-events-none absolute left-1/2 top-[140%] z-40 w-40 -translate-x-1/2 rounded-md border border-border/80 bg-background/95 px-2 py-1 text-left text-[10px] text-muted-foreground shadow-lg">
                  <span className="block font-semibold text-foreground">Pipeline {path.id}</span>
                  <span className="block">Flow {path.flow}%</span>
                  <span className="block">Pressure {path.pressure.toFixed(1)} bar</span>
                  <span className="block">Valve {path.valveState}</span>
                </span>
              ) : null}
            </button>
          )
        })}

        {zones.map((zone) => (
          <div
            key={zone.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              setSelectedZone(zone.id)
              if (viewMode === 'Zone View') {
                focusZone(zone.id)
                setNavFocus(zone.id)
              }
            }}
            className={cn(
              'group absolute z-20 rounded-2xl border shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300 hover:shadow-[0_12px_22px_rgba(0,0,0,0.3)]',
              zone.tone,
              viewMode === 'Sensor View' && 'opacity-15',
              isRiskView && zone.id !== 'ZONE C' && 'opacity-35',
              isZoneView && selectedZone && selectedZone !== zone.id && 'opacity-45',
              isZoneView && selectedZone === zone.id && 'ring-1 ring-primary/70 shadow-[0_0_24px_rgba(59,130,246,0.34)]',
            )}
            style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
          >
            <div className="absolute inset-0 rounded-2xl border border-white/8 opacity-55 animate-pulse" />
            {showLabels && viewMode !== 'Heat Map' && viewMode !== 'Sensor View' ? (
              <div
                className="absolute rounded-md border border-border/80 bg-background/80 px-1 py-0.5 backdrop-blur-sm"
                style={{ left: zone.cardLeft, top: zone.cardTop }}
              >
                <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-foreground">{zone.id}</p>
                <p className="text-[7px] text-muted-foreground">{zone.name}</p>
                <p className="text-[7px] text-foreground">CRI {zone.cri}</p>
                <p className={cn('text-[7px] font-semibold uppercase tracking-[0.1em]', zone.chipTone)}>{zone.risk}</p>
                <p className="text-[7px] text-muted-foreground">{zone.status}</p>
              </div>
            ) : null}
          </div>
        ))}

        {visibleEquipment.map((item) => {
          const isSelected = selectedEquipment?.id === item.id
          const isHovered = hoveredEquipment === item.id
          const status = statusTone[item.status]
          const isHighlighted = searchTerm ? highlightedEquipmentIds.has(item.id) : false

          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => setHoveredEquipment(item.id)}
              onMouseLeave={() => setHoveredEquipment(null)}
              onClick={() => {
                setSelected({ kind: 'equipment', id: item.id })
                setDrawerTab('Overview')
              }}
              className={cn(
                'group absolute rounded-md border bg-background/66 px-1.5 py-1 text-left text-[10px] text-foreground shadow-lg transition-all duration-200',
                'hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-[0_0_24px_rgba(59,130,246,0.32)]',
                status.glow,
                isSelected ? 'z-28 border-primary/80 ring-1 ring-primary/60' : 'z-20 border-border/80',
                isHighlighted && 'border-primary/80 ring-1 ring-primary/55',
                isHovered && 'cursor-pointer',
                isZoneView && selectedZone && selectedZone !== item.zone && 'opacity-35',
                isRiskView && item.status === 'Warning' && 'ring-1 ring-warning/60',
                isRiskView && item.status === 'Critical' && 'ring-1 ring-critical/60',
              )}
              style={{ left: item.left, top: item.top, width: item.w, height: item.h }}
            >
              {showEquipmentLabels ? (
                <div className="pointer-events-none absolute -top-5 z-30 w-max max-w-44" style={{ left: equipmentLabelOffsets[item.id]?.x, top: equipmentLabelOffsets[item.id]?.y }}>
                  <div
                    className={cn(
                      'relative rounded-md border border-border/80 bg-background/88 px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.11em] text-foreground shadow-[0_8px_18px_rgba(0,0,0,0.34)] whitespace-nowrap',
                      equipmentLabelOffsets[item.id]?.anchor === 'center' && '-translate-x-1/2',
                      equipmentLabelOffsets[item.id]?.anchor === 'right' && '-translate-x-full',
                    )}
                  >
                    {item.name}
                    <span className="absolute left-1/2 top-full h-2 w-px -translate-x-1/2 bg-border/70" />
                  </div>
                </div>
              ) : null}

              <div className="flex h-full flex-col justify-between">
                <EquipmentSilhouette type={item.type} status={item.status} />
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.11em] text-foreground/90">{item.id}</span>
                  <span className={cn('rounded-md border px-1 py-0.5 text-[8px] uppercase tracking-[0.11em]', status.badge)}>{item.status}</span>
                </div>
              </div>

              {isHovered ? (
                <div className="pointer-events-none absolute left-0 top-[105%] z-50 w-60 origin-top-left scale-100 rounded-md border border-border/80 bg-background/96 p-2 text-[10px] text-muted-foreground shadow-[0_16px_28px_rgba(0,0,0,0.4)] transition-all duration-200">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-foreground">{item.name}</p>
                    <span className={cn('rounded-md border px-1 py-0.5 text-[9px] uppercase tracking-[0.11em]', status.badge)}>{item.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <span>ID</span><span className="text-right text-foreground">{item.id}</span>
                    <span>Health</span><span className="text-right text-foreground">{item.health}%</span>
                    <span>Risk</span><span className="text-right text-foreground">{item.risk}</span>
                    <span>Temperature</span><span className="text-right text-foreground">{item.temperature} C</span>
                    <span>Pressure</span><span className="text-right text-foreground">{item.pressure.toFixed(1)} bar</span>
                    <span>Flow Rate</span><span className="text-right text-foreground">{item.flow}%</span>
                    <span>Last Maintenance</span><span className="text-right text-foreground">{item.lastMaintenance}</span>
                    <span>Workers Nearby</span><span className="text-right text-foreground">{item.workersNearby}</span>
                    <span>Last Updated</span><span className="text-right text-foreground">{item.lastUpdated}</span>
                  </div>
                </div>
              ) : null}
            </button>
          )
        })}

        {visibleMarkers.map((marker, index) => {
          const { tone, border, Icon } = getMarkerVisual(marker.type)
          const isHovered = hoveredMarker === marker.id
          const isSelected = selected?.id === marker.id
          const showSensorCard = viewMode === 'Sensor View' && marker.type === 'sensor'
          return (
            <div key={marker.id} className="group absolute z-32" style={{ left: marker.left, top: marker.top }}>
              <button
                type="button"
                onMouseEnter={() => setHoveredMarker(marker.id)}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={() => {
                  setSelected({ kind: marker.type, id: marker.id })
                  setDrawerTab('Overview')
                }}
                className={cn(
                  'relative inline-flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background/88 text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-200 hover:scale-110',
                  border,
                  isSelected && 'ring-1 ring-primary/60',
                )}
              >
                <span className={cn('absolute inset-0 rounded-full opacity-65 animate-status-blink', tone)} style={{ animationDelay: `${index * 0.16}s` }} />
                <Icon className="relative z-10 size-2.5" />
              </button>
              {isHovered ? (
                <div className="pointer-events-none absolute left-1/2 top-[125%] z-30 w-40 -translate-x-1/2 rounded-md border border-border/80 bg-background/95 px-2 py-1 text-[10px] text-muted-foreground shadow-lg">
                  {Object.entries(marker.data).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-1">
                      <span className="uppercase tracking-[0.11em]">{key}</span>
                      <span className="text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {showSensorCard ? (
                <div className="pointer-events-none absolute left-[60%] top-[-10%] z-30 w-36 rounded-md border border-border/80 bg-background/90 px-1.5 py-1 text-[9px] text-muted-foreground shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
                  <p className="font-semibold uppercase tracking-[0.11em] text-foreground">{marker.data.id}</p>
                  <p>Type {marker.data.type}</p>
                  <p>Status {marker.data.status}</p>
                  <p>Temp {marker.data.temperature}</p>
                  <p>Pressure {marker.data.pressure}</p>
                  <p>Humidity {marker.data.humidity}</p>
                  <p>Reading {marker.data.reading}</p>
                  <p>Battery {marker.data.battery}</p>
                  <p>Signal {marker.data.signal}</p>
                  <p>Updated {marker.data.updated}</p>
                </div>
              ) : null}
            </div>
          )
        })}

        {layersVisible.assembly && viewMode !== 'Sensor View' ? assemblyPoints.map((point, index) => (
          <span key={`${point.left}-${point.top}`} className="absolute" style={{ left: point.left, top: point.top }}>
            <span className="inline-flex size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-success/70 bg-success/25">
              <span className="m-auto size-1 rounded-full bg-success animate-status-blink" style={{ animationDelay: `${index * 0.28}s` }} />
            </span>
          </span>
        )) : null}

        {viewMode !== 'Sensor View' ? utilityPoints.map((point, index) => {
          if (point.type === 'permit' && !layersVisible.permits) {
            return null
          }

          const isHovered = hoveredUtility === point.id
          const iconTone = point.type === 'permit'
            ? 'border-primary/60 bg-primary/18 text-primary'
            : point.type === 'inspection'
              ? 'border-warning/60 bg-warning/18 text-warning'
              : 'border-critical/65 bg-critical/18 text-critical'

          return (
            <div key={point.id} className="absolute" style={{ left: point.left, top: point.top }}>
              <button
                type="button"
                onMouseEnter={() => setHoveredUtility(point.id)}
                onMouseLeave={() => setHoveredUtility(null)}
                className={cn(
                  'relative inline-flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-200 hover:scale-110',
                  iconTone,
                  isHovered && 'shadow-[0_0_18px_rgba(59,130,246,0.45)]',
                )}
              >
                <span className="absolute inset-0 rounded-full opacity-60 animate-status-blink" style={{ animationDelay: `${index * 0.15}s` }} />
                {point.type === 'permit' ? <Shield className="relative z-10 size-2.5" /> : null}
                {point.type === 'inspection' ? <ScanSearch className="relative z-10 size-2.5" /> : null}
                {point.type === 'emergency' ? <Siren className="relative z-10 size-2.5" /> : null}
              </button>
              {isHovered ? (
                <div className="pointer-events-none absolute left-1/2 top-[130%] z-40 w-44 -translate-x-1/2 rounded-md border border-border/80 bg-background/95 px-2 py-1 text-[10px] text-muted-foreground shadow-lg">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground">{point.label}</p>
                  <p className="text-[10px]">{point.zone}</p>
                  <p className="text-[10px] text-foreground">{point.detail}</p>
                </div>
              ) : null}
            </div>
          )
        }) : null}

        <div className="pointer-events-none absolute left-[62%] top-[20%] h-24 w-24 rounded-full bg-critical/18 blur-2xl" />
        <div className="pointer-events-none absolute left-[22%] top-[52%] h-20 w-20 rounded-full bg-primary/16 blur-2xl" />
        <div className="pointer-events-none absolute bottom-6 left-[44%] h-18 w-64 bg-linear-to-r from-transparent via-slate-300/10 to-transparent blur-sm" />
        <div className="pointer-events-none absolute left-[56%] top-[21%] h-28 w-28 rounded-full bg-critical/14 blur-xl animate-zone-glow" />
        <div className="pointer-events-none absolute inset-x-14 top-20 h-28 rounded-full bg-slate-200/6 blur-3xl" />
        <div className="pointer-events-none absolute left-[58%] top-[26%] h-20 w-24 rounded-full bg-critical/16 blur-2xl animate-heat-shimmer" />
        <div className="pointer-events-none absolute inset-x-8 bottom-3 h-14 bg-linear-to-t from-black/30 to-transparent" />

        {isRiskView ? (
          <div className="pointer-events-none absolute right-3 top-3 z-[8] w-52 rounded-md border border-critical/45 bg-background/82 p-2 text-[10px] text-muted-foreground backdrop-blur-sm">
            <p className="font-semibold uppercase tracking-[0.12em] text-critical">Active Risk Signals</p>
            <div className="mt-1 space-y-1">
              {liveMarkers
                .filter((marker) => marker.type === 'alarm' || marker.status === 'Critical')
                .slice(0, 3)
                .map((marker) => (
                  <p key={marker.id} className="text-[10px] text-foreground">{marker.data.id} • {marker.data.status ?? marker.status}</p>
                ))}
              {activeAlert ? <p className="text-[10px] text-foreground">{activeAlert.id} • {activeAlert.message}</p> : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className={cn('absolute right-3 top-1/2 z-34 -translate-y-1/2 rounded-md border border-border/80 bg-background/72 p-1.5 backdrop-blur-sm', !showChrome && 'hidden')}>
        <div className="flex flex-col gap-1">
          {sideControls.map((item, index) => {
            const Icon = item.icon
            const isActive =
              (item.label === 'Layers' && layersPanelOpen)
              || (item.label === 'Labels' && labelsVisible)
              || (item.label === 'Night Mode' && nightMode)
            return (
              <button
                key={item.label}
                type="button"
                title={item.label}
                onClick={() => onSideControlClick(item.label)}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground',
                  isActive
                    ? 'border-primary/70 bg-primary/15 text-primary'
                    : 'border-border/80 bg-background/75 hover:border-primary/35',
                )}
                style={{ transitionDelay: `${index * 15}ms` }}
              >
                <Icon className="size-3.5" />
              </button>
            )
          })}
        </div>
      </div>

      {showChrome && layersPanelOpen ? (
        <div className="absolute right-14 top-1/2 z-34 w-36 -translate-y-1/2 rounded-md border border-border/80 bg-background/88 p-2 text-[10px] text-muted-foreground shadow-[0_10px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground">Layers</p>
          {([
            ['workers', 'Workers'],
            ['sensors', 'Sensors'],
            ['cameras', 'Cameras'],
            ['permits', 'Permits'],
            ['hydrants', 'Hydrants'],
            ['assembly', 'Assembly'],
          ] as Array<[LayerKey, string]>).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setViewportLayersVisible((prev) => ({ ...prev, [key]: !prev[key] }))}
              className="mb-1 flex w-full items-center justify-between rounded border border-border/70 bg-background/70 px-1.5 py-1 text-left last:mb-0"
            >
              <span>{label}</span>
              <span className={cn('text-[9px] uppercase', layersVisible[key] ? 'text-success' : 'text-muted-foreground')}>{layersVisible[key] ? 'On' : 'Off'}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className={cn('absolute bottom-2 left-2 right-2 z-38 rounded-md border border-border/80 bg-background/70 px-2 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.34)] backdrop-blur-sm', !showChrome && 'hidden')}>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 xl:grid-cols-8">
          {bottomNav.map((item) => {
            const Icon = item.icon
            const active = navFocus === item.label || (item.label.startsWith('Zone') && navFocus === item.label.toUpperCase())

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onBottomNavClick(item.label)}
                className={cn(
                  'inline-flex h-7 items-center justify-center gap-1 rounded-md border px-1 text-[10px] font-medium uppercase tracking-[0.11em] transition-all duration-200',
                  active
                    ? 'border-primary/70 bg-primary/15 text-primary'
                    : 'border-border/80 bg-background/70 text-muted-foreground hover:border-primary/35 hover:text-foreground',
                )}
              >
                <Icon className="size-3" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className={cn('pointer-events-none absolute bottom-12 left-3 z-20 rounded-md border border-border/80 bg-background/75 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm', !showChrome && 'hidden')}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
          <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-success animate-status-blink" /> Plant Health {contextCards.plantHealth}</span>
          <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-warning animate-status-blink" /> Risk {contextCards.riskSummary}</span>
          <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-primary animate-status-blink" /> AI {contextCards.aiInsight}</span>
          <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-critical animate-status-blink" /> Alerts {contextCards.alerts}</span>
        </div>
      </div>

      <div className={cn('pointer-events-none absolute left-3 top-12 z-20 rounded-md border border-border/80 bg-background/75 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm', !showChrome && 'hidden')}>
        <div className="flex items-center gap-1.5">
          <Siren className="size-3 text-critical" />
          {`Interactive Digital Twin • ${viewMode} • Cam ${cameraPreset}`}
        </div>
      </div>

      <span className="pointer-events-none absolute left-[61.9%] top-[31.8%] z-20 inline-flex size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-critical shadow-[0_0_16px_rgba(220,38,38,0.7)] animate-status-blink" />
      <span className="pointer-events-none absolute left-[77%] top-[64.2%] z-20 inline-flex size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning shadow-[0_0_14px_rgba(245,158,11,0.65)] animate-status-blink" />
      <span className="pointer-events-none absolute left-[31.2%] top-[66.4%] z-20 inline-flex size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success shadow-[0_0_14px_rgba(16,185,129,0.65)] animate-status-blink" />

      <span className="pointer-events-none absolute left-[60%] top-[12%] z-10 h-16 w-8 animate-smoke-rise rounded-full bg-slate-200/8 blur-md" />
      <span className="pointer-events-none absolute left-[63%] top-[13%] z-10 h-14 w-7 animate-smoke-rise rounded-full bg-slate-200/8 blur-md" style={{ animationDelay: '0.9s' }} />

      {selected ? (
        <aside className="absolute inset-y-0 right-0 z-50 w-full max-w-90 border-l border-border/80 bg-background/95 p-2.5 shadow-[-18px_0_26px_rgba(0,0,0,0.42)] backdrop-blur-md transition-all duration-300">
          <div className="mb-2 flex items-start justify-between gap-2 border-b border-border/70 pb-2">
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground">
                {selectedEquipment
                  ? selectedEquipment.name
                  : selectedMarker
                    ? `${selectedMarker.type.toUpperCase()} Context`
                    : selectedPipeline
                      ? `Pipeline ${selectedPipeline.id}`
                      : 'Selection'}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {selectedEquipment
                  ? selectedEquipment.id
                  : selectedMarker
                    ? selectedMarker.data.id ?? selectedMarker.id
                    : selectedPipeline
                      ? selectedPipeline.id
                      : 'Overview'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex size-7 items-center justify-center rounded-md border border-border/80 bg-background/70 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {selectedEquipment ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md border border-border/80 bg-background/70 px-2 py-1.5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Status</p>
                  <span className={cn('mt-0.5 inline-flex rounded-md border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.11em]', statusTone[selectedEquipment.status].badge)}>
                    {selectedEquipment.status}
                  </span>
                </div>
                <HealthRing health={selectedEquipment.health} status={selectedEquipment.status} />
              </div>

              <div className="grid grid-cols-4 gap-1">
                {(['Overview', 'Telemetry', 'Maintenance', 'AI Insights'] as DrawerTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDrawerTab(tab)}
                    className={cn(
                      'h-7 rounded-md border text-[10px] font-medium uppercase tracking-[0.11em] transition-colors',
                      drawerTab === tab
                        ? 'border-primary/70 bg-primary/15 text-primary'
                        : 'border-border/80 bg-background/70 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab === 'AI Insights' ? 'AI' : tab}
                  </button>
                ))}
              </div>

              {drawerTab === 'Overview' ? (
                <div className="grid gap-1.5 rounded-md border border-border/70 bg-background/60 p-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><Factory className="size-3" />Type</span><span className="text-foreground">{selectedEquipment.type}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><CalendarDays className="size-3" />Installed</span><span className="text-foreground">{selectedEquipment.installDate}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><Cpu className="size-3" />Manufacturer</span><span className="text-foreground">{selectedEquipment.manufacturer}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><Clock3 className="size-3" />Operating Hours</span><span className="text-foreground">{selectedEquipment.operatingHours}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><MapPinned className="size-3" />Location</span><span className="text-foreground">{selectedEquipment.location}</span></div>
                </div>
              ) : null}

              {drawerTab === 'Telemetry' && telemetry ? (
                <div className="space-y-1.5">
                  <TelemetryBar label="Temperature" value={telemetry.temperature} max={500} unit=" C" tone="bg-warning" />
                  <TelemetryBar label="Pressure" value={telemetry.pressure} max={20} unit=" bar" tone="bg-primary" />
                  <TelemetryBar label="Flow" value={telemetry.flow} max={100} unit="%" tone="bg-success" />
                  <TelemetryBar label="Gas" value={telemetry.gas} max={60} unit=" ppm" tone="bg-critical" />
                  <TelemetryBar label="Humidity" value={telemetry.humidity} max={100} unit="%" tone="bg-primary" />
                  <TelemetryBar label="Power" value={telemetry.power} max={100} unit="%" tone="bg-warning" />
                  <TelemetryBar label="Vibration" value={telemetry.vibration} max={5} unit=" mm/s" tone="bg-danger" />
                </div>
              ) : null}

              {drawerTab === 'Maintenance' ? (
                <div className="grid gap-1.5 rounded-md border border-border/70 bg-background/60 p-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><Wrench className="size-3" />Last Inspection</span><span className="text-foreground">{selectedEquipment.lastMaintenance}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><CalendarDays className="size-3" />Next Inspection</span><span className="text-foreground">{selectedEquipment.nextInspection}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><TriangleAlert className="size-3" />Open Tickets</span><span className="text-foreground">{selectedEquipment.openTickets}</span></div>
                  <div className="rounded-md border border-border/70 bg-background/50 px-2 py-1 text-[10px]">
                    Maintenance History: Routine checks, valve calibration, and actuator verification recorded in the last three cycles.
                  </div>
                </div>
              ) : null}

              {drawerTab === 'AI Insights' ? (
                <div className="grid gap-1.5 rounded-md border border-border/70 bg-background/60 p-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><Gauge className="size-3" />Risk Score</span><span className="text-foreground">{selectedEquipment.risk}</span></div>
                  <div className="flex items-start justify-between gap-2"><span className="inline-flex items-center gap-1"><Activity className="size-3" />Root Cause</span><span className="text-right text-foreground">{selectedEquipment.rootCause}</span></div>
                  <div className="rounded-md border border-border/70 bg-background/50 px-2 py-1 text-[10px]">
                    Recommendation: {selectedEquipment.recommendation}
                  </div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><TrendingUp className="size-3" />Confidence</span><span className="text-foreground">{selectedEquipment.confidence}</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><HeartPulse className="size-3" />Failure Window</span><span className="text-foreground">{selectedEquipment.failureWindow}</span></div>
                </div>
              ) : null}
            </div>
          ) : null}

          {selectedMarker ? (
            <div className="space-y-2">
              <div className="rounded-md border border-border/70 bg-background/65 p-2 text-[11px] text-muted-foreground">
                <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-foreground">Marker Details</p>
                {Object.entries(selectedMarker.data).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="uppercase tracking-[0.11em]">{key}</span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
              {selectedMarker.type === 'camera' ? (
                <div className="rounded-md border border-border/70 bg-background/65 p-2 text-[10px] text-muted-foreground">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-foreground">Camera Preview</p>
                  <div className="flex h-28 items-center justify-center rounded-md border border-border/70 bg-background/60 text-center text-[11px] text-foreground">
                    Future video integration placeholder
                  </div>
                </div>
              ) : null}
              {selectedMarker.type === 'worker' ? (
                <div className="rounded-md border border-border/70 bg-background/65 p-2 text-[10px] text-muted-foreground">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.12em] text-foreground">Worker Profile</p>
                  <p className="text-[11px] text-foreground">Assigned to safety-checked task with live PPE compliance monitoring.</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {selectedPipeline ? (
            <div className="space-y-2 rounded-md border border-border/70 bg-background/65 p-2 text-[11px] text-muted-foreground">
              <p className="text-[10px] uppercase tracking-[0.12em] text-foreground">Pipeline Intelligence</p>
              <div className="flex items-center justify-between"><span>Flow</span><span className="text-foreground">{selectedPipeline.flow}%</span></div>
              <div className="flex items-center justify-between"><span>Pressure</span><span className="text-foreground">{selectedPipeline.pressure.toFixed(1)} bar</span></div>
              <div className="flex items-center justify-between"><span>Valve State</span><span className="text-foreground">{selectedPipeline.valveState}</span></div>
              <div className="flex items-center justify-between"><span>Status</span><span className={cn('rounded-md border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.11em]', statusTone[selectedPipeline.status].badge)}>{selectedPipeline.status}</span></div>
            </div>
          ) : null}
        </aside>
      ) : null}

      <div className="pointer-events-none absolute bottom-1 left-2 z-20 rounded-md border border-border/80 bg-background/75 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        Shortcuts: F = Fit View, ESC = Clear Selection, CTRL + F = Focus Search
      </div>

      {searchTerm && highlightedEquipmentIds.size === 0 ? (
        <div className="pointer-events-none absolute left-1/2 top-24 z-40 -translate-x-1/2 rounded-md border border-warning/40 bg-warning/10 px-2 py-1 text-[10px] text-warning">
          No equipment matches "{search}"
        </div>
      ) : null}
    </div>
  )
}

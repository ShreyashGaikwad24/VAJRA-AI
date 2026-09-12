import { Timeline } from '@/components/layout/Timeline'

const timelineEvents = ['08:00', '08:15', '08:30', '08:45', '09:00']

export function BottomTimeline() {
  return <Timeline timestamps={timelineEvents} className="h-22" />
}

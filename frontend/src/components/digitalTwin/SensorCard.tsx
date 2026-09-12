import { Card } from '@/components/cards/Card'
import { StatusBadge } from '@/components/common/StatusBadge'

type SensorCardProps = {
  name: string
  value: string
  status?: 'stable' | 'active' | 'offline'
}

export function SensorCard({ name, value, status = 'active' }: SensorCardProps) {
  return (
    <Card title={name}>
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold text-foreground">{value}</p>
        <StatusBadge label={status} variant={status} />
      </div>
    </Card>
  )
}

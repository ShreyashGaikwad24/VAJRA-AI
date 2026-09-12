import { Card } from '@/components/cards/Card'

type ChartCardProps = {
  title: string
  description?: string
}

export function ChartCard({ title, description }: ChartCardProps) {
  return (
    <Card title={title} subtitle={description}>
      <div className="h-40 rounded-lg border border-dashed border-border/70 bg-background/50" />
    </Card>
  )
}

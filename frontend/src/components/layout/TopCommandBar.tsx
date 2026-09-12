import { TopHeader } from '@/components/layout/TopHeader'

export function TopCommandBar({ activeModule }: { activeModule: string }) {
  return <TopHeader activeModule={activeModule} />
}

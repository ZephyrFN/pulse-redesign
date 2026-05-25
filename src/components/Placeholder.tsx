import { Card, CardBody } from '../components/ui/Card'
import type { LucideIcon } from 'lucide-react'

interface PlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  phase: string
}

export function Placeholder({ title, description, icon: Icon, phase }: PlaceholderProps) {
  return (
    <Card className="text-center">
      <CardBody className="py-16">
        <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-bg-elevated ring-1 ring-line-strong mb-4">
          <Icon className="w-6 h-6 text-signal-400" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">{title}</h2>
        <p className="text-sm text-text-muted max-w-md mx-auto">{description}</p>
        <div className="mt-4 inline-block text-[10px] uppercase tracking-widest text-text-muted px-2 py-1 rounded bg-bg-elevated ring-1 ring-line">
          {phase}
        </div>
      </CardBody>
    </Card>
  )
}

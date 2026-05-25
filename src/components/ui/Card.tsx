import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: 'bull' | 'bear' | 'signal' | 'none'
  elevated?: boolean
  as?: 'div' | 'article' | 'section'
  onClick?: () => void
}

export function Card({ children, className, glow = 'none', elevated = false, as: Tag = 'div', onClick }: CardProps) {
  return (
    <Tag
      onClick={onClick}
      className={clsx(
        'rounded-xl',
        elevated ? 'glass-elevated' : 'glass',
        glow === 'bull' && 'shadow-glow-bull',
        glow === 'bear' && 'shadow-glow-bear',
        glow === 'signal' && 'shadow-glow-signal',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

interface CardHeaderProps {
  title?: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, icon, action, className }: CardHeaderProps) {
  return (
    <div className={clsx('flex items-start justify-between gap-3 p-4 border-b border-line', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && <div className="shrink-0 mt-0.5 text-text-secondary">{icon}</div>}
        <div className="min-w-0">
          {title && <div className="font-semibold text-text-primary truncate">{title}</div>}
          {subtitle && <div className="text-xs text-text-muted mt-0.5">{subtitle}</div>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('p-4', className)}>{children}</div>
}

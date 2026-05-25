import clsx from 'clsx'
import type { ReactNode } from 'react'

interface FilterChipProps {
  active?: boolean
  onClick?: () => void
  children: ReactNode
  count?: number
  icon?: ReactNode
  tone?: 'default' | 'bull' | 'bear' | 'warn' | 'signal'
}

const TONES = {
  default: 'data-[active=true]:bg-bg-elevated data-[active=true]:ring-line-strong data-[active=true]:text-text-primary',
  bull: 'data-[active=true]:bg-bull-950 data-[active=true]:ring-bull-500/30 data-[active=true]:text-bull-400',
  bear: 'data-[active=true]:bg-bear-950 data-[active=true]:ring-bear-500/30 data-[active=true]:text-bear-400',
  warn: 'data-[active=true]:bg-warn-950 data-[active=true]:ring-warn-500/30 data-[active=true]:text-warn-400',
  signal: 'data-[active=true]:bg-signal-950 data-[active=true]:ring-signal-500/30 data-[active=true]:text-signal-400',
}

export function FilterChip({ active = false, onClick, children, count, icon, tone = 'default' }: FilterChipProps) {
  return (
    <button
      type="button"
      data-active={active}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium ring-1 ring-inset ring-line transition-colors',
        'text-text-muted hover:text-text-secondary hover:bg-bg-overlay/40',
        TONES[tone],
      )}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span className="text-[10px] px-1.5 h-4 inline-flex items-center justify-center rounded-full bg-bg-base/50 text-text-muted ring-1 ring-line">
          {count}
        </span>
      )}
    </button>
  )
}

import clsx from 'clsx'
import type { ReactNode } from 'react'

interface StatProps {
  label: ReactNode
  value: ReactNode
  delta?: ReactNode
  hint?: ReactNode
  tone?: 'bull' | 'bear' | 'neutral' | 'signal'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const TONE_VALUE = {
  bull: 'text-bull-400',
  bear: 'text-bear-400',
  signal: 'text-signal-400',
  neutral: 'text-text-primary',
}

const SIZES = {
  sm: { value: 'text-lg', label: 'text-[11px]' },
  md: { value: 'text-2xl', label: 'text-xs' },
  lg: { value: 'text-3xl', label: 'text-xs' },
}

export function Stat({ label, value, delta, hint, tone = 'neutral', className, size = 'md' }: StatProps) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className={clsx('uppercase tracking-wider text-text-muted font-medium', SIZES[size].label)}>{label}</div>
      <div className={clsx('font-bold num leading-none', SIZES[size].value, TONE_VALUE[tone])}>{value}</div>
      {(delta || hint) && (
        <div className="flex items-center gap-2 text-xs">
          {delta}
          {hint && <span className="text-text-muted">{hint}</span>}
        </div>
      )}
    </div>
  )
}

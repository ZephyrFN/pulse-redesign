import clsx from 'clsx'
import type { ReactNode } from 'react'

export type BadgeTone = 'bull' | 'bear' | 'warn' | 'signal' | 'info' | 'accent' | 'neutral'

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  size?: 'xs' | 'sm' | 'md'
  variant?: 'soft' | 'solid' | 'outline' | 'dot'
  icon?: ReactNode
  className?: string
}

const TONES: Record<BadgeTone, { soft: string; solid: string; outline: string; dot: string }> = {
  bull: {
    soft: 'bg-bull-950 text-bull-400 ring-1 ring-inset ring-bull-500/20',
    solid: 'bg-bull-500 text-white',
    outline: 'text-bull-400 ring-1 ring-bull-500/30',
    dot: 'bg-bull-500',
  },
  bear: {
    soft: 'bg-bear-950 text-bear-400 ring-1 ring-inset ring-bear-500/20',
    solid: 'bg-bear-500 text-white',
    outline: 'text-bear-400 ring-1 ring-bear-500/30',
    dot: 'bg-bear-500',
  },
  warn: {
    soft: 'bg-warn-950 text-warn-400 ring-1 ring-inset ring-warn-500/20',
    solid: 'bg-warn-500 text-bg-base',
    outline: 'text-warn-400 ring-1 ring-warn-500/30',
    dot: 'bg-warn-500',
  },
  signal: {
    soft: 'bg-signal-950 text-signal-400 ring-1 ring-inset ring-signal-500/20',
    solid: 'bg-signal-500 text-white',
    outline: 'text-signal-400 ring-1 ring-signal-500/30',
    dot: 'bg-signal-500',
  },
  info: {
    soft: 'bg-info-950 text-info-400 ring-1 ring-inset ring-info-500/20',
    solid: 'bg-info-500 text-white',
    outline: 'text-info-400 ring-1 ring-info-500/30',
    dot: 'bg-info-500',
  },
  accent: {
    soft: 'bg-accent-950 text-accent-400 ring-1 ring-inset ring-accent-500/20',
    solid: 'bg-accent-500 text-bg-base',
    outline: 'text-accent-400 ring-1 ring-accent-500/30',
    dot: 'bg-accent-500',
  },
  neutral: {
    soft: 'bg-bg-overlay text-text-secondary ring-1 ring-inset ring-line-strong',
    solid: 'bg-text-secondary text-bg-base',
    outline: 'text-text-secondary ring-1 ring-line-strong',
    dot: 'bg-text-muted',
  },
}

const SIZES = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
}

export function Badge({ children, tone = 'neutral', size = 'sm', variant = 'soft', icon, className }: BadgeProps) {
  if (variant === 'dot') {
    return (
      <span className={clsx('inline-flex items-center gap-1.5', SIZES[size], className)}>
        <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse-soft', TONES[tone].dot)} />
        <span className="text-text-secondary">{children}</span>
      </span>
    )
  }
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md font-medium tracking-wide',
        SIZES[size],
        TONES[tone][variant],
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

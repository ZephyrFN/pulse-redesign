import clsx from 'clsx'

interface RangeBarProps {
  low: number
  high: number
  current: number
  className?: string
  showLabels?: boolean
  tone?: 'accent' | 'bull' | 'bear' | 'warn'
}

const TONES = {
  accent: 'bg-accent-400',
  bull: 'bg-bull-500',
  bear: 'bg-bear-500',
  warn: 'bg-warn-500',
}

/**
 * 24h range bar: cyan-filled progress showing where current price sits in the day's range.
 * The fill grows from low → current; the rest is dim track.
 */
export function RangeBar({ low, high, current, className, showLabels = false, tone = 'accent' }: RangeBarProps) {
  const pos = high === low ? 50 : Math.max(0, Math.min(100, ((current - low) / (high - low)) * 100))

  return (
    <div className={clsx('flex items-center gap-2 min-w-0', className)}>
      {showLabels && <span className="text-[10px] text-text-muted shrink-0 num">{low.toFixed(2)}</span>}
      <div className="flex-1 h-1.5 rounded-full bg-line-strong relative overflow-hidden">
        <div
          className={clsx('absolute inset-y-0 left-0 rounded-full', TONES[tone])}
          style={{ width: `${pos}%` }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-text-primary ring-2 ring-bg-base shadow"
          style={{ left: `calc(${pos}% - 5px)` }}
          aria-hidden
        />
      </div>
      {showLabels && <span className="text-[10px] text-text-muted shrink-0 num">{high.toFixed(2)}</span>}
    </div>
  )
}

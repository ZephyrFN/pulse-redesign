import clsx from 'clsx'

interface RangeBarProps {
  low: number
  high: number
  current: number
  className?: string
  showLabels?: boolean
}

/**
 * 24h range bar: shows where current price sits between low and high.
 * Visually similar to "fear & greed" sliders.
 */
export function RangeBar({ low, high, current, className, showLabels = false }: RangeBarProps) {
  const pos = high === low ? 50 : Math.max(0, Math.min(100, ((current - low) / (high - low)) * 100))

  return (
    <div className={clsx('flex items-center gap-2 min-w-0', className)}>
      {showLabels && <span className="text-[10px] text-text-muted shrink-0 num">{low.toFixed(2)}</span>}
      <div className="flex-1 h-1 rounded-full bg-line-strong relative">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-text-primary ring-2 ring-bg-base"
          style={{ left: `calc(${pos}% - 4px)` }}
          aria-hidden
        />
      </div>
      {showLabels && <span className="text-[10px] text-text-muted shrink-0 num">{high.toFixed(2)}</span>}
    </div>
  )
}

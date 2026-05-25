import clsx from 'clsx'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  tone?: 'bull' | 'bear' | 'auto' | 'neutral'
  className?: string
  showFill?: boolean
}

const COLORS: Record<string, { stroke: string; fill: string }> = {
  bull: { stroke: '#10b981', fill: 'rgba(16,185,129,0.15)' },
  bear: { stroke: '#f43f5e', fill: 'rgba(244,63,94,0.15)' },
  neutral: { stroke: '#94a3b8', fill: 'rgba(148,163,184,0.10)' },
}

export function Sparkline({ data, width = 80, height = 28, tone = 'auto', className, showFill = true }: SparklineProps) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const stepX = width / (data.length - 1)
  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * height
    return [x, y] as const
  })

  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${path} L${width},${height} L0,${height} Z`

  let resolvedTone: 'bull' | 'bear' | 'neutral' = 'neutral'
  if (tone === 'auto') {
    resolvedTone = data[data.length - 1] > data[0] ? 'bull' : data[data.length - 1] < data[0] ? 'bear' : 'neutral'
  } else if (tone !== 'auto') {
    resolvedTone = tone
  }

  const { stroke, fill } = COLORS[resolvedTone]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={clsx('overflow-visible', className)}
      role="img"
      aria-label="Sparkline chart"
    >
      {showFill && <path d={area} fill={fill} />}
      <path d={path} stroke={stroke} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

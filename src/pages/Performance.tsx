import { useMemo, useState } from 'react'
import {
  BarChart3, Trophy, AlertTriangle, ArrowUp, ArrowDown, Info, RefreshCw,
} from 'lucide-react'
import clsx from 'clsx'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FilterChip } from '../components/ui/FilterChip'
import { Stat } from '../components/ui/Stat'
import { PERF_STATS, confidenceTier, getSignalLabel } from '../data/mock'
import type { PerfStat } from '../data/mock'

type Horizon = '24h' | '7d' | '30d'

export function Performance() {
  const [horizon, setHorizon] = useState<Horizon>('30d')

  const view = useMemo(() => PERF_STATS.filter(s => s.horizon === horizon), [horizon])

  // best & worst by avgPnl
  const sorted = useMemo(() => [...view].sort((a, b) => b.avgPnl - a.avgPnl), [view])
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]

  // long vs short aggregates
  const longStats = view.filter(s => s.direction === 'long')
  const shortStats = view.filter(s => s.direction === 'short')

  const avgLong = aggregate(longStats)
  const avgShort = aggregate(shortStats)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-info-400" />
            Performance
          </h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl">
            Win-rate per signal type per horizon. Backfill data 30 hari historis—pakai untuk validasi
            sebelum eksekusi modal real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted">Horizon:</span>
          {(['24h', '7d', '30d'] as Horizon[]).map(h => (
            <FilterChip key={h} active={horizon === h} onClick={() => setHorizon(h)} tone="signal">
              {h}
            </FilterChip>
          ))}
          <Button variant="soft" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}>Backfill 30d</Button>
        </div>
      </header>

      {/* Best/Worst hero cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HeroCard kind="best" stat={best} />
        <HeroCard kind="worst" stat={worst} />
      </div>

      {/* Long vs Short comparison */}
      <Card>
        <CardHeader
          title="Long vs Short"
          subtitle={`Bias arah pada horizon ${horizon}`}
          icon={<ArrowUp className="w-4 h-4" />}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DirectionCard label="LONG" tone="bull" data={avgLong} icon={<ArrowUp className="w-4 h-4" />} />
            <DirectionCard label="SHORT" tone="bear" data={avgShort} icon={<ArrowDown className="w-4 h-4" />} />
          </div>
          <p className="text-xs text-text-muted mt-4 leading-relaxed">
            <Info className="w-3 h-3 inline mr-1" />
            Konteks bull market 30 hari terakhir — signal short konsisten gagal karena harga terus naik.
            Coba ulang di market sideways/bear untuk lihat behavior berbeda.
          </p>
        </CardBody>
      </Card>

      {/* Heatmap */}
      <Card>
        <CardHeader title="Performance heatmap" subtitle="Win-rate per rule × horizon. Hijau = win, merah = loss." />
        <CardBody>
          <Heatmap />
        </CardBody>
      </Card>

      {/* Detail table */}
      <Card>
        <CardHeader title="All signals · detail" subtitle={`Horizon ${horizon} — ${view.length} rule × confidence`} />
        <div className="overflow-x-auto pulse-scroll">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-text-secondary border-b-2 border-line-strong bg-bg-elevated/40">
                <th className="px-4 py-3.5 font-bold">Rule</th>
                <th className="px-4 py-3.5 font-bold">Direction</th>
                <th className="px-4 py-3.5 font-bold text-right">Win rate</th>
                <th className="px-4 py-3.5 font-bold text-right">Avg PnL</th>
                <th className="px-4 py-3.5 font-bold text-right">Sample</th>
                <th className="px-4 py-3.5 font-bold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => {
                const conf = confidenceTier(s.nSamples)
                const isLowConf = conf.tier === 'low'
                return (
                  <tr
                    key={`${s.ruleType}-${s.horizon}`}
                    className={clsx(
                      'border-b border-line hover-surface transition-colors',
                      isLowConf && 'opacity-50 grayscale',
                    )}
                    title={isLowConf ? `Low sample size (n=${s.nSamples}) — interpretasi dengan hati-hati` : undefined}
                  >
                    <td className="px-4 py-3 font-medium text-text-primary">{getSignalLabel(s.ruleType)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={s.direction === 'long' ? 'bull' : s.direction === 'short' ? 'bear' : 'neutral'} size="xs">
                        {s.direction.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={clsx(
                        'num font-bold',
                        s.winRate >= 60 ? 'text-bull-400' : s.winRate >= 45 ? 'text-text-secondary' : 'text-bear-400',
                      )}>
                        {s.winRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={clsx(
                        'num font-bold',
                        s.avgPnl > 0 ? 'text-bull-400' : s.avgPnl < 0 ? 'text-bear-400' : 'text-text-secondary',
                      )}>
                        {s.avgPnl > 0 ? '+' : ''}{s.avgPnl.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="num text-text-secondary">n={s.nSamples}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={conf.tone} size="xs" icon={isLowConf ? <AlertTriangle className="w-2.5 h-2.5" /> : undefined}>{conf.label}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function aggregate(stats: PerfStat[]) {
  if (stats.length === 0) return { avgWinRate: 0, avgPnl: 0, totalSamples: 0 }
  const totalSamples = stats.reduce((s, x) => s + x.nSamples, 0)
  const avgWinRate = stats.reduce((s, x) => s + x.winRate * x.nSamples, 0) / Math.max(1, totalSamples)
  const avgPnl = stats.reduce((s, x) => s + x.avgPnl * x.nSamples, 0) / Math.max(1, totalSamples)
  return { avgWinRate, avgPnl, totalSamples }
}

// ============================================================
// Hero best / worst cards
// ============================================================
function HeroCard({ kind, stat }: { kind: 'best' | 'worst'; stat: PerfStat }) {
  const tone = kind === 'best' ? 'bull' : 'bear'
  const conf = confidenceTier(stat.nSamples)
  return (
    <Card glow={tone}>
      <CardBody className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={clsx(
              'inline-flex w-9 h-9 rounded-xl items-center justify-center ring-1 ring-inset',
              kind === 'best' ? 'bg-bull-950 ring-bull-500/30 text-bull-400' : 'bg-bear-950 ring-bear-500/30 text-bear-400',
            )}>
              {kind === 'best' ? <Trophy className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">
                {kind === 'best' ? 'Best signal' : 'Worst signal'}
              </div>
              <div className="text-sm text-text-muted">Horizon {stat.horizon}</div>
            </div>
          </div>
          <Badge tone={conf.tone} size="xs">{conf.label}</Badge>
        </div>

        <div>
          <h3 className="text-xl font-bold text-text-primary mb-0.5">{getSignalLabel(stat.ruleType)}</h3>
          <Badge tone={stat.direction === 'long' ? 'bull' : 'bear'} size="xs">{stat.direction.toUpperCase()}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-line">
          <Stat
            size="md"
            label="Win rate"
            value={`${stat.winRate.toFixed(0)}%`}
            tone={tone}
          />
          <Stat
            size="md"
            label="Avg PnL"
            value={`${stat.avgPnl > 0 ? '+' : ''}${stat.avgPnl.toFixed(2)}%`}
            tone={tone}
          />
          <Stat
            size="md"
            label="Sample"
            value={`n=${stat.nSamples}`}
            tone="neutral"
          />
        </div>
      </CardBody>
    </Card>
  )
}

// ============================================================
// Direction card (long vs short summary)
// ============================================================
function DirectionCard({ label, tone, data, icon }: {
  label: string
  tone: 'bull' | 'bear'
  data: { avgWinRate: number; avgPnl: number; totalSamples: number }
  icon: React.ReactNode
}) {
  return (
    <div className={clsx(
      'rounded-xl p-5 ring-1 ring-inset',
      tone === 'bull' ? 'bg-bull-950 ring-bull-500/20' : 'bg-bear-950 ring-bear-500/20',
    )}>
      <div className="flex items-center gap-2 mb-3">
        <span className={clsx(
          'inline-flex w-7 h-7 rounded-lg items-center justify-center',
          tone === 'bull' ? 'bg-bull-500/20 text-bull-400' : 'bg-bear-500/20 text-bear-400',
        )}>
          {icon}
        </span>
        <span className={clsx(
          'text-sm font-bold',
          tone === 'bull' ? 'text-bull-400' : 'text-bear-400',
        )}>{label}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">Avg Win</div>
          <div className={clsx('num text-2xl font-bold', tone === 'bull' ? 'text-bull-400' : 'text-bear-400')}>
            {data.avgWinRate.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">Avg PnL</div>
          <div className={clsx('num text-2xl font-bold', data.avgPnl > 0 ? 'text-bull-400' : 'text-bear-400')}>
            {data.avgPnl > 0 ? '+' : ''}{data.avgPnl.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">Samples</div>
          <div className="num text-2xl font-bold text-text-primary">{data.totalSamples}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Heatmap: rule rows × horizon cols
// ============================================================
function Heatmap() {
  const rules = [...new Set(PERF_STATS.map(s => s.ruleType))]
  const horizons: Horizon[] = ['24h', '7d', '30d']

  function getStat(rule: string, h: Horizon): PerfStat | undefined {
    return PERF_STATS.find(s => s.ruleType === rule && s.horizon === h)
  }

  function bgFromPnl(pnl: number): string {
    // Map -20% .. +20% → bear..bull saturation
    const clamped = Math.max(-20, Math.min(20, pnl))
    const intensity = Math.abs(clamped) / 20
    if (clamped > 0) return `rgba(16, 185, 129, ${0.1 + intensity * 0.6})`
    if (clamped < 0) return `rgba(244, 63, 94, ${0.1 + intensity * 0.6})`
    return 'rgba(148, 163, 184, 0.1)'
  }

  return (
    <div className="overflow-x-auto pulse-scroll">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-widest text-text-muted">
            <th className="px-4 py-2 font-semibold w-[35%]">Rule</th>
            {horizons.map(h => (
              <th key={h} className="px-4 py-2 font-semibold text-center">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rules.map(rule => (
            <tr key={rule}>
              <td className="px-4 py-2 font-medium text-text-secondary">{getSignalLabel(rule as never)}</td>
              {horizons.map(h => {
                const s = getStat(rule, h)
                if (!s) return <td key={h} className="px-4 py-2"><div className="h-12 rounded-lg bg-bg-elevated/40" /></td>
                return (
                  <td key={h} className="px-1.5 py-1.5">
                    <div
                      className="rounded-lg p-2.5 ring-1 ring-line text-center"
                      style={{ background: bgFromPnl(s.avgPnl) }}
                      title={`Win ${s.winRate.toFixed(0)}% · Avg PnL ${s.avgPnl.toFixed(2)}% · n=${s.nSamples}`}
                    >
                      <div className={clsx(
                        'text-xs font-bold num',
                        s.avgPnl > 0 ? 'text-bull-400' : 'text-bear-400',
                      )}>
                        {s.avgPnl > 0 ? '+' : ''}{s.avgPnl.toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-text-muted num mt-0.5">
                        {s.winRate.toFixed(0)}% · n={s.nSamples}
                      </div>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

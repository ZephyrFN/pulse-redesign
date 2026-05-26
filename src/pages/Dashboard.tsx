import { Link } from 'react-router-dom'
import { Bell, FlaskConical, Flame, TrendingDown, Zap, BarChart3, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { TopMovers } from '../components/dashboard/TopMovers'
import { Card, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ALERTS, BACKTEST_RUNS, COINS, MARKET_STATS, getSignalLabel } from '../data/mock'
import { fmtPct, fmtPrice, timeAgo } from '../lib/format'
import { Sparkline } from '../components/ui/Sparkline'

interface KpiCardProps {
  label: string
  icon: LucideIcon
  iconTone: 'bull' | 'bear' | 'warn' | 'signal'
  to?: string
  value: React.ReactNode
  caption: string
  valueTone?: 'bull' | 'bear' | 'primary'
}

const ICON_TONE: Record<string, string> = {
  bull: 'text-bull-400 bg-bull-950 ring-bull-500/30',
  bear: 'text-bear-400 bg-bear-950 ring-bear-500/30',
  warn: 'text-warn-400 bg-warn-950 ring-warn-500/30',
  signal: 'text-signal-400 bg-signal-950 ring-signal-500/30',
}

function KpiCard({ label, icon: Icon, iconTone, to, value, caption, valueTone = 'primary' }: KpiCardProps) {
  const inner = (
    <Card className="h-full transition-all duration-200 hover:border-line-strong hover:-translate-y-0.5">
      <CardBody className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className={clsx('inline-flex w-10 h-10 rounded-xl items-center justify-center ring-1 ring-inset shrink-0', ICON_TONE[iconTone])}>
            <Icon className="w-5 h-5" />
          </span>
          <div className="text-[11px] uppercase tracking-widest text-text-muted font-semibold leading-tight pt-1">
            {label}
          </div>
        </div>
        <div className={clsx(
          'font-bold text-2xl leading-none num',
          valueTone === 'bull' && 'text-bull-400',
          valueTone === 'bear' && 'text-bear-400',
          valueTone === 'primary' && 'text-text-primary',
        )}>
          {value}
        </div>
        <div className="text-xs text-text-secondary leading-snug">{caption}</div>
      </CardBody>
    </Card>
  )
  return to ? <Link to={to} className="group block">{inner}</Link> : inner
}

function WatchlistSidebar() {
  const pinned = COINS.filter(c => c.pinned).slice(0, 5)
  if (pinned.length === 0) {
    return (
      <Card>
        <CardBody className="p-5 text-center space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">Watchlist</div>
          <p className="text-sm text-text-muted">Belum ada coin yang dipin. Klik bintang di tabel Top Movers untuk mulai tracking.</p>
          <Link to="/watchlist" className="text-xs text-accent-400 hover:text-accent-500 inline-flex items-center gap-1">
            Buka watchlist <ArrowRight className="w-3 h-3" />
          </Link>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Watchlist</h2>
            <p className="text-[11px] text-text-muted mt-0.5">Ringkasan teknikal cepat</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-signal-950 text-signal-400 ring-1 ring-signal-500/30 font-semibold">
            {pinned.length} pinned
          </span>
        </div>

        <div className="space-y-3">
          {pinned.map(coin => {
            const score = Math.min(100, Math.max(0, Math.round(50 + coin.change24h * 2 + coin.volumeChange * 0.3)))
            const scoreTone = score >= 65 ? 'bull' : score >= 45 ? 'warn' : 'bear'
            const technicalNote = coin.activeSignals.length > 0
              ? coin.activeSignals[0].replace(/_/g, ' ').toLowerCase()
              : Math.abs(coin.change24h) < 1 ? 'sideways' : coin.change24h > 0 ? 'momentum naik' : 'momentum turun'

            return (
              <Link
                key={coin.symbol}
                to={`/coin/${coin.symbol}`}
                className="block p-3 -mx-1 rounded-lg hover:bg-bg-overlay/40 transition-colors group"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="font-bold text-text-primary text-sm group-hover:text-accent-400 transition-colors">
                    {coin.base}<span className="text-text-dim text-[10px] ml-0.5">/USDT</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="num text-xs text-text-secondary">${fmtPrice(coin.price)}</span>
                    <span className={clsx(
                      'num text-xs font-semibold',
                      coin.change24h > 0 ? 'text-bull-400' : coin.change24h < 0 ? 'text-bear-400' : 'text-text-muted',
                    )}>
                      {fmtPct(coin.change24h)}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-text-muted mb-2 capitalize">{technicalNote}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-line-strong overflow-hidden">
                    <div
                      className={clsx(
                        'h-full rounded-full',
                        scoreTone === 'bull' && 'bg-bull-500',
                        scoreTone === 'warn' && 'bg-warn-500',
                        scoreTone === 'bear' && 'bg-bear-500',
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-text-muted shrink-0 num">
                    Score <span className="text-text-secondary font-semibold">{score}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <Link
          to="/watchlist"
          className="flex items-center justify-center gap-1 text-xs text-accent-400 hover:text-accent-500 pt-2 border-t border-line"
        >
          Lihat semua watchlist <ArrowRight className="w-3 h-3" />
        </Link>
      </CardBody>
    </Card>
  )
}

export function Dashboard() {
  const sorted = [...COINS]
  const hotMover = sorted.sort((a, b) => b.change24h - a.change24h)[0]
  const riskWatch = sorted.sort((a, b) => a.change24h - b.change24h)[0]
  const highestPremium = sorted
    .filter(c => c.premiumPct !== null)
    .sort((a, b) => (b.premiumPct ?? 0) - (a.premiumPct ?? 0))[0]
  const bestSignal = [...BACKTEST_RUNS].sort((a, b) => b.sharpe - a.sharpe)[0]
  const liveAlerts = ALERTS.filter(a => a.status === 'live' || a.status === 'triggered').length

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-bull-950 ring-1 ring-bull-500/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bull-500/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-bull-500" />
            </span>
            <span className="text-[11px] text-bull-400 font-semibold">
              Live market · refresh {timeAgo(MARKET_STATS.lastRefresh)}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight tracking-tight">
            Pulse Market Command Center
          </h1>
          <p className="text-sm text-text-secondary max-w-2xl">
            Monitoring top movers, premium Indodax, alert teknikal, dan performa sinyal dalam satu dashboard yang cepat dibaca.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/alerts">
            <Button variant="accent" size="md" icon={<Bell className="w-4 h-4" />}>
              Create Alert
            </Button>
          </Link>
          <Link to="/backtest">
            <Button variant="soft" size="md" icon={<FlaskConical className="w-4 h-4" />}>
              Run Backtest
            </Button>
          </Link>
        </div>
      </header>

      {/* KPI strip — 4 cards */}
      <section aria-label="Market KPI" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Hot Mover"
          icon={Flame}
          iconTone="bull"
          to={`/coin/${hotMover.symbol}`}
          value={<>{hotMover.base} <span className="text-bull-400">{fmtPct(hotMover.change24h)}</span></>}
          caption="Volume kuat, range tinggi"
        />
        <KpiCard
          label="Risk Watch"
          icon={TrendingDown}
          iconTone="bear"
          to={`/coin/${riskWatch.symbol}`}
          value={<>{riskWatch.base} <span className="text-bear-400">{fmtPct(riskWatch.change24h)}</span></>}
          caption="Dump tajam dalam 24h"
        />
        <KpiCard
          label="Premium Tertinggi"
          icon={Zap}
          iconTone="warn"
          to={highestPremium ? `/coin/${highestPremium.symbol}` : undefined}
          value={highestPremium
            ? <>{highestPremium.base} <span className="text-warn-400">+{highestPremium.premiumPct?.toFixed(2)}%</span></>
            : '—'}
          caption="Indodax gap aktif"
        />
        <KpiCard
          label="Best Signal 30d"
          icon={BarChart3}
          iconTone="signal"
          to="/performance"
          value={<>{bestSignal.strategyName.length > 16 ? bestSignal.strategyName.slice(0, 16) + '…' : bestSignal.strategyName}</>}
          caption={`${bestSignal.winRate.toFixed(0)}% win rate · n=${bestSignal.nTrades}`}
        />
      </section>

      {/* Main grid: Top Movers (2/3) + Watchlist (1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
        <div className="xl:col-span-2 min-w-0">
          <TopMovers />
        </div>
        <aside className="xl:col-span-1 min-w-0 space-y-4">
          <WatchlistSidebar />
          <Card>
            <CardBody className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Active Alerts</h2>
                  <p className="text-[11px] text-text-muted mt-0.5">Live & triggered hari ini</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-950 text-accent-400 ring-1 ring-accent-400/30 font-semibold">
                  {liveAlerts} aktif
                </span>
              </div>
              <div className="space-y-2">
                {ALERTS.slice(0, 4).map(a => {
                  const coin = COINS.find(c => c.symbol === a.symbol)
                  return (
                    <div key={a.id} className="flex items-center gap-3 py-1.5">
                      <Sparkline data={coin?.sparkline ?? []} tone={(coin?.change24h ?? 0) > 0 ? 'bull' : (coin?.change24h ?? 0) < 0 ? 'bear' : 'neutral'} width={48} height={18} showFill={false} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-text-primary truncate">
                          {a.symbol.replace('USDT', '')} <span className="text-text-dim font-normal">· {getSignalLabel(a.ruleType)}</span>
                        </div>
                        <div className="text-[10px] text-text-muted truncate">{a.message}</div>
                      </div>
                      <span className={clsx(
                        'text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold shrink-0',
                        a.status === 'live' && 'bg-bull-950 text-bull-400',
                        a.status === 'triggered' && 'bg-warn-950 text-warn-400',
                        a.status === 'muted' && 'bg-bg-overlay text-text-muted',
                        a.status === 'backfill' && 'bg-signal-950 text-signal-400',
                        a.status === 'error' && 'bg-bear-950 text-bear-400',
                      )}>{a.status}</span>
                    </div>
                  )
                })}
              </div>
              <Link
                to="/alerts"
                className="flex items-center justify-center gap-1 text-xs text-accent-400 hover:text-accent-500 pt-2 border-t border-line"
              >
                Lihat semua alerts <ArrowRight className="w-3 h-3" />
              </Link>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, Volume2, Coins, Trophy, Bell, ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { Card, CardBody } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Sparkline } from '../ui/Sparkline'
import { ALERTS, BACKTEST_RUNS, COINS } from '../../data/mock'
import { fmtIdrCompact, fmtPct, fmtPrice, fmtVol, tone } from '../../lib/format'

interface RadarCardProps {
  label: string
  icon: LucideIcon
  iconTone: 'bull' | 'bear' | 'warn' | 'signal' | 'info'
  to?: string
  children: React.ReactNode
  glow?: 'bull' | 'bear' | 'signal' | 'none'
  badge?: React.ReactNode
}

const ICON_TONE = {
  bull: 'text-bull-400 bg-bull-950 ring-bull-500/30',
  bear: 'text-bear-400 bg-bear-950 ring-bear-500/30',
  warn: 'text-warn-400 bg-warn-950 ring-warn-500/30',
  signal: 'text-signal-400 bg-signal-950 ring-signal-500/30',
  info: 'text-info-400 bg-info-950 ring-info-500/30',
}

function RadarCard({ label, icon: Icon, iconTone, to, children, glow = 'none', badge }: RadarCardProps) {
  const inner = (
    <Card glow={glow} className="h-full transition-transform duration-200 hover:-translate-y-0.5 hover:border-line-strong">
      <CardBody className="p-3 sm:p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={clsx('inline-flex w-7 h-7 rounded-lg items-center justify-center ring-1 ring-inset shrink-0', ICON_TONE[iconTone])}>
              <Icon className="w-4 h-4" />
            </span>
            <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">
              {label}
            </div>
          </div>
          {badge}
        </div>
        {children}
        {to && (
          <div className="flex items-center gap-1 text-[11px] text-text-muted group-hover:text-signal-400 transition-colors pt-1">
            <span>Lihat detail</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        )}
      </CardBody>
    </Card>
  )
  if (to) {
    return <Link to={to} className="group block">{inner}</Link>
  }
  return inner
}

export function MarketRadar() {
  // Compute radar values
  const sorted = [...COINS]
  const biggestGainer = sorted.sort((a, b) => b.change24h - a.change24h)[0]
  const biggestLoser = sorted.sort((a, b) => a.change24h - b.change24h)[0]
  const volumeSpike = sorted.sort((a, b) => b.volumeChange - a.volumeChange)[0]
  const highestPremium = sorted
    .filter(c => c.premiumPct !== null)
    .sort((a, b) => (b.premiumPct ?? 0) - (a.premiumPct ?? 0))[0]
  const bestSignal = BACKTEST_RUNS.sort((a, b) => b.sharpe - a.sharpe)[0]
  const liveAlerts = ALERTS.filter(a => a.status === 'live' || a.status === 'triggered').length

  return (
    <section aria-labelledby="market-radar-title" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="market-radar-title" className="text-sm font-semibold uppercase tracking-widest text-text-muted">
          📡 Market Radar
        </h2>
        <span className="text-[10px] text-text-muted">6 sinyal teratas saat ini</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <RadarCard
          label="Top Gainer 24h"
          icon={TrendingUp}
          iconTone="bull"
          glow="bull"
          to={`/coin/${biggestGainer.symbol}`}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-text-primary">{biggestGainer.base}</span>
            <span className="text-bull-400 font-bold num text-sm">{fmtPct(biggestGainer.change24h)}</span>
          </div>
          <Sparkline data={biggestGainer.sparkline} tone="bull" width={120} height={24} />
          <div className="text-[11px] text-text-muted num">${fmtPrice(biggestGainer.price)}</div>
        </RadarCard>

        <RadarCard
          label="Top Loser 24h"
          icon={TrendingDown}
          iconTone="bear"
          glow="bear"
          to={`/coin/${biggestLoser.symbol}`}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-text-primary">{biggestLoser.base}</span>
            <span className="text-bear-400 font-bold num text-sm">{fmtPct(biggestLoser.change24h)}</span>
          </div>
          <Sparkline data={biggestLoser.sparkline} tone="bear" width={120} height={24} />
          <div className="text-[11px] text-text-muted num">${fmtPrice(biggestLoser.price)}</div>
        </RadarCard>

        <RadarCard
          label="Volume Spike"
          icon={Volume2}
          iconTone="info"
          to={`/coin/${volumeSpike.symbol}`}
          badge={<Badge tone="info" size="xs">+{volumeSpike.volumeChange.toFixed(0)}%</Badge>}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-text-primary">{volumeSpike.base}</span>
            <span className={clsx('font-bold num text-sm', tone(volumeSpike.change24h) === 'bull' ? 'text-bull-400' : 'text-bear-400')}>
              {fmtPct(volumeSpike.change24h)}
            </span>
          </div>
          <div className="text-[11px] text-text-muted">
            <span className="num">{fmtVol(volumeSpike.volume24h)}</span> · 24h vol
          </div>
          <div className="text-[10px] text-text-dim">vs 7d avg</div>
        </RadarCard>

        <RadarCard
          label="Indodax Premium"
          icon={Coins}
          iconTone="warn"
          to={`/coin/${highestPremium.symbol}`}
          badge={<Badge tone="warn" size="xs">+{highestPremium.premiumPct?.toFixed(2)}%</Badge>}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-text-primary">{highestPremium.base}</span>
            <span className="text-warn-400 font-bold num text-sm">+{highestPremium.premiumPct?.toFixed(2)}%</span>
          </div>
          <div className="text-[11px] text-text-muted">
            <span className="num">${fmtPrice(highestPremium.price)}</span> spot
          </div>
          <div className="text-[10px] text-text-dim num">
            <span>{fmtIdrCompact(highestPremium.idrPrice ?? 0)}</span>
          </div>
        </RadarCard>

        <RadarCard
          label="Best Signal 30d"
          icon={Trophy}
          iconTone="signal"
          glow="signal"
          to="/performance"
          badge={<Badge tone="signal" size="xs">PF {bestSignal.profitFactor.toFixed(2)}</Badge>}
        >
          <div className="flex items-baseline justify-between gap-2 min-w-0">
            <span className="font-semibold text-text-primary text-sm truncate" title={bestSignal.strategyName}>
              {bestSignal.strategyName}
            </span>
            <span className={clsx('font-bold num text-sm shrink-0', tone(bestSignal.totalPnl) === 'bull' ? 'text-bull-400' : 'text-bear-400')}>
              {fmtPct(bestSignal.totalPnl)}
            </span>
          </div>
          <div className="text-[11px] text-text-muted">
            Win <span className="num text-text-secondary">{bestSignal.winRate.toFixed(0)}%</span>
            <span className="mx-1.5 text-text-dim">·</span>
            Sharpe <span className="num text-text-secondary">{bestSignal.sharpe.toFixed(2)}</span>
          </div>
          <div className="text-[10px] text-text-dim num">n={bestSignal.nTrades} trades</div>
        </RadarCard>

        <RadarCard
          label="Active Alerts"
          icon={Bell}
          iconTone="bull"
          to="/alerts"
          badge={liveAlerts > 0 ? <Badge tone="bull" size="xs" variant="dot">{liveAlerts} live</Badge> : undefined}
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-2xl text-text-primary num leading-none">{liveAlerts}</span>
            <span className="text-[11px] text-text-muted">/ {ALERTS.length} total</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {ALERTS.slice(0, 3).map(a => (
              <span key={a.id} className="text-[10px] px-1.5 py-0.5 rounded bg-bg-overlay text-text-muted ring-1 ring-line">
                {a.symbol.replace('USDT', '')}
              </span>
            ))}
            {ALERTS.length > 3 && <span className="text-[10px] text-text-dim">+{ALERTS.length - 3}</span>}
          </div>
        </RadarCard>
      </div>
    </section>
  )
}

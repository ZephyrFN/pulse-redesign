import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Bell, Coins, FlaskConical, LineChart, Sparkles, Star,
  TrendingDown, TrendingUp, Activity, BarChart3,
} from 'lucide-react'
import clsx from 'clsx'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Sparkline } from '../components/ui/Sparkline'
import { RangeBar } from '../components/ui/RangeBar'
import { Stat } from '../components/ui/Stat'
import { ALERTS, BACKTEST_RUNS, COINS, getSignalLabel } from '../data/mock'
import { fmtIdrCompact, fmtPct, fmtPrice, fmtVol, timeAgo, tone } from '../lib/format'

type Tab = 'overview' | 'signals' | 'alerts' | 'backtests' | 'indodax'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'signals', label: 'Signals' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'backtests', label: 'Backtests' },
  { id: 'indodax', label: 'Indodax Premium' },
]

export function CoinDetail() {
  const { symbol } = useParams<{ symbol: string }>()
  const [tab, setTab] = useState<Tab>('overview')

  const coin = useMemo(() => COINS.find(c => c.symbol === symbol), [symbol])

  if (!coin) {
    return (
      <Card>
        <CardBody className="text-center py-16">
          <div className="text-text-muted mb-4">Coin "{symbol}" tidak ditemukan</div>
          <Link to="/" className="text-signal-400 hover:text-signal-500 text-sm">← Kembali ke dashboard</Link>
        </CardBody>
      </Card>
    )
  }

  const changeTone = tone(coin.change24h)
  const coinAlerts = ALERTS.filter(a => a.symbol === coin.symbol)
  const coinSignals = coin.activeSignals

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-signal-400 transition-colors">
        <ArrowLeft className="w-3 h-3" />
        Kembali ke dashboard
      </Link>

      {/* Header card */}
      <Card glow={changeTone === 'bull' && coin.change24h > 5 ? 'bull' : changeTone === 'bear' && coin.change24h < -5 ? 'bear' : 'none'}>
        <CardBody className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-bg-elevated ring-1 ring-line-strong flex items-center justify-center text-sm font-bold text-text-secondary uppercase shrink-0">
                {coin.base.slice(0, 3)}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{coin.base}</h1>
                  <span className="text-text-muted text-base">/USDT</span>
                  {coin.pinned && (
                    <Badge tone="warn" size="sm" icon={<Star className="w-3 h-3 fill-warn-400" />}>
                      Watchlisted
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-text-muted num mt-0.5">
                  #{coin.rank} · {coin.name} · MCap {fmtVol(coin.marketCap)}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {coinSignals.length > 0 ? coinSignals.map(s => (
                    <Badge key={s} tone="signal" size="xs" icon={<Sparkles className="w-2.5 h-2.5" />}>
                      {getSignalLabel(s)}
                    </Badge>
                  )) : (
                    <Badge tone="neutral" size="xs">No active signals</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-3xl sm:text-4xl font-bold text-text-primary num leading-none">
                ${fmtPrice(coin.price)}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5">
                <span className={clsx(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-md font-bold num text-sm ring-1 ring-inset',
                  changeTone === 'bull' && 'bg-bull-950 text-bull-400 ring-bull-500/30',
                  changeTone === 'bear' && 'bg-bear-950 text-bear-400 ring-bear-500/30',
                  changeTone === 'neutral' && 'bg-bg-overlay text-text-secondary ring-line',
                )}>
                  {changeTone === 'bull' && <TrendingUp className="w-3.5 h-3.5" />}
                  {changeTone === 'bear' && <TrendingDown className="w-3.5 h-3.5" />}
                  {fmtPct(coin.change24h)}
                </span>
                <span className="text-xs text-text-muted">24h</span>
              </div>
            </div>
          </div>

          {/* Mini stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-line">
            <Stat
              size="sm"
              label="Volume 24h"
              value={fmtVol(coin.volume24h)}
              hint={`${coin.volumeChange > 0 ? '+' : ''}${coin.volumeChange.toFixed(0)}% vs 7d`}
              tone={coin.volumeChange > 25 ? 'signal' : 'neutral'}
            />
            <Stat
              size="sm"
              label="7d change"
              value={fmtPct(coin.change7d)}
              tone={coin.change7d > 0 ? 'bull' : coin.change7d < 0 ? 'bear' : 'neutral'}
            />
            <Stat
              size="sm"
              label="Indodax"
              value={coin.idrPrice !== null ? fmtIdrCompact(coin.idrPrice) : '—'}
              hint={coin.premiumPct !== null ? `${coin.premiumPct > 0 ? '+' : ''}${coin.premiumPct.toFixed(2)}% prem` : 'Not listed'}
              tone={(coin.premiumPct ?? 0) > 0.3 ? 'signal' : 'neutral'}
            />
            <Stat
              size="sm"
              label="24h range"
              value={`$${fmtPrice(coin.low24h)} – $${fmtPrice(coin.high24h)}`}
              tone="neutral"
            />
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Button variant="primary" size="sm" icon={<Bell className="w-3.5 h-3.5" />}>Buat alert</Button>
            <Button variant="soft" size="sm" icon={<FlaskConical className="w-3.5 h-3.5" />}>Run backtest</Button>
            <Button variant="ghost" size="sm" icon={<Star className="w-3.5 h-3.5" />}>
              {coin.pinned ? 'Sudah dipin' : 'Pin watchlist'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="border-b border-line">
        <div className="flex gap-1 -mb-px overflow-x-auto pulse-scroll">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-active={tab === t.id}
              className={clsx(
                'px-4 h-10 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                tab === t.id
                  ? 'text-signal-400 border-signal-500'
                  : 'text-text-muted border-transparent hover:text-text-secondary',
              )}
            >
              {t.label}
              {t.id === 'signals' && coinSignals.length > 0 && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-signal-950 text-signal-400">{coinSignals.length}</span>
              )}
              {t.id === 'alerts' && coinAlerts.length > 0 && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-bg-elevated text-text-secondary">{coinAlerts.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {tab === 'overview' && <OverviewTab coin={coin} />}
        {tab === 'signals' && <SignalsTab coin={coin} />}
        {tab === 'alerts' && <AlertsTab coin={coin} />}
        {tab === 'backtests' && <BacktestsTab />}
        {tab === 'indodax' && <IndodaxTab coin={coin} />}
      </div>
    </div>
  )
}

// ============================================================
// Tab content
// ============================================================
function OverviewTab({ coin }: { coin: typeof COINS[number] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Price chart */}
      <Card className="lg:col-span-2">
        <CardHeader title="Price · 24h" subtitle="Mock sparkline · gunakan candle chart di production" icon={<LineChart className="w-4 h-4" />} />
        <CardBody>
          <div className="bg-bg-elevated/40 rounded-lg p-4 h-64 flex items-center justify-center">
            <Sparkline data={coin.sparkline} tone="auto" width={600} height={200} className="w-full" />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-text-muted num">
            <span>L: ${fmtPrice(coin.low24h)}</span>
            <span>Spot: ${fmtPrice(coin.price)}</span>
            <span>H: ${fmtPrice(coin.high24h)}</span>
          </div>
          <div className="mt-2"><RangeBar low={coin.low24h} high={coin.high24h} current={coin.price} /></div>
        </CardBody>
      </Card>

      {/* Technical readout */}
      <Card>
        <CardHeader title="Technical" subtitle="Snapshot indikator key" icon={<Activity className="w-4 h-4" />} />
        <CardBody className="space-y-3">
          <IndicatorRow label="RSI (14)" value={coin.activeSignals.includes('rsi_oversold') ? '28.4' : coin.activeSignals.includes('rsi_overbought') ? '74.2' : '52.1'} hint="Momentum 0-100" tone={coin.activeSignals.includes('rsi_oversold') ? 'bull' : coin.activeSignals.includes('rsi_overbought') ? 'bear' : 'neutral'} />
          <IndicatorRow label="MACD" value={coin.activeSignals.includes('macd_bull_cross') ? 'Bull cross' : coin.activeSignals.includes('macd_bear_cross') ? 'Bear cross' : 'No cross'} hint="Trend & momentum" tone={coin.activeSignals.includes('macd_bull_cross') ? 'bull' : coin.activeSignals.includes('macd_bear_cross') ? 'bear' : 'neutral'} />
          <IndicatorRow label="Bollinger" value={coin.activeSignals.includes('bb_breakout_lower') ? 'Below lower' : coin.activeSignals.includes('bb_breakout_upper') ? 'Above upper' : 'Within band'} hint="Mean reversion" tone={coin.activeSignals.includes('bb_breakout_lower') ? 'bull' : coin.activeSignals.includes('bb_breakout_upper') ? 'bear' : 'neutral'} />
          <IndicatorRow label="Volume" value={coin.volumeChange > 50 ? `+${coin.volumeChange.toFixed(0)}% spike` : 'Normal'} hint="vs 7d avg" tone={coin.volumeChange > 50 ? 'signal' : 'neutral'} />
        </CardBody>
      </Card>
    </div>
  )
}

function SignalsTab({ coin }: { coin: typeof COINS[number] }) {
  if (coin.activeSignals.length === 0) {
    return (
      <Card><CardBody className="py-12 text-center text-text-muted">
        Tidak ada sinyal aktif untuk {coin.base} saat ini. Tunggu kondisi terpenuhi atau lihat riwayat di tab Alerts.
      </CardBody></Card>
    )
  }
  return (
    <Card>
      <CardHeader title="Sinyal aktif" subtitle={`${coin.activeSignals.length} sinyal saat ini`} icon={<Sparkles className="w-4 h-4" />} />
      <CardBody className="space-y-3">
        {coin.activeSignals.map(s => (
          <div key={s} className="rounded-lg bg-bg-elevated/60 ring-1 ring-line p-3 flex items-start gap-3">
            <Badge tone="signal" size="md">{getSignalLabel(s)}</Badge>
            <div className="flex-1">
              <div className="text-sm text-text-primary font-medium">{getSignalLabel(s)}</div>
              <div className="text-xs text-text-muted mt-0.5">
                Mock signal — backend integration akan render data real (RSI value, MACD position, BB distance).
              </div>
            </div>
            <Button size="xs" variant="soft" icon={<Bell className="w-3 h-3" />}>Alert me</Button>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

function AlertsTab({ coin }: { coin: typeof COINS[number] }) {
  const coinAlerts = ALERTS.filter(a => a.symbol === coin.symbol)
  if (coinAlerts.length === 0) {
    return (
      <Card><CardBody className="py-12 text-center text-text-muted">
        Belum ada alert untuk {coin.base}. Klik <span className="text-signal-400">Buat alert</span> di header untuk mulai.
      </CardBody></Card>
    )
  }
  return (
    <div className="space-y-3">
      {coinAlerts.map(a => (
        <Card key={a.id}>
          <CardBody className="p-4 flex items-start gap-3">
            <Bell className="w-4 h-4 text-info-400 mt-1 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-text-primary text-sm">{getSignalLabel(a.ruleType)}</span>
                <AlertStatusBadge status={a.status} />
              </div>
              {a.threshold && (
                <div className="text-xs text-text-muted mt-0.5">{a.threshold}</div>
              )}
              <div className="text-sm text-text-secondary mt-1">{a.message}</div>
              <div className="text-[11px] text-text-dim mt-1">{timeAgo(a.triggeredAt)}</div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

function BacktestsTab() {
  return (
    <div className="space-y-3">
      {BACKTEST_RUNS.map(r => (
        <Card key={r.id}>
          <CardBody className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-text-primary">{r.strategyName}</span>
                  <Badge tone="neutral" size="xs">{r.universe}</Badge>
                  <Badge tone="neutral" size="xs">{r.daysBack}d</Badge>
                </div>
                <div className="text-xs text-text-muted mt-0.5">{getSignalLabel(r.ruleType)}</div>
              </div>
              <Badge
                tone={r.totalPnl > 0 ? 'bull' : 'bear'}
                size="md"
                variant="soft"
              >
                {fmtPct(r.totalPnl)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Stat size="sm" label="Win rate" value={`${r.winRate.toFixed(0)}%`} tone={r.winRate > 50 ? 'bull' : 'bear'} />
              <Stat size="sm" label="Profit factor" value={r.profitFactor.toFixed(2)} tone={r.profitFactor > 1 ? 'bull' : 'bear'} />
              <Stat size="sm" label="Sharpe" value={r.sharpe.toFixed(2)} tone={r.sharpe > 0 ? 'bull' : 'bear'} />
              <Stat size="sm" label="Max DD" value={`${r.maxDD.toFixed(2)}%`} tone="bear" />
              <Stat size="sm" label="Trades" value={r.nTrades} tone="neutral" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

function IndodaxTab({ coin }: { coin: typeof COINS[number] }) {
  if (coin.idrPrice === null) {
    return (
      <Card><CardBody className="py-12 text-center text-text-muted">
        {coin.base} tidak listed di Indodax. Pakai exchange lain (Tokocrypto, Pintu) atau global exchange untuk eksekusi.
      </CardBody></Card>
    )
  }
  const isPremium = (coin.premiumPct ?? 0) > 0
  const usdEquivalent = coin.idrPrice / 16400 // approx IDR/USD May 2026
  const usdDelta = usdEquivalent - coin.price
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Indodax (IDR)" subtitle="Harga lokal" icon={<Coins className="w-4 h-4" />} />
        <CardBody className="space-y-3">
          <Stat size="lg" label="Spot price" value={fmtIdrCompact(coin.idrPrice)} tone="neutral" />
          <Stat size="sm" label="Equivalent USD" value={`$${fmtPrice(usdEquivalent)}`} tone="neutral" hint={`${usdDelta >= 0 ? '+' : ''}$${fmtPrice(Math.abs(usdDelta))} vs Binance`} />
        </CardBody>
      </Card>
      <Card glow={isPremium && (coin.premiumPct ?? 0) > 0.5 ? 'signal' : 'none'}>
        <CardHeader title="Premium / discount" subtitle="vs Binance USDT" icon={<BarChart3 className="w-4 h-4" />} />
        <CardBody className="space-y-3">
          <Stat
            size="lg"
            label="Premium %"
            value={`${(coin.premiumPct ?? 0) > 0 ? '+' : ''}${coin.premiumPct?.toFixed(2)}%`}
            tone={(coin.premiumPct ?? 0) > 0.3 ? 'signal' : 'neutral'}
          />
          <div className="text-xs text-text-muted leading-relaxed">
            {(coin.premiumPct ?? 0) > 0.5
              ? '⚠️ Premium tinggi — biasanya saat panic/FOMO. Pertimbangkan beli di Binance + transfer ke Indodax untuk arbitrase, atau jual lokal kalau punya stok.'
              : (coin.premiumPct ?? 0) > 0
              ? 'Premium normal. Eksekusi lokal langsung tidak terlalu rugi.'
              : 'Discount — Indodax lebih murah dari Binance. Bagus untuk beli lokal.'}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

// ============================================================
// Helpers
// ============================================================
function IndicatorRow({ label, value, hint, tone: t }: { label: string; value: string; hint?: string; tone: 'bull' | 'bear' | 'neutral' | 'signal' }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0">
      <div>
        <div className="text-sm text-text-primary font-medium">{label}</div>
        {hint && <div className="text-[11px] text-text-muted">{hint}</div>}
      </div>
      <span className={clsx(
        'num font-bold text-sm',
        t === 'bull' && 'text-bull-400',
        t === 'bear' && 'text-bear-400',
        t === 'signal' && 'text-signal-400',
        t === 'neutral' && 'text-text-secondary',
      )}>
        {value}
      </span>
    </div>
  )
}

function AlertStatusBadge({ status }: { status: typeof ALERTS[number]['status'] }) {
  const map: Record<string, { tone: 'bull' | 'bear' | 'warn' | 'signal' | 'neutral'; label: string }> = {
    live: { tone: 'bull', label: 'LIVE' },
    backfill: { tone: 'signal', label: 'BACKFILL' },
    triggered: { tone: 'warn', label: 'TRIGGERED' },
    muted: { tone: 'neutral', label: 'MUTED' },
    error: { tone: 'bear', label: 'ERROR' },
  }
  const conf = map[status]
  return <Badge tone={conf.tone} size="xs" variant={status === 'live' ? 'dot' : 'soft'}>{conf.label}</Badge>
}

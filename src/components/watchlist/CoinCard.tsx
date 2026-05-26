import { Link } from 'react-router-dom'
import { Bell, FlaskConical, ExternalLink, Activity, Sparkles, Coins, X } from 'lucide-react'
import clsx from 'clsx'
import type { Coin } from '../../data/mock'
import { getSignalLabel } from '../../data/mock'
import { fmtIdrCompact, fmtPct, fmtPrice, fmtVol, tone } from '../../lib/format'
import { Badge } from '../ui/Badge'
import { Card, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { Sparkline } from '../ui/Sparkline'
import { RangeBar } from '../ui/RangeBar'

interface CoinCardProps {
  coin: Coin
  onUnpin?: () => void
}

/**
 * Mock technical indicator readouts.
 * In production, would come from candle analysis.
 */
function pseudoRSI(coin: Coin): number {
  if (coin.activeSignals.includes('rsi_oversold')) return 24 + Math.random() * 6
  if (coin.activeSignals.includes('rsi_overbought')) return 70 + Math.random() * 8
  // Use change24h as proxy
  return 50 + coin.change24h * 1.5
}

function pseudoMACD(coin: Coin): 'bullish' | 'bearish' | 'neutral' {
  if (coin.activeSignals.includes('macd_bull_cross')) return 'bullish'
  if (coin.activeSignals.includes('macd_bear_cross')) return 'bearish'
  return Math.abs(coin.change24h) < 1 ? 'neutral' : coin.change24h > 0 ? 'bullish' : 'bearish'
}

function pseudoBB(coin: Coin): 'lower' | 'middle' | 'upper' {
  if (coin.activeSignals.includes('bb_breakout_lower')) return 'lower'
  if (coin.activeSignals.includes('bb_breakout_upper')) return 'upper'
  const pos = (coin.price - coin.low24h) / (coin.high24h - coin.low24h)
  if (pos < 0.25) return 'lower'
  if (pos > 0.75) return 'upper'
  return 'middle'
}

function rsiTone(rsi: number): 'bull' | 'bear' | 'warn' | 'neutral' {
  if (rsi < 30) return 'bull'
  if (rsi > 70) return 'bear'
  if (rsi < 40 || rsi > 60) return 'warn'
  return 'neutral'
}

export function CoinCard({ coin, onUnpin }: CoinCardProps) {
  const changeTone = tone(coin.change24h)
  const rsi = pseudoRSI(coin)
  const macd = pseudoMACD(coin)
  const bb = pseudoBB(coin)
  const macdTone = macd === 'bullish' ? 'bull' : macd === 'bearish' ? 'bear' : 'neutral'

  return (
    <Card
      glow={changeTone === 'bull' && coin.change24h > 5 ? 'bull' : changeTone === 'bear' && coin.change24h < -5 ? 'bear' : 'none'}
      className="group transition-all duration-200 hover:border-line-strong"
    >
      <CardBody className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Link to={`/coin/${coin.symbol}`} className="flex items-start gap-3 min-w-0 group/link">
            <div className="w-10 h-10 rounded-full bg-bg-elevated ring-1 ring-line-strong flex items-center justify-center text-[11px] font-bold text-text-secondary uppercase shrink-0">
              {coin.base.slice(0, 3)}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-text-primary text-base group-hover/link:text-accent-400 transition-colors">{coin.base}</span>
                <span className="text-text-dim text-xs">/USDT</span>
                <ExternalLink className="w-3 h-3 text-text-dim opacity-0 group-hover/link:opacity-100 transition-opacity ml-1" />
              </div>
              <div className="text-[11px] text-text-muted truncate num">#{coin.rank} · {coin.name}</div>
            </div>
          </Link>
          {onUnpin && (
            <button
              onClick={onUnpin}
              aria-label={`Unpin ${coin.base}`}
              className="p-1 rounded text-text-dim hover:text-bear-400 hover:bg-bear-950 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Price + sparkline */}
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="font-bold num text-2xl text-text-primary">${fmtPrice(coin.price)}</span>
            <span className={clsx(
              'inline-block px-2 py-0.5 rounded font-bold num text-sm ring-1 ring-inset',
              changeTone === 'bull' && 'bg-bull-950 text-bull-400 ring-bull-500/20',
              changeTone === 'bear' && 'bg-bear-950 text-bear-400 ring-bear-500/20',
              changeTone === 'neutral' && 'bg-bg-overlay text-text-secondary ring-line',
            )}>
              {fmtPct(coin.change24h)}
            </span>
          </div>
          <Sparkline data={coin.sparkline} tone={changeTone === 'bull' ? 'bull' : changeTone === 'bear' ? 'bear' : 'neutral'} width={300} height={48} className="w-full" />

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-text-dim num mb-1">
              <span>L: ${fmtPrice(coin.low24h)}</span>
              <span className="text-text-muted">24h range</span>
              <span>H: ${fmtPrice(coin.high24h)}</span>
            </div>
            <RangeBar low={coin.low24h} high={coin.high24h} current={coin.price} />
          </div>
        </div>

        {/* Volume + premium */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-bg-elevated/60 ring-1 ring-line p-2.5">
            <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">Volume 24h</div>
            <div className="num font-semibold text-text-primary">{fmtVol(coin.volume24h)}</div>
            <div className={clsx(
              'text-[10px] num',
              coin.volumeChange > 0 ? 'text-bull-400' : 'text-text-dim',
            )}>
              {coin.volumeChange > 0 ? '+' : ''}{coin.volumeChange.toFixed(0)}% vs 7d
            </div>
          </div>
          <div className="rounded-lg bg-bg-elevated/60 ring-1 ring-line p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-text-muted font-semibold">
              <Coins className="w-2.5 h-2.5" />
              Indodax
            </div>
            {coin.idrPrice !== null ? (
              <>
                <div className="num font-semibold text-text-primary">{fmtIdrCompact(coin.idrPrice)}</div>
                <div className={clsx(
                  'text-[10px] num',
                  (coin.premiumPct ?? 0) > 0.3 ? 'text-warn-400' : 'text-text-muted',
                )}>
                  {(coin.premiumPct ?? 0) > 0 ? '+' : ''}{coin.premiumPct?.toFixed(2)}% premium
                </div>
              </>
            ) : (
              <>
                <div className="num font-semibold text-text-dim">—</div>
                <div className="text-[10px] text-text-dim">Not listed</div>
              </>
            )}
          </div>
        </div>

        {/* Technical summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-widest text-text-muted font-semibold flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Technical
            </span>
            {coin.activeSignals.length > 0 && (
              <Badge tone="signal" size="xs" icon={<Sparkles className="w-2.5 h-2.5" />}>
                {coin.activeSignals.length} signal{coin.activeSignals.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <IndicatorCell label="RSI" value={rsi.toFixed(1)} tone={rsiTone(rsi)} />
            <IndicatorCell label="MACD" value={macd === 'bullish' ? 'BULL' : macd === 'bearish' ? 'BEAR' : '—'} tone={macdTone} />
            <IndicatorCell label="BB" value={bb === 'upper' ? 'UPPER' : bb === 'lower' ? 'LOWER' : 'MID'} tone={bb === 'upper' ? 'bear' : bb === 'lower' ? 'bull' : 'neutral'} />
          </div>
          {coin.activeSignals.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {coin.activeSignals.map(s => (
                <Badge key={s} tone="signal" size="xs">{getSignalLabel(s)}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-line">
          <Button
            variant="soft"
            size="sm"
            icon={<ExternalLink className="w-3 h-3" />}
            onClick={() => { window.location.href = `/coin/${coin.symbol}` }}
          >
            Detail
          </Button>
          <Button
            variant="soft"
            size="sm"
            icon={<Bell className="w-3 h-3" />}
          >
            Alert
          </Button>
          <Button
            variant="soft"
            size="sm"
            icon={<FlaskConical className="w-3 h-3" />}
          >
            Backtest
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

function IndicatorCell({ label, value, tone: t }: { label: string; value: string; tone: 'bull' | 'bear' | 'warn' | 'neutral' }) {
  return (
    <div className={clsx(
      'rounded-md px-2 py-1.5 ring-1 ring-inset',
      t === 'bull' && 'bg-bull-950 ring-bull-500/20',
      t === 'bear' && 'bg-bear-950 ring-bear-500/20',
      t === 'warn' && 'bg-warn-950 ring-warn-500/20',
      t === 'neutral' && 'bg-bg-elevated ring-line',
    )}>
      <div className="text-[9px] uppercase tracking-widest text-text-muted font-semibold">{label}</div>
      <div className={clsx(
        'num text-xs font-bold leading-tight',
        t === 'bull' && 'text-bull-400',
        t === 'bear' && 'text-bear-400',
        t === 'warn' && 'text-warn-400',
        t === 'neutral' && 'text-text-secondary',
      )}>{value}</div>
    </div>
  )
}

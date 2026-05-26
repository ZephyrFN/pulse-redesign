import { Link } from 'react-router-dom'
import { Search, Star, StarOff, Bell, FlaskConical, Sparkles, Activity, Coins, X } from 'lucide-react'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { FilterChip } from '../ui/FilterChip'
import { RangeBar } from '../ui/RangeBar'
import { Sparkline } from '../ui/Sparkline'
import { COINS } from '../../data/mock'
import type { Coin } from '../../data/mock'
import { fmtIdrCompact, fmtPct, fmtPrice, fmtVol, tone } from '../../lib/format'

type Filter = 'all' | 'gainers' | 'losers' | 'volume' | 'premium' | 'signals' | 'watchlist'

const FILTER_DEFS: { id: Filter; label: string; tone: 'default' | 'bull' | 'bear' | 'warn' | 'signal' }[] = [
  { id: 'all', label: 'Semua', tone: 'default' },
  { id: 'gainers', label: 'Gainers', tone: 'bull' },
  { id: 'losers', label: 'Losers', tone: 'bear' },
  { id: 'volume', label: 'Volume Tinggi', tone: 'default' },
  { id: 'premium', label: 'Premium', tone: 'warn' },
  { id: 'signals', label: 'Sinyal Aktif', tone: 'signal' },
  { id: 'watchlist', label: 'Watchlist', tone: 'default' },
]

function applyFilter(coins: Coin[], filter: Filter, search: string): Coin[] {
  let out = coins
  switch (filter) {
    case 'gainers': out = coins.filter(c => c.change24h > 0); break
    case 'losers': out = coins.filter(c => c.change24h < 0); break
    case 'volume': out = coins.filter(c => c.volumeChange > 25); break
    case 'premium': out = coins.filter(c => (c.premiumPct ?? 0) > 0.3); break
    case 'signals': out = coins.filter(c => c.activeSignals.length > 0); break
    case 'watchlist': out = coins.filter(c => c.pinned); break
  }
  if (search) {
    const q = search.toLowerCase()
    out = out.filter(c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.base.toLowerCase().includes(q))
  }
  return out
}

function CoinRowBadges({ coin }: { coin: Coin }) {
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {coin.activeSignals.length > 0 && (
        <Badge tone="signal" size="xs" icon={<Sparkles className="w-2.5 h-2.5" />}>
          Live Signal
        </Badge>
      )}
      {Math.abs(coin.change24h) > 7 && (
        <Badge tone="warn" size="xs" icon={<Activity className="w-2.5 h-2.5" />}>
          Risk Watch
        </Badge>
      )}
      {(coin.premiumPct ?? 0) > 0.3 && (
        <Badge tone="warn" size="xs" icon={<Coins className="w-2.5 h-2.5" />}>
          Premium {coin.premiumPct?.toFixed(2)}%
        </Badge>
      )}
      {coin.activeSignals.length === 0 && Math.abs(coin.change24h) < 1 && (
        <Badge tone="neutral" size="xs">Neutral</Badge>
      )}
    </div>
  )
}

export function TopMovers() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  // Compute counts for each filter
  const counts = useMemo(() => {
    return {
      all: COINS.length,
      gainers: COINS.filter(c => c.change24h > 0).length,
      losers: COINS.filter(c => c.change24h < 0).length,
      volume: COINS.filter(c => c.volumeChange > 25).length,
      premium: COINS.filter(c => (c.premiumPct ?? 0) > 0.3).length,
      signals: COINS.filter(c => c.activeSignals.length > 0).length,
      watchlist: COINS.filter(c => c.pinned).length,
    }
  }, [])

  const filtered = useMemo(() => applyFilter(COINS, filter, search), [filter, search])

  return (
    <section aria-labelledby="top-movers-title" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 id="top-movers-title" className="text-sm font-semibold uppercase tracking-widest text-text-muted">
            Top Movers
          </h2>
          <span className="text-[10px] text-text-muted num">
            {filtered.length} / {COINS.length} pair
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pair (mis. BTC, ETH)…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 pl-8 pr-7 w-56 rounded-lg bg-bg-elevated text-sm text-text-primary placeholder-text-muted ring-1 ring-line-strong focus:ring-signal-500/50 transition-shadow"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_DEFS.map(f => (
          <FilterChip
            key={f.id}
            active={filter === f.id}
            onClick={() => setFilter(f.id)}
            count={counts[f.id]}
            tone={f.tone}
          >
            {f.label}
          </FilterChip>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto pulse-scroll max-h-[68vh]">
          <table className="w-full text-sm min-w-[920px]">
            <thead className="sticky top-0 z-10 bg-bg-surface/95 backdrop-blur-sm">
              <tr className="text-left text-[10px] uppercase tracking-widest text-text-muted border-b border-line">
                <th className="px-2 py-2.5 font-semibold w-8"></th>
                <th className="px-2 py-2.5 font-semibold">Pair</th>
                <th className="px-2 py-2.5 font-semibold text-right">Price</th>
                <th className="px-2 py-2.5 font-semibold text-right">24h</th>
                <th className="px-2 py-2.5 font-semibold w-[140px]">24h Range</th>
                <th className="px-2 py-2.5 font-semibold text-right">Volume</th>
                <th className="px-2 py-2.5 font-semibold text-right">Indodax</th>
                <th className="px-2 py-2.5 font-semibold">Status</th>
                <th className="px-2 py-2.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-text-muted text-sm">
                    {search
                      ? <>Tidak ada hasil untuk "<span className="text-text-secondary">{search}</span>". Coba kata kunci lain.</>
                      : 'Tidak ada pair yang cocok dengan filter.'}
                  </td>
                </tr>
              )}
              {filtered.map(coin => (
                <CoinRow key={coin.symbol} coin={coin} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}

function CoinRow({ coin }: { coin: Coin }) {
  const changeTone = tone(coin.change24h)

  return (
    <tr className="border-t border-line hover-surface group">
      {/* Pin */}
      <td className="px-2 py-3 align-middle">
        <button
          aria-label={coin.pinned ? `Unpin ${coin.base}` : `Pin ${coin.base}`}
          className={clsx(
            'p-1 rounded-md transition-colors',
            coin.pinned
              ? 'text-warn-400 hover:bg-warn-950'
              : 'text-text-dim hover:text-text-secondary hover:bg-bg-overlay/40 opacity-0 group-hover:opacity-100',
          )}
        >
          {coin.pinned ? <Star className="w-4 h-4 fill-warn-400" /> : <StarOff className="w-4 h-4" />}
        </button>
      </td>

      {/* Pair */}
      <td className="px-2 py-3 align-middle">
        <Link to={`/coin/${coin.symbol}`} className="flex items-center gap-2.5 group/link">
          <div className="w-8 h-8 rounded-full bg-bg-elevated ring-1 ring-line-strong flex items-center justify-center text-[10px] font-bold text-text-secondary uppercase shrink-0">
            {coin.base.slice(0, 3)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-text-primary group-hover/link:text-accent-400 transition-colors leading-tight">
              {coin.base}
              <span className="text-text-dim text-xs ml-1">/USDT</span>
            </div>
            <div className="text-[11px] text-text-muted leading-tight num">#{coin.rank} · {coin.name}</div>
          </div>
        </Link>
      </td>

      {/* Price */}
      <td className="px-2 py-3 align-middle text-right">
        <div className="flex items-center justify-end gap-2">
          <Sparkline data={coin.sparkline} tone={changeTone === 'bull' ? 'bull' : changeTone === 'bear' ? 'bear' : 'neutral'} width={56} height={20} showFill={false} />
          <span className="font-semibold text-text-primary num">${fmtPrice(coin.price)}</span>
        </div>
      </td>

      {/* 24h */}
      <td className="px-2 py-3 align-middle text-right">
        <span className={clsx(
          'inline-block px-1.5 py-0.5 rounded font-bold num text-xs ring-1 ring-inset',
          changeTone === 'bull' && 'bg-bull-950 text-bull-400 ring-bull-500/20',
          changeTone === 'bear' && 'bg-bear-950 text-bear-400 ring-bear-500/20',
          changeTone === 'neutral' && 'bg-bg-overlay text-text-secondary ring-line',
        )}>
          {fmtPct(coin.change24h)}
        </span>
      </td>

      {/* 24h range */}
      <td className="px-2 py-3 align-middle">
        <RangeBar low={coin.low24h} high={coin.high24h} current={coin.price} />
        <div className="flex justify-between text-[10px] text-text-dim mt-1 num">
          <span>${fmtPrice(coin.low24h)}</span>
          <span>${fmtPrice(coin.high24h)}</span>
        </div>
      </td>

      {/* Volume */}
      <td className="px-2 py-3 align-middle text-right">
        <div className="num text-text-secondary text-xs">{fmtVol(coin.volume24h)}</div>
        <div className={clsx(
          'text-[10px] num',
          coin.volumeChange > 0 ? 'text-bull-400' : 'text-text-dim',
        )}>
          {coin.volumeChange > 0 ? '+' : ''}{coin.volumeChange.toFixed(0)}%
        </div>
      </td>

      {/* Indodax */}
      <td className="px-2 py-3 align-middle text-right">
        {coin.idrPrice !== null ? (
          <div>
            <div className="num text-text-secondary text-xs">{fmtIdrCompact(coin.idrPrice)}</div>
            <div className={clsx(
              'text-[10px] num',
              (coin.premiumPct ?? 0) > 0.3 ? 'text-warn-400' : 'text-text-muted',
            )}>
              {(coin.premiumPct ?? 0) > 0 ? '+' : ''}{coin.premiumPct?.toFixed(2)}%
            </div>
          </div>
        ) : (
          <span className="text-text-dim text-[11px]" title="Tidak listed di Indodax">—</span>
        )}
      </td>

      {/* Status badges */}
      <td className="px-2 py-3 align-middle">
        <CoinRowBadges coin={coin} />
      </td>

      {/* Actions */}
      <td className="px-2 py-3 align-middle text-right">
        <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Create alert"
            title="Buat alert"
            className="p-1.5 rounded-md text-text-muted hover:text-accent-400 hover:bg-accent-950 transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            aria-label="Run backtest"
            title="Jalankan backtest"
            className="p-1.5 rounded-md text-text-muted hover:text-signal-400 hover:bg-signal-950 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

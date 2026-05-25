import { Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MarketRadar } from '../components/dashboard/MarketRadar'
import { TopMovers } from '../components/dashboard/TopMovers'
import { Stat } from '../components/ui/Stat'
import { Card, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { COINS, MARKET_STATS } from '../data/mock'
import { fmtVol } from '../lib/format'

export function Dashboard() {
  const gainersPct = (MARKET_STATS.gainers24h / MARKET_STATS.totalCoins) * 100
  const breadthTone = gainersPct >= 60 ? 'bull' : gainersPct >= 40 ? 'neutral' : 'bear'

  return (
    <div className="space-y-6">
      {/* Page header / hero */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge tone="signal" size="sm" variant="dot">Live</Badge>
            <span className="text-[11px] text-text-muted uppercase tracking-widest font-semibold">
              Crypto Market Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
            Apa yang bergerak hari ini?
          </h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl">
            Top 50 USDT pairs di Binance, dengan overlay Indodax & sinyal teknikal.
            Klik kartu apa saja untuk drill ke detail coin.
          </p>
        </div>

        <Card className="hidden md:block">
          <CardBody className="px-5 py-3 flex items-center gap-6">
            <Stat
              size="sm"
              label="Total volume 24h"
              value={fmtVol(MARKET_STATS.totalVolume)}
              hint={<span className="num">{COINS.length} pair</span>}
            />
            <div className="w-px h-10 bg-line" />
            <Stat
              size="sm"
              label="Breadth"
              value={`${MARKET_STATS.gainers24h}/${MARKET_STATS.losers24h}`}
              tone={breadthTone}
              delta={
                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <TrendingUp className="w-3 h-3" />
                  <span className="num">{gainersPct.toFixed(0)}% gainers</span>
                </span>
              }
            />
            <div className="w-px h-10 bg-line" />
            <Stat
              size="sm"
              label="Active signals"
              value={COINS.reduce((s, c) => s + c.activeSignals.length, 0)}
              tone="signal"
              delta={
                <Link to="/alerts" className="flex items-center gap-1 text-[11px] text-signal-400 hover:text-signal-500">
                  <Sparkles className="w-3 h-3" />
                  <span>Lihat alerts</span>
                </Link>
              }
            />
          </CardBody>
        </Card>
      </header>

      {/* Market radar */}
      <MarketRadar />

      {/* Top movers */}
      <TopMovers />
    </div>
  )
}

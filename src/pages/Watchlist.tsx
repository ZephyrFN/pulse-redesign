import { useMemo, useState } from 'react'
import { Plus, Search, Star } from 'lucide-react'
import { Card, CardBody } from '../components/ui/Card'
import { CoinCard } from '../components/watchlist/CoinCard'
import { COINS } from '../data/mock'
import { Button } from '../components/ui/Button'

export function Watchlist() {
  const [search, setSearch] = useState('')
  const [pinnedSymbols, setPinnedSymbols] = useState<string[]>(
    COINS.filter(c => c.pinned).map(c => c.symbol),
  )
  const [showAdd, setShowAdd] = useState(false)

  const pinnedCoins = useMemo(
    () => COINS.filter(c => pinnedSymbols.includes(c.symbol)),
    [pinnedSymbols],
  )

  const availableCoins = useMemo(() => {
    const q = search.toLowerCase()
    return COINS
      .filter(c => !pinnedSymbols.includes(c.symbol))
      .filter(c =>
        !search ||
        c.symbol.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.base.toLowerCase().includes(q),
      )
  }, [search, pinnedSymbols])

  function unpin(symbol: string) {
    setPinnedSymbols(p => p.filter(s => s !== symbol))
  }
  function pin(symbol: string) {
    setPinnedSymbols(p => [...p, symbol])
    setShowAdd(false)
    setSearch('')
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-warn-400 fill-warn-400" />
            Watchlist
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Coin yang kamu pantau aktif. Klik card untuk drill ke detail, atau gunakan CTA untuk action cepat.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAdd(s => !s)}
        >
          {showAdd ? 'Tutup' : 'Tambah coin'}
        </Button>
      </header>

      {showAdd && (
        <Card>
          <CardBody className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-text-primary text-sm">Cari coin untuk dipin</h2>
              <span className="text-[11px] text-text-muted num">{availableCoins.length} tersedia</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                autoFocus
                type="text"
                placeholder="Cari pair (mis. SOL, XRP)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-10 pl-10 pr-3 w-full rounded-lg bg-bg-elevated text-sm text-text-primary placeholder-text-muted ring-1 ring-line-strong focus:ring-signal-500/50 transition-shadow"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto pulse-scroll">
              {availableCoins.length === 0 && (
                <div className="col-span-full text-center text-text-muted text-sm py-6">
                  Tidak ada hasil. {pinnedSymbols.length === COINS.length && 'Semua coin sudah dipin.'}
                </div>
              )}
              {availableCoins.map(c => (
                <button
                  key={c.symbol}
                  onClick={() => pin(c.symbol)}
                  className="text-left p-2 rounded-lg ring-1 ring-line hover:ring-line-strong hover:bg-bg-overlay/40 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-bg-elevated ring-1 ring-line-strong flex items-center justify-center text-[10px] font-bold text-text-secondary uppercase shrink-0">
                      {c.base.slice(0, 3)}
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="font-semibold text-text-primary group-hover:text-signal-400 text-sm">{c.base}</div>
                      <div className="text-[10px] text-text-muted truncate">#{c.rank} {c.name}</div>
                    </div>
                    <Plus className="w-4 h-4 text-text-dim group-hover:text-signal-400 ml-auto shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Pinned cards grid */}
      {pinnedCoins.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center">
            <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-bg-elevated ring-1 ring-line-strong mb-4">
              <Star className="w-6 h-6 text-warn-400" />
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-1">Watchlist kosong</h2>
            <p className="text-sm text-text-muted max-w-md mx-auto mb-4">
              Pin coin yang ingin kamu pantau. Mulai dengan Top 5 atau coin yang sedang ada signal aktif.
            </p>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>
              Tambah coin pertama
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pinnedCoins.map(coin => (
            <CoinCard key={coin.symbol} coin={coin} onUnpin={() => unpin(coin.symbol)} />
          ))}
        </div>
      )}
    </div>
  )
}

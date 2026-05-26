import { useMemo, useState } from 'react'
import {
  AlertTriangle, Bell, ChevronRight, Plus, Sparkles, Trash2, Volume2, Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FilterChip } from '../components/ui/FilterChip'
import { ALERTS, COINS, getSignalLabel } from '../data/mock'
import type { AlertEvent, SignalType } from '../data/mock'
import { timeAgo } from '../lib/format'

type StatusFilter = 'all' | 'live' | 'backfill' | 'triggered' | 'muted' | 'error'

const STATUS_FILTERS: { id: StatusFilter; label: string; tone: 'default' | 'bull' | 'bear' | 'warn' | 'signal' }[] = [
  { id: 'all', label: 'Semua', tone: 'default' },
  { id: 'live', label: 'Live', tone: 'bull' },
  { id: 'triggered', label: 'Triggered', tone: 'warn' },
  { id: 'backfill', label: 'Backfill', tone: 'signal' },
  { id: 'muted', label: 'Muted', tone: 'default' },
  { id: 'error', label: 'Error', tone: 'bear' },
]

const STATUS_TONE: Record<AlertEvent['status'], 'bull' | 'bear' | 'warn' | 'signal' | 'neutral'> = {
  live: 'bull',
  triggered: 'warn',
  backfill: 'signal',
  muted: 'neutral',
  error: 'bear',
}

const STATUS_LABEL: Record<AlertEvent['status'], string> = {
  live: 'LIVE',
  triggered: 'TRIGGERED',
  backfill: 'BACKFILL',
  muted: 'MUTED',
  error: 'ERROR',
}

export function Alerts() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [showBuilder, setShowBuilder] = useState(false)

  const counts = useMemo(() => {
    const out: Record<StatusFilter, number> = {
      all: ALERTS.length,
      live: 0, backfill: 0, triggered: 0, muted: 0, error: 0,
    }
    ALERTS.forEach(a => { out[a.status]++ })
    return out
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'all') return ALERTS
    return ALERTS.filter(a => a.status === filter)
  }, [filter])

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-info-400" />
            Alerts
          </h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl">
            Setup notifikasi otomatis saat kondisi market terpenuhi. Setiap alert yang fire jadi signal yang
            otomatis di-track win-rate-nya di tab Performance.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowBuilder(s => !s)}
        >
          {showBuilder ? 'Tutup builder' : 'Buat alert'}
        </Button>
      </header>

      {showBuilder && <AlertBuilder onClose={() => setShowBuilder(false)} />}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(s => {
          const c = counts[s.id]
          const isEmpty = c === 0 && s.id !== 'all'
          return (
            <FilterChip
              key={s.id}
              active={filter === s.id}
              onClick={() => !isEmpty && setFilter(s.id)}
              count={c}
              tone={s.tone}
            >
              <span className={isEmpty ? 'opacity-50' : ''}>{s.label}</span>
            </FilterChip>
          )
        })}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardBody className="py-16 text-center">
              <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-bg-elevated ring-1 ring-line-strong mb-4">
                <Bell className="w-6 h-6 text-info-400" />
              </div>
              <h2 className="text-lg font-bold text-text-primary mb-1">Belum ada alert</h2>
              <p className="text-sm text-text-muted max-w-md mx-auto mb-4">
                Klik "Buat alert" untuk mulai. Coba: <em>"Notify saat BTC RSI di bawah 30"</em>
              </p>
              <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowBuilder(true)}>
                Buat alert pertama
              </Button>
            </CardBody>
          </Card>
        ) : (
          filtered.map(a => <AlertCard key={a.id} alert={a} />)
        )}
      </div>
    </div>
  )
}

// ============================================================
// Alert card
// ============================================================
function AlertCard({ alert }: { alert: AlertEvent }) {
  const tone = STATUS_TONE[alert.status]
  return (
    <Card className="group">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div className={clsx(
            'shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ring-1 ring-inset',
            tone === 'bull' && 'bg-bull-950 ring-bull-500/30 text-bull-400',
            tone === 'warn' && 'bg-warn-950 ring-warn-500/30 text-warn-400',
            tone === 'signal' && 'bg-signal-950 ring-signal-500/30 text-signal-400',
            tone === 'bear' && 'bg-bear-950 ring-bear-500/30 text-bear-400',
            tone === 'neutral' && 'bg-bg-elevated ring-line-strong text-text-secondary',
          )}>
            <Bell className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-text-primary text-sm">{alert.symbol.replace('USDT', '/USDT')}</span>
              <span className="text-text-dim">·</span>
              <span className="text-sm text-text-secondary">{getSignalLabel(alert.ruleType)}</span>
              <Badge tone={tone} size="xs" variant={alert.status === 'live' ? 'outline' : 'soft'}>
                {alert.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-bull-500 animate-pulse-soft mr-1" />}
                {STATUS_LABEL[alert.status]}
              </Badge>
            </div>
            {alert.threshold && (
              <div className="text-[11px] text-text-muted mt-1 font-mono">{alert.threshold}</div>
            )}
            <div className="text-sm text-text-secondary mt-1.5">{alert.message}</div>
            <div className="text-[11px] text-text-dim mt-1">{timeAgo(alert.triggeredAt)}</div>
          </div>

          <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="xs" icon={<Volume2 className="w-3 h-3" />} aria-label="Mute alert">{null}</Button>
            <Button variant="ghost" size="xs" icon={<Trash2 className="w-3 h-3" />} aria-label="Delete alert">{null}</Button>
            <Button variant="ghost" size="xs" iconRight={<ChevronRight className="w-3 h-3" />}>Detail</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// ============================================================
// Alert builder — simple + advanced mode with natural language preview
// ============================================================
type Mode = 'simple' | 'advanced'

interface SimpleConfig {
  symbol: string
  condition: 'above' | 'below' | 'rsi_oversold' | 'rsi_overbought' | 'volume_spike'
  threshold: string
  timeframe: '1h' | '4h' | '1d'
}

const SIMPLE_CONDITIONS = [
  { value: 'above', label: 'naik di atas', needsThreshold: true, hint: 'mis. $80000' },
  { value: 'below', label: 'turun di bawah', needsThreshold: true, hint: 'mis. $80000' },
  { value: 'rsi_oversold', label: 'RSI oversold (< 30)', needsThreshold: false, hint: '' },
  { value: 'rsi_overbought', label: 'RSI overbought (> 70)', needsThreshold: false, hint: '' },
  { value: 'volume_spike', label: 'volume spike (> 3x rata-rata)', needsThreshold: false, hint: '' },
] as const

function AlertBuilder({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>('simple')

  // Simple mode state
  const [config, setConfig] = useState<SimpleConfig>({
    symbol: 'BTCUSDT',
    condition: 'rsi_oversold',
    threshold: '',
    timeframe: '4h',
  })

  const cond = SIMPLE_CONDITIONS.find(c => c.value === config.condition)!

  // Natural language preview
  const preview = useMemo(() => {
    const sym = config.symbol.replace('USDT', '')
    const parts: string[] = [`Notify saya ketika ${sym}`]
    if (cond.value === 'above' || cond.value === 'below') {
      parts.push(cond.label, config.threshold || '<harga>')
    } else {
      parts.push(cond.label)
    }
    parts.push(`pada timeframe ${config.timeframe}.`)
    return parts.join(' ')
  }, [config, cond])

  return (
    <Card glow="signal">
      <CardHeader
        icon={<Sparkles className="w-4 h-4 text-signal-400" />}
        title="Buat alert"
        subtitle="Pilih simple untuk natural language, advanced untuk rule teknikal kompleks."
        action={
          <Button variant="ghost" size="sm" onClick={onClose}>✕ Tutup</Button>
        }
      />
      <CardBody className="space-y-4">
        {/* Mode toggle */}
        <div className="inline-flex rounded-lg ring-1 ring-line-strong p-0.5 bg-bg-elevated">
          <button
            onClick={() => setMode('simple')}
            className={clsx(
              'px-4 h-8 text-xs font-medium rounded-md transition-colors',
              mode === 'simple' ? 'bg-signal-500 text-white shadow-sm' : 'text-text-muted hover:text-text-primary',
            )}
          >
            Simple
          </button>
          <button
            onClick={() => setMode('advanced')}
            className={clsx(
              'px-4 h-8 text-xs font-medium rounded-md transition-colors',
              mode === 'advanced' ? 'bg-signal-500 text-white shadow-sm' : 'text-text-muted hover:text-text-primary',
            )}
          >
            Advanced
          </button>
        </div>

        {mode === 'simple' ? (
          <SimpleBuilder config={config} setConfig={setConfig} />
        ) : (
          <AdvancedBuilder />
        )}

        {/* Preview */}
        <div className="rounded-xl bg-signal-950 ring-1 ring-signal-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-signal-400" />
            <span className="text-[10px] uppercase tracking-widest text-signal-400 font-semibold">Preview</span>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{preview}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-line">
          <Button variant="ghost" size="sm" onClick={onClose}>Batal</Button>
          <Button variant="soft" size="sm" icon={<AlertTriangle className="w-3.5 h-3.5" />}>Test fire</Button>
          <Button variant="primary" size="sm" icon={<Bell className="w-3.5 h-3.5" />}>Simpan & aktifkan</Button>
        </div>
      </CardBody>
    </Card>
  )
}

function SimpleBuilder({ config, setConfig }: { config: SimpleConfig; setConfig: (c: SimpleConfig) => void }) {
  const cond = SIMPLE_CONDITIONS.find(c => c.value === config.condition)!

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div>
        <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-1 block">Coin</label>
        <select
          value={config.symbol}
          onChange={e => setConfig({ ...config, symbol: e.target.value })}
          className="w-full h-10 px-3 rounded-lg bg-bg-elevated text-sm text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50"
        >
          {COINS.map(c => (
            <option key={c.symbol} value={c.symbol}>{c.base} — {c.name}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-1 block">Kondisi</label>
        <select
          value={config.condition}
          onChange={e => setConfig({ ...config, condition: e.target.value as SimpleConfig['condition'] })}
          className="w-full h-10 px-3 rounded-lg bg-bg-elevated text-sm text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50"
        >
          {SIMPLE_CONDITIONS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {cond.needsThreshold && (
          <input
            type="text"
            placeholder={cond.hint}
            value={config.threshold}
            onChange={e => setConfig({ ...config, threshold: e.target.value })}
            className="w-full h-10 mt-2 px-3 rounded-lg bg-bg-elevated text-sm text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50"
          />
        )}
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-1 block">Timeframe</label>
        <select
          value={config.timeframe}
          onChange={e => setConfig({ ...config, timeframe: e.target.value as SimpleConfig['timeframe'] })}
          className="w-full h-10 px-3 rounded-lg bg-bg-elevated text-sm text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50"
        >
          <option value="1h">1 jam</option>
          <option value="4h">4 jam</option>
          <option value="1d">1 hari</option>
        </select>
      </div>
    </div>
  )
}

function AdvancedBuilder() {
  const SIGNAL_RULES: { value: SignalType; label: string }[] = [
    { value: 'rsi_oversold', label: 'RSI Oversold (long bias)' },
    { value: 'rsi_overbought', label: 'RSI Overbought (short bias)' },
    { value: 'macd_bull_cross', label: 'MACD Bull Cross (long bias)' },
    { value: 'macd_bear_cross', label: 'MACD Bear Cross (short bias)' },
    { value: 'bb_breakout_lower', label: 'BB Breakout Lower (long bias)' },
    { value: 'bb_breakout_upper', label: 'BB Breakout Upper (short bias)' },
    { value: 'volume_spike', label: 'Volume Spike (neutral)' },
  ]
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-1 block">Coin</label>
          <select className="w-full h-10 px-3 rounded-lg bg-bg-elevated text-sm text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50">
            {COINS.map(c => (
              <option key={c.symbol} value={c.symbol}>{c.base} — {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-1 block">Rule</label>
          <select className="w-full h-10 px-3 rounded-lg bg-bg-elevated text-sm text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50">
            {SIGNAL_RULES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Input label="RSI threshold" placeholder="30" hint="0-100" />
        <Input label="Period (bars)" placeholder="14" hint="≥ 2" />
        <Input label="Cooldown (jam)" placeholder="1" hint="anti-spam" />
        <div>
          <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-1 block">Timeframe</label>
          <select className="w-full h-10 px-3 rounded-lg bg-bg-elevated text-sm text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50">
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg bg-warn-950 ring-1 ring-warn-500/30 p-3 flex items-start gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-warn-400 shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary">
          Advanced mode: rule teknikal langsung. Backtest dulu di tab Backtest sebelum auto-fire ke Telegram.
        </p>
      </div>
    </div>
  )
}

function Input({ label, placeholder, hint }: { label: string; placeholder: string; hint: string }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-1 block">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg bg-bg-elevated text-sm text-text-primary placeholder-text-dim ring-1 ring-line-strong focus:ring-signal-500/50"
      />
      <span className="text-[10px] text-text-dim">{hint}</span>
    </div>
  )
}

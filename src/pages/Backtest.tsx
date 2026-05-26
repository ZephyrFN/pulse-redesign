import { useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Check,
  ChevronRight, FlaskConical, Gauge, GitCompare, Plus, Shield, Sparkles,
  Target, TrendingDown, TrendingUp, Trophy, X, Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Stat } from '../components/ui/Stat'
import { Sparkline } from '../components/ui/Sparkline'
import { BACKTEST_RUNS, getSignalLabel } from '../data/mock'
import type { BacktestRun, SignalType } from '../data/mock'
import { fmtPct } from '../lib/format'

type WizardStep = 1 | 2 | 3 | 4 | 5

interface WizardConfig {
  // Step 1: Strategy
  ruleType: SignalType
  strategyName: string
  // Step 2: Universe
  universe: 'top5' | 'top10' | 'top20' | 'btconly' | 'ethonly'
  daysBack: 30 | 60 | 90
  // Step 3: Risk
  slPct: number
  tpPct: number
  positionSizePct: number
  startingCapital: number
  // Step 4 derived: review
  // Step 5 derived: results
}

const STEPS: { id: WizardStep; label: string; icon: typeof Target; hint: string }[] = [
  { id: 1, label: 'Strategy', icon: Sparkles, hint: 'Pilih rule & nama' },
  { id: 2, label: 'Universe', icon: Target, hint: 'Coin & periode' },
  { id: 3, label: 'Risk', icon: Shield, hint: 'SL/TP & size' },
  { id: 4, label: 'Review', icon: Check, hint: 'Konfirmasi' },
  { id: 5, label: 'Results', icon: BarChart3, hint: 'Lihat hasil' },
]

const RULE_OPTIONS: { value: SignalType; label: string; bias: 'long' | 'short' | 'neutral' }[] = [
  { value: 'bb_breakout_lower', label: 'BB Breakout Lower', bias: 'long' },
  { value: 'macd_bull_cross', label: 'MACD Bull Cross', bias: 'long' },
  { value: 'rsi_oversold', label: 'RSI Oversold', bias: 'long' },
  { value: 'volume_spike', label: 'Volume Spike', bias: 'neutral' },
]

const UNIVERSE_OPTIONS = [
  { value: 'btconly', label: 'BTC Only', desc: 'Stable, low noise' },
  { value: 'top5', label: 'Top 5 USDT', desc: 'Blue chip' },
  { value: 'top10', label: 'Top 10 USDT', desc: 'Recommended' },
  { value: 'top20', label: 'Top 20 USDT', desc: 'Wider, more samples' },
  { value: 'ethonly', label: 'ETH Only', desc: 'Single coin baseline' },
]

const DAYS_OPTIONS = [
  { value: 30, label: '30 hari', desc: '~1 bulan, minimum' },
  { value: 60, label: '60 hari', desc: '~2 bulan, balanced' },
  { value: 90, label: '90 hari', desc: '~3 bulan, robust' },
]

export function Backtest() {
  const [view, setView] = useState<'list' | 'wizard' | 'compare'>('list')
  const [step, setStep] = useState<WizardStep>(1)
  const [selected, setSelected] = useState<number[]>([])
  const [config, setConfig] = useState<WizardConfig>({
    ruleType: 'bb_breakout_lower',
    strategyName: 'BB Lower v1',
    universe: 'top10',
    daysBack: 30,
    slPct: 3,
    tpPct: 9,
    positionSizePct: 5,
    startingCapital: 1000,
  })

  const compareRuns = useMemo(() =>
    BACKTEST_RUNS.filter(r => selected.includes(r.id)),
  [selected])

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-signal-400" />
            Backtest
          </h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl">
            Test strategi pada data historis dengan SL, TP, fees, slippage realistis. Validasi sebelum risk modal real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length >= 2 && view === 'list' && (
            <Button variant="soft" size="sm" icon={<GitCompare className="w-4 h-4" />} onClick={() => setView('compare')}>
              Bandingkan ({selected.length})
            </Button>
          )}
          {view !== 'wizard' && (
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setView('wizard'); setStep(1) }}>
              Backtest baru
            </Button>
          )}
          {view !== 'list' && (
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setView('list')}>
              Kembali ke list
            </Button>
          )}
        </div>
      </header>

      {view === 'wizard' && (
        <Wizard
          step={step}
          setStep={setStep}
          config={config}
          setConfig={setConfig}
          onComplete={() => setView('list')}
        />
      )}

      {view === 'compare' && <Compare runs={compareRuns} onClear={() => setSelected([])} />}

      {view === 'list' && (
        <RunsList runs={BACKTEST_RUNS} selected={selected} setSelected={setSelected} />
      )}
    </div>
  )
}

// ============================================================
// Wizard
// ============================================================
function Wizard({ step, setStep, config, setConfig, onComplete }: {
  step: WizardStep
  setStep: (s: WizardStep) => void
  config: WizardConfig
  setConfig: (c: WizardConfig) => void
  onComplete: () => void
}) {
  const isLast = step === 5
  const canBack = step > 1

  function next() {
    if (step < 5) setStep((step + 1) as WizardStep)
  }
  function back() {
    if (canBack) setStep((step - 1) as WizardStep)
  }

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <Card>
        <CardBody className="p-4">
          <ol className="flex items-center gap-1 sm:gap-3 overflow-x-auto pulse-scroll">
            {STEPS.map((s, i) => {
              const isCurrent = s.id === step
              const isComplete = s.id < step
              return (
                <li key={s.id} className="flex items-center shrink-0 min-w-0">
                  <button
                    type="button"
                    onClick={() => isComplete && setStep(s.id)}
                    className={clsx(
                      'flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors',
                      isCurrent && 'bg-signal-950 ring-1 ring-signal-500/40',
                      isComplete && 'cursor-pointer hover:bg-bg-overlay/40',
                      !isCurrent && !isComplete && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    <span className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 shrink-0',
                      isCurrent && 'bg-signal-500 text-white ring-signal-400',
                      isComplete && 'bg-bull-500/30 text-bull-400 ring-bull-500/40',
                      !isCurrent && !isComplete && 'bg-bg-elevated text-text-muted ring-line-strong',
                    )}>
                      {isComplete ? <Check className="w-3 h-3" /> : s.id}
                    </span>
                    <div className="text-left hidden sm:block">
                      <div className={clsx(
                        'text-xs font-semibold',
                        isCurrent ? 'text-signal-400' : isComplete ? 'text-text-primary' : 'text-text-muted',
                      )}>{s.label}</div>
                      <div className="text-[10px] text-text-dim leading-tight">{s.hint}</div>
                    </div>
                  </button>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-text-dim mx-1 shrink-0" />
                  )}
                </li>
              )
            })}
          </ol>
        </CardBody>
      </Card>

      {/* Step content */}
      {step === 1 && <Step1Strategy config={config} setConfig={setConfig} />}
      {step === 2 && <Step2Universe config={config} setConfig={setConfig} />}
      {step === 3 && <Step3Risk config={config} setConfig={setConfig} />}
      {step === 4 && <Step4Review config={config} />}
      {step === 5 && <Step5Results config={config} />}

      {/* Nav */}
      <div className="flex items-center justify-between gap-3">
        {canBack ? (
          <Button variant="ghost" size="md" icon={<ArrowLeft className="w-4 h-4" />} onClick={back}>
            Kembali
          </Button>
        ) : <div />}
        {isLast ? (
          <div className="flex gap-2">
            <Button variant="soft" onClick={onComplete}>Tutup wizard</Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={onComplete}>
              Simpan & buat baru
            </Button>
          </div>
        ) : step === 4 ? (
          <Button variant="primary" iconRight={<Zap className="w-4 h-4" />} onClick={next}>
            Run backtest
          </Button>
        ) : (
          <Button variant="primary" iconRight={<ArrowRight className="w-4 h-4" />} onClick={next}>
            Lanjut
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Step 1 — Strategy
// ============================================================
function Step1Strategy({ config, setConfig }: { config: WizardConfig; setConfig: (c: WizardConfig) => void }) {
  return (
    <Card>
      <CardHeader title="Step 1 · Pilih strategi" subtitle="Aturan masuk + nama strategy untuk identifikasi run" icon={<Sparkles className="w-4 h-4" />} />
      <CardBody className="space-y-4">
        <div>
          <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-2 block">Nama strategi</label>
          <input
            type="text"
            value={config.strategyName}
            onChange={e => setConfig({ ...config, strategyName: e.target.value })}
            className="w-full h-11 px-4 rounded-lg bg-bg-elevated text-base text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50"
          />
          <p className="text-xs text-text-muted mt-1">Mudah dibedakan: contoh "BB Lower 3SL/9TP" atau "MACD aggressive".</p>
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-2 block">Aturan entry</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RULE_OPTIONS.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setConfig({ ...config, ruleType: r.value })}
                className={clsx(
                  'text-left p-4 rounded-lg ring-1 transition-colors',
                  config.ruleType === r.value
                    ? 'bg-signal-950 ring-signal-500/40'
                    : 'bg-bg-elevated/60 ring-line hover:ring-line-strong hover:bg-bg-overlay/40',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-text-primary">{r.label}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {r.value === 'bb_breakout_lower' && 'Mean reversion · panic dump → bounce'}
                      {r.value === 'macd_bull_cross' && 'Momentum · MACD line cross signal up'}
                      {r.value === 'rsi_oversold' && 'Oversold reversal · RSI < 30'}
                      {r.value === 'volume_spike' && 'Volume catalyst · 3x rata-rata'}
                    </div>
                  </div>
                  <Badge tone={r.bias === 'long' ? 'bull' : r.bias === 'short' ? 'bear' : 'neutral'} size="xs">
                    {r.bias.toUpperCase()}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// ============================================================
// Step 2 — Universe
// ============================================================
function Step2Universe({ config, setConfig }: { config: WizardConfig; setConfig: (c: WizardConfig) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Universe" subtitle="Coin yang dipakai backtest" icon={<Target className="w-4 h-4" />} />
        <CardBody className="space-y-2">
          {UNIVERSE_OPTIONS.map(u => (
            <button
              key={u.value}
              type="button"
              onClick={() => setConfig({ ...config, universe: u.value as WizardConfig['universe'] })}
              className={clsx(
                'w-full text-left p-3 rounded-lg ring-1 transition-colors flex items-center justify-between gap-3',
                config.universe === u.value
                  ? 'bg-signal-950 ring-signal-500/40'
                  : 'bg-bg-elevated/60 ring-line hover:ring-line-strong',
              )}
            >
              <div>
                <div className="font-semibold text-text-primary text-sm">{u.label}</div>
                <div className="text-xs text-text-muted">{u.desc}</div>
              </div>
              {config.universe === u.value && <Check className="w-4 h-4 text-signal-400" />}
            </button>
          ))}
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Periode" subtitle="Days back dari hari ini" icon={<Activity className="w-4 h-4" />} />
        <CardBody className="space-y-2">
          {DAYS_OPTIONS.map(d => (
            <button
              key={d.value}
              type="button"
              onClick={() => setConfig({ ...config, daysBack: d.value as WizardConfig['daysBack'] })}
              className={clsx(
                'w-full text-left p-3 rounded-lg ring-1 transition-colors flex items-center justify-between gap-3',
                config.daysBack === d.value
                  ? 'bg-signal-950 ring-signal-500/40'
                  : 'bg-bg-elevated/60 ring-line hover:ring-line-strong',
              )}
            >
              <div>
                <div className="font-semibold text-text-primary text-sm">{d.label}</div>
                <div className="text-xs text-text-muted">{d.desc}</div>
              </div>
              {config.daysBack === d.value && <Check className="w-4 h-4 text-signal-400" />}
            </button>
          ))}
          <div className="rounded-lg bg-warn-950 ring-1 ring-warn-500/30 p-3 mt-3 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-warn-400 shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary leading-relaxed">
              30 hari = sample minimum. Idealnya 90+ hari di multiple market regime sebelum trust strategi.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

// ============================================================
// Step 3 — Risk
// ============================================================
function Step3Risk({ config, setConfig }: { config: WizardConfig; setConfig: (c: WizardConfig) => void }) {
  const rrRatio = (config.tpPct / config.slPct).toFixed(1)
  return (
    <Card>
      <CardHeader title="Step 3 · Risk parameters" subtitle="Stop Loss / Take Profit / Position size" icon={<Shield className="w-4 h-4" />} />
      <CardBody className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">Stop Loss</label>
              <span className="num text-bear-400 font-bold">{config.slPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={config.slPct}
              onChange={e => setConfig({ ...config, slPct: parseFloat(e.target.value) })}
              className="w-full accent-bear-500"
            />
            <p className="text-[11px] text-text-muted mt-1">Posisi auto-close kalau turun {config.slPct}% dari entry.</p>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">Take Profit</label>
              <span className="num text-bull-400 font-bold">{config.tpPct.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="0.5"
              value={config.tpPct}
              onChange={e => setConfig({ ...config, tpPct: parseFloat(e.target.value) })}
              className="w-full accent-bull-500"
            />
            <p className="text-[11px] text-text-muted mt-1">Posisi auto-close kalau naik {config.tpPct}% dari entry.</p>
          </div>
        </div>

        <div className="rounded-xl bg-signal-950 ring-1 ring-signal-500/30 p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-signal-400 font-semibold">Risk / Reward Ratio</div>
            <div className="text-2xl font-bold num text-text-primary mt-0.5">1 : {rrRatio}</div>
          </div>
          <div className="text-xs text-text-muted text-right">
            {parseFloat(rrRatio) >= 3 ? '✓ Aggressive — high RR' : parseFloat(rrRatio) >= 2 ? '✓ Solid — recommended' : '⚠️ Tight — needs high win rate'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-line">
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">Position size</label>
              <span className="num text-text-primary font-bold">{config.positionSizePct}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={config.positionSizePct}
              onChange={e => setConfig({ ...config, positionSizePct: parseInt(e.target.value) })}
              className="w-full accent-signal-500"
            />
            <p className="text-[11px] text-text-muted mt-1">{config.positionSizePct}% modal per trade.</p>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest text-text-muted font-semibold mb-2 block">Modal awal (USD)</label>
            <input
              type="number"
              value={config.startingCapital}
              onChange={e => setConfig({ ...config, startingCapital: parseFloat(e.target.value) || 1000 })}
              className="w-full h-11 px-4 rounded-lg bg-bg-elevated text-base text-text-primary ring-1 ring-line-strong focus:ring-signal-500/50 num"
            />
            <p className="text-[11px] text-text-muted mt-1">Simulasi mulai dengan ${config.startingCapital}.</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

// ============================================================
// Step 4 — Review
// ============================================================
function Step4Review({ config }: { config: WizardConfig }) {
  const universeLabel = UNIVERSE_OPTIONS.find(u => u.value === config.universe)?.label
  return (
    <Card>
      <CardHeader title="Step 4 · Review konfigurasi" subtitle="Cek sekali lagi sebelum klik Run." icon={<Check className="w-4 h-4" />} />
      <CardBody>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReviewItem label="Strategi" value={config.strategyName} />
          <ReviewItem label="Aturan" value={getSignalLabel(config.ruleType)} />
          <ReviewItem label="Universe" value={universeLabel ?? config.universe} />
          <ReviewItem label="Periode" value={`${config.daysBack} hari ke belakang`} />
          <ReviewItem label="Stop Loss" value={`${config.slPct.toFixed(1)}%`} tone="bear" />
          <ReviewItem label="Take Profit" value={`${config.tpPct.toFixed(1)}%`} tone="bull" />
          <ReviewItem label="Position size" value={`${config.positionSizePct}% modal`} />
          <ReviewItem label="Modal awal" value={`$${config.startingCapital.toLocaleString('en-US')}`} />
        </dl>
        <div className="mt-5 rounded-lg bg-warn-950 ring-1 ring-warn-500/30 p-3 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-warn-400 shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Backtest akan menyertakan fees 0.2% round-trip + slippage 0.05% per trade.
            Hasil real bisa bervariasi karena spread, latency, dan eksekusi order.
          </p>
        </div>
      </CardBody>
    </Card>
  )
}

function ReviewItem({ label, value, tone }: { label: string; value: string; tone?: 'bull' | 'bear' }) {
  return (
    <div className="rounded-lg bg-bg-elevated/60 ring-1 ring-line p-3">
      <dt className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">{label}</dt>
      <dd className={clsx(
        'mt-1 font-semibold num',
        tone === 'bull' && 'text-bull-400',
        tone === 'bear' && 'text-bear-400',
        !tone && 'text-text-primary',
      )}>{value}</dd>
    </div>
  )
}

// ============================================================
// Step 5 — Results (mock)
// ============================================================
function Step5Results({ config }: { config: WizardConfig }) {
  // Generate plausible mock result based on rule
  const mockResult: BacktestRun = useMemo(() => ({
    id: 999,
    strategyName: config.strategyName,
    ruleType: config.ruleType,
    universe: UNIVERSE_OPTIONS.find(u => u.value === config.universe)?.label ?? config.universe,
    daysBack: config.daysBack,
    totalPnl: config.ruleType === 'bb_breakout_lower' ? 1.06 + (Math.random() - 0.5) : config.ruleType === 'macd_bull_cross' ? 0.4 : -0.8,
    winRate: config.ruleType === 'bb_breakout_lower' ? 31 + Math.random() * 8 : 22 + Math.random() * 10,
    profitFactor: config.ruleType === 'bb_breakout_lower' ? 1.28 : 0.9 + Math.random() * 0.3,
    sharpe: config.ruleType === 'bb_breakout_lower' ? 1.67 : -0.5 + Math.random(),
    maxDD: 1 + Math.random() * 3,
    nTrades: Math.floor(20 + Math.random() * 20),
    startedAt: new Date().toISOString(),
  }), [config])

  return <ResultsPanel run={mockResult} />
}

function ResultsPanel({ run }: { run: BacktestRun }) {
  const isWin = run.totalPnl > 0
  // Generate equity curve sparkline
  const equityCurve = useMemo(() => {
    const points: number[] = [1000]
    for (let i = 1; i < 30; i++) {
      const r = (Math.random() - 0.5) * 0.04
      points.push(points[i - 1] * (1 + r))
    }
    // Force last point to match final equity
    const finalEq = 1000 * (1 + run.totalPnl / 100)
    points[points.length - 1] = finalEq
    return points
  }, [run.totalPnl])

  return (
    <div className="space-y-4">
      <Card glow={isWin ? 'bull' : 'bear'}>
        <CardBody className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge tone={isWin ? 'bull' : 'bear'} size="sm" variant="dot">
                  {isWin ? 'Profitable' : 'Unprofitable'}
                </Badge>
                <span className="text-[11px] text-text-muted uppercase tracking-widest font-semibold">Backtest result</span>
              </div>
              <h2 className="text-2xl font-bold text-text-primary">{run.strategyName}</h2>
              <div className="text-sm text-text-muted mt-0.5">
                {getSignalLabel(run.ruleType)} · {run.universe} · {run.daysBack}d
              </div>
            </div>
            <div className="text-right">
              <div className={clsx(
                'text-3xl font-bold num leading-none',
                isWin ? 'text-bull-400' : 'text-bear-400',
              )}>
                {fmtPct(run.totalPnl)}
              </div>
              <div className="text-xs text-text-muted mt-1">Total return</div>
            </div>
          </div>

          {/* Equity curve preview */}
          <div className="bg-bg-elevated/40 rounded-lg p-3 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3 h-3 text-text-muted" />
              <span className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">Equity curve</span>
            </div>
            <Sparkline data={equityCurve} tone={isWin ? 'bull' : 'bear'} width={1200} height={80} className="w-full" />
          </div>

          {/* Result cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Stat
              size="md"
              label="PnL"
              value={fmtPct(run.totalPnl)}
              tone={isWin ? 'bull' : 'bear'}
            />
            <Stat
              size="md"
              label="Sharpe"
              value={run.sharpe.toFixed(2)}
              tone={run.sharpe > 1 ? 'bull' : run.sharpe > 0 ? 'neutral' : 'bear'}
            />
            <Stat
              size="md"
              label="Max DD"
              value={`-${run.maxDD.toFixed(2)}%`}
              tone="bear"
            />
            <Stat
              size="md"
              label="Win rate"
              value={`${run.winRate.toFixed(0)}%`}
              tone={run.winRate >= 50 ? 'bull' : 'bear'}
            />
            <Stat
              size="md"
              label="Trades"
              value={run.nTrades}
              tone="neutral"
            />
          </div>

          {/* Result badges */}
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-line">
            <ResultBadge condition={run.sharpe > 1.5} positive="Best Sharpe" negative="Low Sharpe" iconOk={<Trophy className="w-3 h-3" />} iconBad={<TrendingDown className="w-3 h-3" />} />
            <ResultBadge condition={run.totalPnl > 1} positive="Best PnL" negative="Negative PnL" iconOk={<TrendingUp className="w-3 h-3" />} iconBad={<TrendingDown className="w-3 h-3" />} />
            <ResultBadge condition={run.maxDD < 2} positive="Lowest Drawdown" negative="High Risk" iconOk={<Shield className="w-3 h-3" />} iconBad={<AlertTriangle className="w-3 h-3" />} />
            <ResultBadge condition={run.profitFactor > 1.5} positive="Strong PF" negative="Weak PF" iconOk={<Gauge className="w-3 h-3" />} iconBad={<Activity className="w-3 h-3" />} />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function ResultBadge({ condition, positive, negative, iconOk, iconBad }: {
  condition: boolean
  positive: string
  negative: string
  iconOk: React.ReactNode
  iconBad: React.ReactNode
}) {
  return (
    <Badge
      tone={condition ? 'bull' : 'warn'}
      size="sm"
      icon={condition ? iconOk : iconBad}
    >
      {condition ? positive : negative}
    </Badge>
  )
}

// ============================================================
// Runs list
// ============================================================
function RunsList({ runs, selected, setSelected }: {
  runs: BacktestRun[]
  selected: number[]
  setSelected: (s: number[]) => void
}) {
  function toggle(id: number) {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }

  if (runs.length === 0) {
    return (
      <Card>
        <CardBody className="py-16 text-center">
          <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-bg-elevated ring-1 ring-line-strong mb-4">
            <FlaskConical className="w-6 h-6 text-signal-400" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-1">Belum ada backtest</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto mb-4">
            Klik "Backtest baru" untuk mulai. Wizard 5 langkah akan guide kamu.
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="text-xs text-text-muted">
          {selected.length} dipilih · {selected.length >= 2 && 'klik "Bandingkan" di atas'}{selected.length === 1 && 'pilih satu lagi untuk bandingkan'}
        </div>
      )}
      {/* Compute winners */}
      {(() => null)()}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(() => {
          const bestPnlId = runs.reduce((b, r) => r.totalPnl > b.totalPnl ? r : b).id
          const bestSharpeId = runs.reduce((b, r) => r.sharpe > b.sharpe ? r : b).id
          const lowestDDId = runs.reduce((b, r) => r.maxDD < b.maxDD ? r : b).id
          return runs.map(run => {
            const isSel = selected.includes(run.id)
            const isWin = run.totalPnl > 0
            const winnerBadges: { label: string; icon: React.ReactNode }[] = []
            if (run.id === bestPnlId) winnerBadges.push({ label: 'Best PnL', icon: <Trophy className="w-2.5 h-2.5" /> })
            if (run.id === bestSharpeId) winnerBadges.push({ label: 'Best Sharpe', icon: <Gauge className="w-2.5 h-2.5" /> })
            if (run.id === lowestDDId) winnerBadges.push({ label: 'Lowest DD', icon: <Shield className="w-2.5 h-2.5" /> })
            return (
              <Card
                key={run.id}
                className={clsx('cursor-pointer transition-all', isSel && 'ring-2 ring-accent-500/40')}
                onClick={() => toggle(run.id)}
              >
                <CardBody className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-text-primary truncate">{run.strategyName}</div>
                      <div className="text-xs text-text-muted truncate">
                        {getSignalLabel(run.ruleType)} · {run.universe} · {run.daysBack}d
                      </div>
                      {winnerBadges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {winnerBadges.map(b => (
                            <Badge key={b.label} tone="accent" size="xs" icon={b.icon}>{b.label}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={clsx(
                      'w-5 h-5 rounded ring-1 flex items-center justify-center shrink-0',
                      isSel
                        ? 'bg-accent-500 ring-accent-400'
                        : 'bg-bg-elevated ring-line-strong',
                    )}>
                      {isSel && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Stat size="sm" label="PnL" value={fmtPct(run.totalPnl)} tone={isWin ? 'bull' : 'bear'} />
                    <Stat size="sm" label="Win" value={`${run.winRate.toFixed(0)}%`} />
                    <Stat size="sm" label="Sharpe" value={run.sharpe.toFixed(2)} tone={run.sharpe > 1 ? 'bull' : run.sharpe < 0 ? 'bear' : 'neutral'} />
                    <Stat size="sm" label="MaxDD" value={`${run.maxDD.toFixed(1)}%`} tone={run.maxDD < 2 ? 'bull' : 'bear'} />
                  </div>
                </CardBody>
              </Card>
            )
          })
        })()}
      </div>
    </div>
  )
}

// ============================================================
// Compare view
// ============================================================
function Compare({ runs, onClear }: { runs: BacktestRun[]; onClear: () => void }) {
  if (runs.length < 2) {
    return (
      <Card><CardBody className="py-12 text-center text-text-muted">
        Pilih minimal 2 backtest run untuk dibandingkan.
      </CardBody></Card>
    )
  }

  // Find winners per metric
  const bestPnl = runs.reduce((b, r) => r.totalPnl > b.totalPnl ? r : b)
  const bestSharpe = runs.reduce((b, r) => r.sharpe > b.sharpe ? r : b)
  const lowestDD = runs.reduce((b, r) => r.maxDD < b.maxDD ? r : b)
  const bestWin = runs.reduce((b, r) => r.winRate > b.winRate ? r : b)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Compare runs"
          subtitle={`${runs.length} strategi · winners highlighted`}
          icon={<GitCompare className="w-4 h-4" />}
          action={<Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} onClick={onClear}>Clear</Button>}
        />
        <div className="overflow-x-auto pulse-scroll">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-text-muted border-b border-line">
                <th className="px-4 py-3 font-semibold">Metric</th>
                {runs.map(r => (
                  <th key={r.id} className="px-4 py-3 font-semibold text-right">{r.strategyName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Total PnL" runs={runs} format={r => fmtPct(r.totalPnl)} winner={bestPnl.id} winnerBadge="Best PnL" toneFn={r => r.totalPnl > 0 ? 'bull' : 'bear'} />
              <CompareRow label="Win Rate" runs={runs} format={r => `${r.winRate.toFixed(1)}%`} winner={bestWin.id} winnerBadge="Best Win" toneFn={r => r.winRate >= 50 ? 'bull' : 'bear'} />
              <CompareRow label="Sharpe" runs={runs} format={r => r.sharpe.toFixed(2)} winner={bestSharpe.id} winnerBadge="Best Sharpe" toneFn={r => r.sharpe > 1 ? 'bull' : r.sharpe < 0 ? 'bear' : 'neutral'} />
              <CompareRow label="Profit Factor" runs={runs} format={r => r.profitFactor.toFixed(2)} winner={runs.reduce((b, r) => r.profitFactor > b.profitFactor ? r : b).id} winnerBadge="Best PF" toneFn={r => r.profitFactor > 1 ? 'bull' : 'bear'} />
              <CompareRow label="Max Drawdown" runs={runs} format={r => `-${r.maxDD.toFixed(2)}%`} winner={lowestDD.id} winnerBadge="Lowest DD" toneFn={() => 'bear'} />
              <CompareRow label="Trades" runs={runs} format={r => `${r.nTrades}`} toneFn={() => 'neutral'} />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function CompareRow({ label, runs, format, winner, winnerBadge, toneFn }: {
  label: string
  runs: BacktestRun[]
  format: (r: BacktestRun) => string
  winner?: number
  winnerBadge?: string
  toneFn: (r: BacktestRun) => 'bull' | 'bear' | 'neutral'
}) {
  return (
    <tr className="border-b border-line last:border-0">
      <td className="px-4 py-3 font-medium text-text-secondary">{label}</td>
      {runs.map(r => {
        const t = toneFn(r)
        const isWinner = winner === r.id
        return (
          <td key={r.id} className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-2">
              {isWinner && winnerBadge && (
                <Badge tone="signal" size="xs" icon={<Trophy className="w-2.5 h-2.5" />}>{winnerBadge}</Badge>
              )}
              <span className={clsx(
                'num font-bold',
                t === 'bull' && 'text-bull-400',
                t === 'bear' && 'text-bear-400',
                t === 'neutral' && 'text-text-primary',
              )}>
                {format(r)}
              </span>
            </div>
          </td>
        )
      })}
    </tr>
  )
}

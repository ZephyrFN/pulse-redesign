/**
 * Pulse mock data — realistic crypto market data untuk design prototype.
 * Top 50 USDT pairs (subset of real Binance May 2026), coupled dengan
 * Indodax IDR price + signal/alert/backtest mocks.
 */

export type SignalType =
  | 'rsi_oversold'
  | 'rsi_overbought'
  | 'macd_bull_cross'
  | 'macd_bear_cross'
  | 'bb_breakout_lower'
  | 'bb_breakout_upper'
  | 'volume_spike'
  | 'price_above'
  | 'price_below'

export interface Coin {
  symbol: string         // BTCUSDT
  base: string           // BTC
  name: string           // Bitcoin
  rank: number
  price: number          // USDT
  change24h: number      // %
  change7d: number       // %
  volume24h: number      // USD
  volumeChange: number   // % vs 7d avg
  marketCap: number
  high24h: number
  low24h: number
  // Derived
  pinned: boolean
  // Indodax overlay (null = not listed)
  idrPrice: number | null
  premiumPct: number | null
  // Active signals
  activeSignals: SignalType[]
  // Sparkline (24h, 24 points)
  sparkline: number[]
}

export interface AlertEvent {
  id: number
  symbol: string
  ruleType: SignalType
  status: 'live' | 'backfill' | 'triggered' | 'muted' | 'error'
  triggeredAt: string  // ISO
  threshold?: string
  message: string
}

export interface SignalOutcome {
  id: number
  symbol: string
  ruleType: SignalType
  horizon: '24h' | '7d' | '30d'
  status: 'pending' | 'resolved' | 'no_data'
  pnlPct: number | null
  isWin: boolean | null
  evaluatedAt: string
}

export interface BacktestRun {
  id: number
  strategyName: string
  ruleType: SignalType
  universe: string
  daysBack: number
  totalPnl: number
  winRate: number
  profitFactor: number
  sharpe: number
  maxDD: number
  nTrades: number
  startedAt: string
}

// ============================================================
// Generate sparkline (smooth pseudo-random walk)
// ============================================================
function genSparkline(seed: number, base: number, vol: number, points = 24): number[] {
  const out: number[] = []
  let prev = base
  let s = seed
  for (let i = 0; i < points; i++) {
    s = (s * 9301 + 49297) % 233280
    const r = (s / 233280 - 0.5) * 2 // -1..1
    prev = prev * (1 + r * vol)
    out.push(prev)
  }
  return out
}

// ============================================================
// Top 50 coins (representative sample, ranks 1-50)
// ============================================================
export const COINS: Coin[] = [
  {
    symbol: 'BTCUSDT', base: 'BTC', name: 'Bitcoin', rank: 1,
    price: 84200.50, change24h: 2.34, change7d: 5.12,
    volume24h: 38_400_000_000, volumeChange: 18.5,
    marketCap: 1_660_000_000_000,
    high24h: 84890, low24h: 81920,
    pinned: true,
    idrPrice: 1_385_400_000, premiumPct: 0.18,
    activeSignals: ['macd_bull_cross', 'volume_spike'],
    sparkline: genSparkline(7, 82000, 0.008),
  },
  {
    symbol: 'ETHUSDT', base: 'ETH', name: 'Ethereum', rank: 2,
    price: 2289.40, change24h: 3.78, change7d: 8.92,
    volume24h: 18_200_000_000, volumeChange: 24.1,
    marketCap: 275_000_000_000,
    high24h: 2310, low24h: 2195,
    pinned: true,
    idrPrice: 37_680_000, premiumPct: 0.12,
    activeSignals: ['bb_breakout_lower', 'rsi_oversold'],
    sparkline: genSparkline(13, 2200, 0.012),
  },
  {
    symbol: 'SOLUSDT', base: 'SOL', name: 'Solana', rank: 5,
    price: 192.85, change24h: -4.21, change7d: 2.10,
    volume24h: 4_800_000_000, volumeChange: 38.2,
    marketCap: 92_000_000_000,
    high24h: 201.5, low24h: 191.2,
    pinned: false,
    idrPrice: 3_175_000, premiumPct: 0.34,
    activeSignals: ['rsi_overbought'],
    sparkline: genSparkline(19, 200, 0.018),
  },
  {
    symbol: 'BNBUSDT', base: 'BNB', name: 'BNB', rank: 4,
    price: 612.30, change24h: 0.42, change7d: 3.18,
    volume24h: 2_100_000_000, volumeChange: -2.5,
    marketCap: 88_000_000_000,
    high24h: 615.8, low24h: 605.1,
    pinned: false,
    idrPrice: 10_087_000, premiumPct: 0.08,
    activeSignals: [],
    sparkline: genSparkline(23, 610, 0.005),
  },
  {
    symbol: 'XRPUSDT', base: 'XRP', name: 'XRP', rank: 6,
    price: 2.412, change24h: 8.91, change7d: 14.20,
    volume24h: 8_900_000_000, volumeChange: 145.6,
    marketCap: 138_000_000_000,
    high24h: 2.485, low24h: 2.198,
    pinned: false,
    idrPrice: 39_710, premiumPct: 0.22,
    activeSignals: ['macd_bull_cross', 'volume_spike'],
    sparkline: genSparkline(29, 2.2, 0.025),
  },
  {
    symbol: 'DOGEUSDT', base: 'DOGE', name: 'Dogecoin', rank: 7,
    price: 0.1782, change24h: -6.84, change7d: -3.12,
    volume24h: 3_200_000_000, volumeChange: 52.1,
    marketCap: 26_400_000_000,
    high24h: 0.1924, low24h: 0.1768,
    pinned: false,
    idrPrice: 2_938, premiumPct: 0.45,
    activeSignals: ['rsi_oversold', 'bb_breakout_lower'],
    sparkline: genSparkline(31, 0.19, 0.022),
  },
  {
    symbol: 'ADAUSDT', base: 'ADA', name: 'Cardano', rank: 9,
    price: 0.842, change24h: 1.25, change7d: 4.30,
    volume24h: 980_000_000, volumeChange: 8.4,
    marketCap: 30_100_000_000,
    high24h: 0.851, low24h: 0.829,
    pinned: false,
    idrPrice: 13_870, premiumPct: 0.15,
    activeSignals: [],
    sparkline: genSparkline(37, 0.83, 0.012),
  },
  {
    symbol: 'AVAXUSDT', base: 'AVAX', name: 'Avalanche', rank: 12,
    price: 36.42, change24h: -2.18, change7d: 1.85,
    volume24h: 720_000_000, volumeChange: 14.2,
    marketCap: 14_900_000_000,
    high24h: 37.85, low24h: 36.10,
    pinned: false,
    idrPrice: 600_500, premiumPct: 0.28,
    activeSignals: ['macd_bear_cross'],
    sparkline: genSparkline(41, 37, 0.014),
  },
  {
    symbol: 'LINKUSDT', base: 'LINK', name: 'Chainlink', rank: 14,
    price: 21.85, change24h: 5.42, change7d: 12.80,
    volume24h: 1_400_000_000, volumeChange: 89.5,
    marketCap: 13_700_000_000,
    high24h: 22.10, low24h: 20.62,
    pinned: false,
    idrPrice: 360_200, premiumPct: 0.32,
    activeSignals: ['volume_spike'],
    sparkline: genSparkline(43, 21, 0.016),
  },
  {
    symbol: 'NEARUSDT', base: 'NEAR', name: 'NEAR Protocol', rank: 18,
    price: 5.42, change24h: -8.15, change7d: -12.40,
    volume24h: 480_000_000, volumeChange: 75.2,
    marketCap: 6_180_000_000,
    high24h: 5.98, low24h: 5.38,
    pinned: false,
    idrPrice: 89_250, premiumPct: 0.41,
    activeSignals: ['rsi_oversold', 'bb_breakout_lower'],
    sparkline: genSparkline(47, 5.85, 0.025),
  },
  {
    symbol: 'TONUSDT', base: 'TON', name: 'Toncoin', rank: 11,
    price: 5.18, change24h: 0.85, change7d: 2.42,
    volume24h: 280_000_000, volumeChange: -8.1,
    marketCap: 13_200_000_000,
    high24h: 5.22, low24h: 5.10,
    pinned: false,
    idrPrice: null, premiumPct: null,
    activeSignals: [],
    sparkline: genSparkline(53, 5.15, 0.008),
  },
  {
    symbol: 'SUIUSDT', base: 'SUI', name: 'Sui', rank: 15,
    price: 4.18, change24h: 12.45, change7d: 28.10,
    volume24h: 2_400_000_000, volumeChange: 218.5,
    marketCap: 12_400_000_000,
    high24h: 4.32, low24h: 3.65,
    pinned: false,
    idrPrice: 69_180, premiumPct: 0.52,
    activeSignals: ['bb_breakout_upper', 'volume_spike', 'rsi_overbought'],
    sparkline: genSparkline(59, 3.65, 0.028),
  },
  {
    symbol: 'DOTUSDT', base: 'DOT', name: 'Polkadot', rank: 17,
    price: 7.42, change24h: -1.85, change7d: 0.98,
    volume24h: 320_000_000, volumeChange: 5.2,
    marketCap: 11_400_000_000,
    high24h: 7.62, low24h: 7.38,
    pinned: false,
    idrPrice: 122_400, premiumPct: 0.18,
    activeSignals: [],
    sparkline: genSparkline(61, 7.5, 0.011),
  },
  {
    symbol: 'MATICUSDT', base: 'MATIC', name: 'Polygon', rank: 22,
    price: 0.4218, change24h: 3.42, change7d: 7.18,
    volume24h: 480_000_000, volumeChange: 28.4,
    marketCap: 4_200_000_000,
    high24h: 0.428, low24h: 0.408,
    pinned: false,
    idrPrice: 6_950, premiumPct: 0.21,
    activeSignals: ['macd_bull_cross'],
    sparkline: genSparkline(67, 0.41, 0.015),
  },
  {
    symbol: 'LTCUSDT', base: 'LTC', name: 'Litecoin', rank: 24,
    price: 84.20, change24h: -0.42, change7d: 2.10,
    volume24h: 480_000_000, volumeChange: -2.1,
    marketCap: 6_310_000_000,
    high24h: 85.10, low24h: 83.85,
    pinned: false,
    idrPrice: 1_388_000, premiumPct: 0.15,
    activeSignals: [],
    sparkline: genSparkline(71, 84, 0.008),
  },
  {
    symbol: 'ZECUSDT', base: 'ZEC', name: 'Zcash', rank: 38,
    price: 38.42, change24h: 18.92, change7d: 42.10,
    volume24h: 380_000_000, volumeChange: 412.5,
    marketCap: 620_000_000,
    high24h: 41.20, low24h: 32.10,
    pinned: false,
    idrPrice: 638_500, premiumPct: 0.85,
    activeSignals: ['bb_breakout_upper', 'volume_spike', 'rsi_overbought'],
    sparkline: genSparkline(73, 32, 0.035),
  },
  {
    symbol: 'INJUSDT', base: 'INJ', name: 'Injective', rank: 32,
    price: 14.85, change24h: -5.42, change7d: -8.20,
    volume24h: 220_000_000, volumeChange: 32.1,
    marketCap: 1_480_000_000,
    high24h: 15.85, low24h: 14.72,
    pinned: false,
    idrPrice: null, premiumPct: null,
    activeSignals: ['rsi_oversold'],
    sparkline: genSparkline(79, 16, 0.022),
  },
  {
    symbol: 'ARBUSDT', base: 'ARB', name: 'Arbitrum', rank: 28,
    price: 0.582, change24h: 2.15, change7d: 5.42,
    volume24h: 380_000_000, volumeChange: 18.4,
    marketCap: 2_650_000_000,
    high24h: 0.591, low24h: 0.568,
    pinned: false,
    idrPrice: 9_620, premiumPct: 0.25,
    activeSignals: [],
    sparkline: genSparkline(83, 0.57, 0.014),
  },
  {
    symbol: 'OPUSDT', base: 'OP', name: 'Optimism', rank: 36,
    price: 1.82, change24h: -3.20, change7d: -1.50,
    volume24h: 220_000_000, volumeChange: 12.8,
    marketCap: 2_180_000_000,
    high24h: 1.92, low24h: 1.81,
    pinned: false,
    idrPrice: 30_120, premiumPct: 0.32,
    activeSignals: [],
    sparkline: genSparkline(89, 1.85, 0.013),
  },
  {
    symbol: 'APTUSDT', base: 'APT', name: 'Aptos', rank: 31,
    price: 8.42, change24h: 4.85, change7d: 11.20,
    volume24h: 320_000_000, volumeChange: 68.5,
    marketCap: 4_910_000_000,
    high24h: 8.52, low24h: 8.02,
    pinned: false,
    idrPrice: 138_900, premiumPct: 0.28,
    activeSignals: ['macd_bull_cross', 'volume_spike'],
    sparkline: genSparkline(97, 8.0, 0.018),
  },
]

// ============================================================
// Mock alerts
// ============================================================
export const ALERTS: AlertEvent[] = [
  {
    id: 101, symbol: 'ETHUSDT', ruleType: 'rsi_oversold', status: 'triggered',
    triggeredAt: '2026-05-25T13:42:00Z',
    threshold: 'RSI < 30 (4h)',
    message: 'ETH RSI 28.4 — oversold zone. Mean reversion setup.',
  },
  {
    id: 102, symbol: 'BTCUSDT', ruleType: 'macd_bull_cross', status: 'live',
    triggeredAt: '2026-05-25T12:00:00Z',
    threshold: 'MACD bullish crossover (4h)',
    message: 'BTC MACD line crossed signal line upward.',
  },
  {
    id: 103, symbol: 'NEARUSDT', ruleType: 'bb_breakout_lower', status: 'triggered',
    triggeredAt: '2026-05-25T11:18:00Z',
    threshold: 'Price < BB lower band (4h)',
    message: 'NEAR tembus pita bawah Bollinger — possible bounce.',
  },
  {
    id: 104, symbol: 'XRPUSDT', ruleType: 'volume_spike', status: 'triggered',
    triggeredAt: '2026-05-25T10:30:00Z',
    threshold: 'Volume > 3x avg',
    message: 'XRP volume spike 145% above 7d average.',
  },
  {
    id: 105, symbol: 'SUIUSDT', ruleType: 'rsi_overbought', status: 'live',
    triggeredAt: '2026-05-25T09:00:00Z',
    threshold: 'RSI > 70 (4h)',
    message: 'SUI overbought — consider taking profit.',
  },
  {
    id: 106, symbol: 'DOGEUSDT', ruleType: 'rsi_oversold', status: 'muted',
    triggeredAt: '2026-05-25T08:00:00Z',
    threshold: 'RSI < 30 (4h)',
    message: 'DOGE RSI 29.1 — too volatile, muted.',
  },
  {
    id: 107, symbol: 'ZECUSDT', ruleType: 'volume_spike', status: 'triggered',
    triggeredAt: '2026-05-25T07:30:00Z',
    threshold: 'Volume > 5x avg',
    message: 'ZEC unusual volume — possible news catalyst.',
  },
  {
    id: 108, symbol: 'AVAXUSDT', ruleType: 'macd_bear_cross', status: 'backfill',
    triggeredAt: '2026-05-24T22:00:00Z',
    threshold: 'MACD bearish crossover (4h)',
    message: 'AVAX MACD bearish — momentum cooling.',
  },
]

// ============================================================
// Mock signal outcomes (for performance dashboard)
// ============================================================
export const SIGNAL_OUTCOMES: SignalOutcome[] = [
  { id: 1, symbol: 'BTCUSDT', ruleType: 'bb_breakout_lower', horizon: '30d', status: 'resolved', pnlPct: 18.42, isWin: true, evaluatedAt: '2026-05-25T10:00Z' },
  { id: 2, symbol: 'ETHUSDT', ruleType: 'bb_breakout_lower', horizon: '30d', status: 'resolved', pnlPct: 22.15, isWin: true, evaluatedAt: '2026-05-25T10:00Z' },
  { id: 3, symbol: 'SOLUSDT', ruleType: 'macd_bull_cross', horizon: '30d', status: 'resolved', pnlPct: 12.85, isWin: true, evaluatedAt: '2026-05-25T10:00Z' },
  { id: 4, symbol: 'NEARUSDT', ruleType: 'rsi_overbought', horizon: '30d', status: 'resolved', pnlPct: -18.42, isWin: false, evaluatedAt: '2026-05-25T10:00Z' },
  { id: 5, symbol: 'XRPUSDT', ruleType: 'volume_spike', horizon: '7d', status: 'pending', pnlPct: null, isWin: null, evaluatedAt: '2026-05-25T10:00Z' },
]

// ============================================================
// Mock backtest runs
// ============================================================
export const BACKTEST_RUNS: BacktestRun[] = [
  {
    id: 1, strategyName: 'BB Lower (long)', ruleType: 'bb_breakout_lower',
    universe: 'Top 10', daysBack: 30,
    totalPnl: 1.06, winRate: 30.8, profitFactor: 1.28, sharpe: 1.67, maxDD: 1.44,
    nTrades: 26, startedAt: '2026-05-24T15:30Z',
  },
  {
    id: 2, strategyName: 'MACD Bull Cross', ruleType: 'macd_bull_cross',
    universe: 'Top 10', daysBack: 30,
    totalPnl: -1.86, winRate: 17.2, profitFactor: 0.66, sharpe: -2.54, maxDD: 2.73,
    nTrades: 29, startedAt: '2026-05-24T15:35Z',
  },
  {
    id: 3, strategyName: 'RSI Oversold', ruleType: 'rsi_oversold',
    universe: 'Top 10', daysBack: 30,
    totalPnl: -0.88, winRate: 30.0, profitFactor: 0.51, sharpe: -3.33, maxDD: 1.54,
    nTrades: 10, startedAt: '2026-05-24T15:40Z',
  },
]

// ============================================================
// Universe stats (for Market Radar)
// ============================================================
export const MARKET_STATS = {
  totalCoins: COINS.length,
  gainers24h: COINS.filter(c => c.change24h > 0).length,
  losers24h: COINS.filter(c => c.change24h < 0).length,
  totalVolume: COINS.reduce((s, c) => s + c.volume24h, 0),
  activeAlerts: ALERTS.filter(a => a.status === 'live' || a.status === 'triggered').length,
  lastRefresh: new Date(Date.now() - 12_000), // 12s ago
}

// ============================================================
// Helpers
// ============================================================
export function getCoin(symbol: string): Coin | undefined {
  return COINS.find(c => c.symbol === symbol)
}

export function getSignalLabel(s: SignalType): string {
  const labels: Record<SignalType, string> = {
    rsi_oversold: 'RSI Oversold',
    rsi_overbought: 'RSI Overbought',
    macd_bull_cross: 'MACD Bull',
    macd_bear_cross: 'MACD Bear',
    bb_breakout_lower: 'BB Lower',
    bb_breakout_upper: 'BB Upper',
    volume_spike: 'Volume Spike',
    price_above: 'Price Above',
    price_below: 'Price Below',
  }
  return labels[s]
}

export function getSignalDirection(s: SignalType): 'long' | 'short' | 'neutral' {
  if (['rsi_oversold', 'macd_bull_cross', 'bb_breakout_lower'].includes(s)) return 'long'
  if (['rsi_overbought', 'macd_bear_cross', 'bb_breakout_upper'].includes(s)) return 'short'
  return 'neutral'
}

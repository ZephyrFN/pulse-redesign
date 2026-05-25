import { BarChart3, Bell, FlaskConical, LineChart, Star } from 'lucide-react'
import { Placeholder } from '../components/Placeholder'

export function WatchlistPage() {
  return <Placeholder
    title="Watchlist"
    description="Coin cards dengan technical summary, premium, dan CTA — Phase 6.3."
    icon={Star}
    phase="Phase 6.3 — pending"
  />
}

export function AlertsPage() {
  return <Placeholder
    title="Alerts"
    description="Alert builder simple + advanced mode dengan natural language preview — Phase 6.4."
    icon={Bell}
    phase="Phase 6.4 — pending"
  />
}

export function PerformancePage() {
  return <Placeholder
    title="Performance"
    description="Best/worst signal, long vs short, heatmap, confidence badge — Phase 6.4."
    icon={BarChart3}
    phase="Phase 6.4 — pending"
  />
}

export function BacktestPage() {
  return <Placeholder
    title="Backtest"
    description="5-step wizard, result cards, comparison badges — Phase 6.5."
    icon={FlaskConical}
    phase="Phase 6.5 — pending"
  />
}

export function CoinDetailPage() {
  return <Placeholder
    title="Coin detail"
    description="5 tabs: Overview, Signals, Alerts, Backtests, Indodax Premium — Phase 6.3."
    icon={LineChart}
    phase="Phase 6.3 — pending"
  />
}

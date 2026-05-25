import { NavLink, Outlet } from 'react-router-dom'
import {
  Activity, BarChart3, Bell, FlaskConical, LayoutDashboard, LineChart, Star,
} from 'lucide-react'
import clsx from 'clsx'
import { MARKET_STATS } from '../data/mock'
import { timeAgo } from '../lib/format'
import { useEffect, useState } from 'react'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/watchlist', label: 'Watchlist', icon: Star },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/performance', label: 'Performance', icon: BarChart3 },
  { to: '/backtest', label: 'Backtest', icon: FlaskConical },
]

function FreshnessIndicator() {
  const [, force] = useState(0)
  useEffect(() => {
    const t = setInterval(() => force(x => x + 1), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bull-500/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-bull-500" />
      </span>
      <span className="text-text-muted">
        Live · refresh {timeAgo(MARKET_STATS.lastRefresh)}
      </span>
    </div>
  )
}

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg-base/70 backdrop-blur-xl">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Activity className="w-6 h-6 text-signal-400" strokeWidth={2.5} />
              <div className="absolute inset-0 blur-md bg-signal-500/40 -z-10" />
            </div>
            <div className="font-bold tracking-tight text-text-primary">Pulse</div>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-text-muted px-1.5 py-0.5 rounded bg-bg-elevated ring-1 ring-line">
              Terminal
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 ml-2">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => clsx(
                  'flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-bg-elevated text-text-primary ring-1 ring-line-strong'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-overlay/40',
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />
          <FreshnessIndicator />
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden border-t border-line overflow-x-auto pulse-scroll">
          <div className="flex gap-1 p-2 min-w-max">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => clsx(
                  'flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-colors shrink-0',
                  isActive
                    ? 'bg-bg-elevated text-text-primary ring-1 ring-line-strong'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-4">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <LineChart className="w-3.5 h-3.5" />
            <span>Pulse Redesign · Phase 6.3</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Mock data · No backend</span>
            <span className="hidden sm:inline">Past performance ≠ future result</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

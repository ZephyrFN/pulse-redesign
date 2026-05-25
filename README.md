# Pulse Redesign

Modern crypto market terminal — UI/UX redesign of [Pulse](https://pulse.appworks.info/).

> **Status:** Design prototype complete. 7 pages × ~30 components. Mock data, no backend.

## Demo

- 📊 **Dashboard** — Market Radar (6 cards) + Top Movers table (filter chips, search, badges, sparklines, range bars)
- ⭐ **Watchlist** — Rich coin cards with technical readouts, premium info, CTA stack
- 🔔 **Alerts** — Builder with simple/advanced mode + natural language preview, status filtering, hover actions
- 📈 **Performance** — Best/worst hero, long vs short comparison, performance heatmap, confidence-tiered detail table
- 🔬 **Backtest** — 5-step wizard (Strategy → Universe → Risk → Review → Results), runs list, side-by-side comparison
- 📑 **Coin Detail** — 5 tabs (Overview, Signals, Alerts, Backtests, Indodax Premium)

## Stack

- **Vite 8** + **React 19** + **TypeScript 6**
- **Tailwind CSS 3** with custom design tokens
- **React Router 7** for client-side routing
- **lucide-react** for icons
- **Inter** + **JetBrains Mono** via Google Fonts

## Run

```bash
pnpm install
pnpm dev   # opens at http://localhost:5173
```

## Architecture

```
src/
├── components/
│   ├── ui/              # Card, Badge, Button, FilterChip, Stat, Sparkline, RangeBar
│   ├── dashboard/       # MarketRadar, TopMovers
│   └── watchlist/       # CoinCard
├── data/
│   └── mock.ts          # Realistic 20 coins, alerts, signals, backtest runs, perf stats
├── layout/
│   └── AppShell.tsx     # Top nav, footer, freshness indicator
├── lib/
│   └── format.ts        # Number/price/percent/timeAgo helpers
├── pages/
│   ├── Dashboard.tsx
│   ├── Watchlist.tsx
│   ├── Alerts.tsx       # + AlertBuilder (Simple/Advanced)
│   ├── Performance.tsx  # + Heatmap, hero, comparison
│   ├── Backtest.tsx     # 5-step wizard + Compare view
│   └── CoinDetail.tsx   # 5-tab layout
├── App.tsx              # Routes
└── main.tsx
```

## Design system

| Token | Use |
|---|---|
| `bg-base` `bg-surface` `bg-elevated` `bg-overlay` | Layered surfaces |
| `bull` (emerald) `bear` (rose) | Price up / down |
| `warn` (amber) | Premium / risk |
| `signal` (violet) | Active signal / accent |
| `info` (sky) | Informational |
| `text-primary` `text-secondary` `text-muted` `text-dim` | 4-tier text contrast |

### Composable utilities

- `.glass` `.glass-elevated` — Card surfaces with backdrop blur
- `.hover-surface` — Subtle row hover
- `.skeleton` — Shimmer loading
- `.pulse-scroll` — Themed scrollbar
- `.num` — Tabular numerals (mono font)

## UX principles applied

1. **Live freshness indicator** — pulsing dot in nav shows last refresh
2. **5-second comprehension** — Market Radar surfaces top 6 actionable signals
3. **Every insight has a next action** — coin row → detail/alert/backtest CTA
4. **Sample-size confidence** — Performance table dims low-n rows with warning icon
5. **Progressive disclosure** — Backtest wizard breaks complex form into 5 steps
6. **Empty states** — Every list/grid has explanatory empty state with primary CTA
7. **Status separation** — Alerts use distinct badges for LIVE/BACKFILL/TRIGGERED/MUTED/ERROR
8. **Bilingual hybrid** — Narration in Indonesian, technical terms (Sharpe, PF, MDD) in English

## Phase log

- ✅ **6.1** Scaffold + design tokens + base components + mock data
- ✅ **6.2** Dashboard (Market Radar + Top Movers)
- ✅ **6.3** Watchlist cards + Coin detail (5 tabs)
- ✅ **6.4** Alert builder + Performance redesign
- ✅ **6.5** Backtest 5-step wizard + comparison

## License

Private prototype.

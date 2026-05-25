# Pulse Redesign

Modern crypto market terminal — UI/UX redesign dari [Pulse](https://pulse.appworks.info/).

> **Status:** design prototype (mock data, no backend). Phase 6.1 scaffold ✅.

## Stack

- **Vite 8** + **React 19** + **TypeScript 6**
- **Tailwind CSS 3** with custom design tokens
- **React Router 7** for client-side routing
- **lucide-react** for icons
- **Inter** + **JetBrains Mono** via Google Fonts

## Run

```bash
pnpm install
pnpm dev   # opens at http://localhost:5173 (or 8294 if specified)
```

## Architecture

```
src/
├── components/
│   ├── ui/          # Card, Badge, Button, FilterChip, Stat, Sparkline, RangeBar
│   └── Placeholder.tsx
├── data/
│   └── mock.ts      # Realistic mock coins, alerts, signals, backtest runs
├── layout/
│   └── AppShell.tsx # Top nav, footer, freshness indicator
├── lib/
│   └── format.ts    # Number/price/percent/timeAgo helpers
├── pages/
│   └── Placeholders.tsx
├── App.tsx          # Routes
└── main.tsx
```

## Design system

| Token | Hex | Use |
|---|---|---|
| `bg-base` | #06060d | Page background |
| `bg-surface` | #0c0c1a | Card |
| `bg-elevated` | #13132a | Elevated card |
| `bull` | #10b981 | Positive (price up) |
| `bear` | #f43f5e | Negative (price down) |
| `warn` | #f59e0b | Premium / risk |
| `signal` | #8b5cf6 | Active signal / accent |
| `info` | #0ea5e9 | Info |

## Phase roadmap

- [x] **6.1** — Scaffold + design tokens + base components + mock data + layout shell
- [ ] **6.2** — Dashboard: Market Radar + Top Movers redesign
- [ ] **6.3** — Watchlist cards + Coin detail page (5 tabs)
- [ ] **6.4** — Alert builder (simple + advanced) + Performance redesign
- [ ] **6.5** — Backtest 5-step wizard + comparison + polish

## License

Private prototype.

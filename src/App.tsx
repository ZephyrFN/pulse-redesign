import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Watchlist } from './pages/Watchlist'
import { CoinDetail } from './pages/CoinDetail'
import {
  AlertsPage, BacktestPage, PerformancePage,
} from './pages/Placeholders'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/backtest" element={<BacktestPage />} />
          <Route path="/coin/:symbol" element={<CoinDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

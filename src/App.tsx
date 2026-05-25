import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import {
  AlertsPage, BacktestPage, CoinDetailPage, PerformancePage, WatchlistPage,
} from './pages/Placeholders'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/backtest" element={<BacktestPage />} />
          <Route path="/coin/:symbol" element={<CoinDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

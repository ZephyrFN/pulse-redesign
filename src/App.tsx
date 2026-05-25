import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import {
  AlertsPage, BacktestPage, CoinDetailPage, DashboardPage, PerformancePage, WatchlistPage,
} from './pages/Placeholders'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
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

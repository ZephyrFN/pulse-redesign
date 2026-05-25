import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Watchlist } from './pages/Watchlist'
import { CoinDetail } from './pages/CoinDetail'
import { Alerts } from './pages/Alerts'
import { Performance } from './pages/Performance'
import { Backtest } from './pages/Backtest'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/backtest" element={<Backtest />} />
          <Route path="/coin/:symbol" element={<CoinDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

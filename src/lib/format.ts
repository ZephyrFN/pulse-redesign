/** Number / price / percent / volume formatters. */

const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 })
const idrFormatter = new Intl.NumberFormat('id-ID')

export function fmtPrice(n: number, decimals?: number): string {
  if (decimals !== undefined) return n.toFixed(decimals)
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (n >= 1) return n.toFixed(3)
  if (n >= 0.01) return n.toFixed(4)
  return n.toFixed(6)
}

export function fmtIdr(n: number): string {
  return 'Rp ' + idrFormatter.format(Math.round(n))
}

export function fmtPct(n: number, withSign = true): string {
  const s = n.toFixed(2)
  if (!withSign) return `${s}%`
  return `${n >= 0 ? '+' : ''}${s}%`
}

export function fmtVol(n: number): string {
  return '$' + compactFormatter.format(n)
}

export function fmtMcap(n: number): string {
  return '$' + compactFormatter.format(n)
}

/** Time ago string: "12 detik lalu", "5 menit lalu", "2 jam lalu" */
export function timeAgo(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}d lalu`
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m lalu`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}j lalu`
  const days = Math.floor(hrs / 24)
  return `${days}h lalu`
}

/** Tone helper: bull/bear based on number sign */
export function tone(n: number): 'bull' | 'bear' | 'neutral' {
  if (n > 0) return 'bull'
  if (n < 0) return 'bear'
  return 'neutral'
}

/** Range bar position (0-100) given current price + low + high. */
export function rangePosition(price: number, low: number, high: number): number {
  if (high === low) return 50
  return Math.max(0, Math.min(100, ((price - low) / (high - low)) * 100))
}

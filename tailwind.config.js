/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pulse design tokens
        bg: {
          base: '#06060d',     // page background
          surface: '#0c0c1a',  // card background
          elevated: '#13132a', // elevated card
          overlay: '#1a1a35',  // hover/active overlay
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.12)',
          accent: 'rgba(99,102,241,0.35)',
        },
        // Semantic
        bull: {
          50: '#ecfdf5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          950: 'rgba(16,185,129,0.10)',
        },
        bear: {
          50: '#fff1f2',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          950: 'rgba(244,63,94,0.10)',
        },
        warn: {
          400: '#fbbf24',
          500: '#f59e0b',
          950: 'rgba(245,158,11,0.10)',
        },
        signal: {
          400: '#a78bfa',
          500: '#8b5cf6',
          950: 'rgba(139,92,246,0.10)',
        },
        info: {
          400: '#38bdf8',
          500: '#0ea5e9',
          950: 'rgba(14,165,233,0.10)',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          muted: '#64748b',
          dim: '#475569',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-sm': '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glow-bull': '0 0 24px rgba(16,185,129,0.25)',
        'glow-bear': '0 0 24px rgba(244,63,94,0.25)',
        'glow-signal': '0 0 24px rgba(139,92,246,0.25)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

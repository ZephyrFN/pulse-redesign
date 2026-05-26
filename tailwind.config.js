/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pulse design tokens — Command Center
        bg: {
          base: '#050814',     // near-black with blue undertone
          surface: '#0f1420',  // card background
          elevated: '#131826', // elevated card
          overlay: '#1a1f2e',  // hover/active overlay
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.10)',
          accent: 'rgba(34,211,238,0.30)',
        },
        // Semantic
        bull: {
          50: '#ecfdf5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          950: 'rgba(16,185,129,0.15)',
        },
        bear: {
          50: '#fff1f2',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          950: 'rgba(244,63,94,0.15)',
        },
        warn: {
          400: '#fbbf24',
          500: '#f59e0b',
          950: 'rgba(245,158,11,0.15)',
        },
        signal: {
          400: '#a78bfa',
          500: '#8b5cf6',
          950: 'rgba(139,92,246,0.18)',
        },
        info: {
          400: '#22d3ee',
          500: '#06b6d4',
          950: 'rgba(34,211,238,0.15)',
        },
        // Cyan = primary accent (CTAs, range bars, "All" chip)
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          950: 'rgba(34,211,238,0.15)',
        },
        text: {
          primary: '#F5F7FA',
          secondary: '#9AA3B2',
          muted: '#7B8392',
          dim: '#5C6473',
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
        'glass-sm': '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'glow-bull': '0 0 24px rgba(16,185,129,0.25)',
        'glow-bear': '0 0 24px rgba(244,63,94,0.25)',
        'glow-signal': '0 0 24px rgba(139,92,246,0.25)',
        'glow-accent': '0 0 24px rgba(34,211,238,0.25)',
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

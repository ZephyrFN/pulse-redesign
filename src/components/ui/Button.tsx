import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'soft' | 'outline' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
}

const VARIANTS = {
  primary:
    'bg-signal-500 hover:bg-signal-400 text-white shadow-sm shadow-signal-500/30 ring-1 ring-signal-400/30',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-bg-overlay/60',
  soft:
    'bg-bg-elevated hover:bg-bg-overlay text-text-primary ring-1 ring-inset ring-line-strong',
  outline:
    'text-text-primary ring-1 ring-line-strong hover:bg-bg-overlay/40',
  danger:
    'bg-bear-500 hover:bg-bear-400 text-white ring-1 ring-bear-400/30',
}

const SIZES = {
  xs: 'h-6 text-[11px] px-2 gap-1',
  sm: 'h-8 text-xs px-3 gap-1.5',
  md: 'h-10 text-sm px-4 gap-2',
  lg: 'h-12 text-base px-5 gap-2',
}

export function Button({
  children,
  variant = 'soft',
  size = 'md',
  icon,
  iconRight,
  loading,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
      {iconRight}
    </button>
  )
}

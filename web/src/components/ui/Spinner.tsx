import React from 'react'

interface SpinnerProps {
  variant?: 'small' | 'medium' | 'large'
  /** Fill the available space (min 40vh) instead of just wrapping the icon */
  fill?: boolean
}

export default function Spinner({
  variant = 'medium',
  fill = true,
}: SpinnerProps) {
  const size =
    variant === 'small'
      ? 'h-5 w-5 border-2'
      : variant === 'medium'
        ? 'h-8 w-8 border-[3px]'
        : 'h-12 w-12 border-4'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`grid place-items-center ${fill ? 'min-h-[40vh]' : ''}`}
    >
      <div
        className={`${size} animate-spin rounded-full border-slate-200 border-t-slate-600`}
      />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

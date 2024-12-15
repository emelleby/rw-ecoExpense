import React from 'react'

interface SpinnerProps {
  variant?: 'small' | 'medium' | 'large'
}

export default function Spinner({ variant = 'large' }: SpinnerProps) {
  const size =
    variant === 'small'
      ? 'w-8 h-8'
      : variant === 'medium'
        ? 'w-12 h-12'
        : 'w-16 h-16'

  return (
    <div className="grid h-full place-items-center">
      <div
        style={{ borderTopColor: 'transparent' }}
        className={`${size} animate-spin rounded-full border-4 border-slate-800`}
      ></div>
    </div>
  )
}

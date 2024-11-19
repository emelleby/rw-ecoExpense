import * as React from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'light'
  )

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}

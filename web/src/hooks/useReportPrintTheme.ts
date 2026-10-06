import { useEffect } from 'react'

/**
 * Forces an unthemed (light, print-white) document for report pages.
 * Strips the theme classes from <html> while mounted and tags it with
 * `print-report`, which index.css uses to paint a white background on
 * print. Restores the original theme classes on unmount.
 */
export function useReportPrintTheme() {
  useEffect(() => {
    const htmlElement = document.documentElement
    const currentTheme = htmlElement.classList.contains('dark')
      ? 'dark'
      : 'light'

    // Store any theme-related classes
    const themeClasses = [...htmlElement.classList].filter(
      (cls) => cls === 'dark' || cls === 'light' || cls.startsWith('theme-')
    )

    // Remove all theme-related classes
    themeClasses.forEach((cls) => htmlElement.classList.remove(cls))

    // Tag the document so print styles can target it
    htmlElement.classList.add('print-report')

    // Restore the original theme when the report unmounts
    return () => {
      htmlElement.classList.remove('print-report')

      if (currentTheme === 'dark') {
        htmlElement.classList.add('dark')
      } else {
        htmlElement.classList.add('light')
      }
    }
  }, [])
}

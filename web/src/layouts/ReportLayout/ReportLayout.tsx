import { useEffect } from 'react'

import { Link, routes } from '@redwoodjs/router'

type ReportLayoutProps = {
  children?: React.ReactNode
  title?: string
}

const ReportLayout = ({
  children,
  title = 'Trip Report',
}: ReportLayoutProps) => {
  // Remove all theming for the report page, especially for printing
  useEffect(() => {
    // Save the current theme
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

    // Add a print-specific class
    htmlElement.classList.add('print-report')

    // Add a style tag for print media
    const styleTag = document.createElement('style')
    styleTag.id = 'print-report-style'
    styleTag.innerHTML = `
      @media print {
        html.print-report,
        html.print-report body {
          background-color: white !important;
          color: black !important;
        }
      }
    `
    document.head.appendChild(styleTag)

    // Restore the original theme when component unmounts
    return () => {
      // Remove the print-specific class and style
      htmlElement.classList.remove('print-report')
      const styleElement = document.getElementById('print-report-style')
      if (styleElement) styleElement.remove()

      // Restore original theme classes
      if (currentTheme === 'dark') {
        htmlElement.classList.add('dark')
      } else {
        htmlElement.classList.add('light')
      }
    }
  }, [])

  return (
    <div className="rw-scaffold min-h-screen">
      {/* Header - will be hidden when printing */}
      <header className="sticky top-0 z-50 w-full border-b bg-slate-50 print:hidden">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link
              to={routes.trips()}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Trips
            </Link>
          </div>
          <div>
            <button
              onClick={() => window.print()}
              className="flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Report
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto pb-6 pt-4 print:bg-white print:text-black">
        {title && (
          <h1 className="mb-4 text-center text-3xl font-bold print:mb-2">
            {title}
          </h1>
        )}
        {children}
      </main>

      {/* No custom styles - using Tailwind's print: variants instead */}
    </div>
  )
}

export default ReportLayout

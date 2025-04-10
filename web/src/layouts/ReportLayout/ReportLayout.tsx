import { Link, routes } from '@redwoodjs/router'
import { useEffect } from 'react'

type ReportLayoutProps = {
  children?: React.ReactNode
  title?: string
}

const ReportLayout = ({ children, title = 'Trip Report' }: ReportLayoutProps) => {
  // Force light mode for the report page
  useEffect(() => {
    // Save the current theme
    const htmlElement = document.documentElement
    const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light'

    // Force light mode
    htmlElement.classList.remove('dark')

    // Restore the original theme when component unmounts
    return () => {
      if (currentTheme === 'dark') {
        htmlElement.classList.add('dark')
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header - will be hidden when printing */}
      <header className="border-b print:hidden">
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
      <main className="container mx-auto py-8">
        {title && (
          <h1 className="mb-8 text-center text-3xl font-bold print:mb-4">{title}</h1>
        )}
        {children}
      </main>

      {/* No custom styles - using Tailwind's print: variants instead */}
    </div>
  )
}

export default ReportLayout

import { UserButton } from '@clerk/clerk-react'
import { Moon, Sun } from 'lucide-react'

import { Link, routes, useLocation } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import { Button } from '@/components/ui/Button'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/Sidebar'
import { useTheme } from '@/hooks/useTheme'
import { AppSidebar } from '@/layouts/AppSidebar'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-16 w-16 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
type AppshellLayoutProps = {
  title: string
  titleTo?: keyof typeof routes
  children?: React.ReactNode
}

// Map of route names to page titles
const pageTitles: Record<string, string> = {
  homey: 'Home Dashboard',
  profile: 'My Profile',
  test: 'Test Page',
  newExpense: 'Add Expense',
  expenses: 'Expenses',
  projects: 'Projects',
  newProject: 'New Project',
  // Add more routes as needed
}

const AppshellLayout = ({ title, titleTo, children }: AppshellLayoutProps) => {
  // Get the current location to determine the route name
  const { pathname } = useLocation()

  // Find the route name based on the current pathname
  const currentRouteName = Object.keys(routes).find((routeName) => {
    try {
      // This will throw an error if the route requires parameters
      const routePath = routes[routeName as keyof typeof routes]()
      return pathname === routePath
    } catch {
      return false
    }
  }) as keyof typeof routes | undefined

  // Get the page title from the map, or use the default title
  const pageTitle = currentRouteName
    ? pageTitles[currentRouteName] || title
    : title

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col">
        <header className="flex h-14 items-center justify-between border-b pr-4">
          <div className="flex items-center">
            <SidebarTrigger aria-label="Toggle Sidebar" title="Menu" />
          </div>

          {/* titleTo is passed from Routes */}
          <h1 className="rw-heading rw-heading-primary">
            {titleTo ? (
              <Link to={routes[titleTo]()} className="rw-link underline">
                {pageTitle}
              </Link>
            ) : (
              pageTitle
            )}
          </h1>

          <div className="flex items-center gap-x-2">
            <ThemeToggle />
            <UserButton />
            <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
          </div>
        </header>
        <main className="container my-2 max-w-6xl flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}

export default AppshellLayout

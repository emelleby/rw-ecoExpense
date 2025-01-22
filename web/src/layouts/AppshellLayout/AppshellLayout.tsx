import { UserButton } from '@clerk/clerk-react'
import { Moon, Sun } from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import { Button } from '@/components/ui/button'
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

const AppshellLayout = ({ title, titleTo, children }: AppshellLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col">
        <header className="flex h-14 items-center justify-between border-b pr-4">
          <div className="flex items-center">
            <SidebarTrigger />
          </div>

          <h1 className="rw-heading rw-heading-primary">
            {titleTo ? (
              <Link to={routes[titleTo]()} className="rw-link underline">
                {title}
              </Link>
            ) : (
              title
            )}
          </h1>

          <div className="flex items-center">
            <ThemeToggle />
            <UserButton />
            <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
          </div>
        </header>
        <main className="container max-w-6xl flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}

export default AppshellLayout

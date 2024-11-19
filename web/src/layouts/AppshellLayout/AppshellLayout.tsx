type AppshellLayoutProps = {
  children?: React.ReactNode
}

import { Moon, Sun } from 'lucide-react'

import { AppSidebar } from 'src/layouts/AppSidebar'

import { Button } from '@/components/ui/Button'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/Sidebar'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

const AppshellLayout = ({ children }: AppshellLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-screen w-full flex-col">
        <header className="flex h-14 items-center justify-between border-b pr-4">
          <div className="flex items-center">
            <SidebarTrigger />
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </header>
        <main className="container max-w-6xl flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}

export default AppshellLayout

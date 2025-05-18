import { UserButton } from '@clerk/clerk-react'
import { Moon, Sun } from 'lucide-react'
import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import { Button } from '@/components/ui/Button'
import { useTheme } from '@/hooks/useTheme'

type TaskLayoutProps = {
  title: string
  children?: React.ReactNode
}

// Theme toggle component
function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

const TaskLayout = ({ title, children }: TaskLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="flex h-14 items-center justify-between border-b border-border px-4">
        <Link to={routes.homey()} className="text-foreground hover:text-primary">
          Home
        </Link>
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-x-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </header>
      <main className="container mx-auto my-4 max-w-6xl px-4">{children}</main>
    </div>
  )
}

export default TaskLayout


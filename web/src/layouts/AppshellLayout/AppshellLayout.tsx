type AppshellLayoutProps = {
  children?: React.ReactNode
}
import { AppSidebar } from 'src/layouts/AppSidebar'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/Sidebar'

const AppshellLayout = ({ children }: AppshellLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default AppshellLayout

import * as React from 'react'

// import { UserButton } from '@clerk/clerk-react'
import {
  AudioWaveform,
  Home,
  Inbox,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  FolderOpenDot,
  FlaskRound,
  User2Icon,
  UserCircle
} from 'lucide-react'

import { NavLink, Link, routes } from '@redwoodjs/router'
import { useLocation } from '@redwoodjs/router'
import { useApolloClient } from '@apollo/client'

import { QUERY as EXPENSES_QUERY } from 'src/components/Expense/ExpensesCell/ExpensesCell'
import { QUERY as NEW_EXPENSE_QUERY } from 'src/components/Expense/NewExpenseCell/NewExpenseCell'

import { useAuth } from 'src/auth'
import { NavMain } from 'src/components/NavMain'
import { NavProjects } from 'src/components/NavProjects'
import { TeamSwitcher } from 'src/components/TeamSwitcher'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from 'src/components/ui/Sidebar'
import UserSidebarGroupCell from 'src/components/UserSidebarGroup/UserSidebarGroupCell'

// Menu items.
const items = [
  {
    title: 'Home',
    url: 'homey',
    icon: Home,
  },
  {
    title: 'Add Expense',
    url: 'newExpense',
    icon: Inbox,
  },
  {
    title: 'Expenses',
    url: 'expenses',
    icon: BookOpen,
  },
  {
    title: 'Profile',
    url: 'profile',
    icon: UserCircle,
  },
]
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    // {
    //   title: 'Building Your Application',
    //   url: 'home',
    // },
    {
      title: 'Tools',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      role: 'admin',
      items: [
        {
          title: 'Users',
          url: 'users',
        },
        // {
        //   title: 'New Trip',
        //   url: 'newTrip',
        // },
      ],
    },

    {
      title: 'Superuser',
      url: '#',
      icon: Settings2,
      role: 'superuser',
      items: [
        {
          title: 'Test',
          url: 'test',
        },
        {
          title: 'Organizations',
          url: 'organizations',
        },
        {
          title: 'Sectors',
          url: 'sectors',
        },
        {
          title: 'Tasks',
          url: 'tasks',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Home',
      url: 'http://localhost:8910/home',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile, state } = useSidebar()
  const { pathname } = useLocation()
  const { hasRole, userMetadata } = useAuth()
  // console.log('userMetadata', userMetadata)
  const user = {
    name: userMetadata.firstName
      ? userMetadata.firstName
      : userMetadata.username,
    email: userMetadata.emailAddresses[0].emailAddress,
  }

  const client = useApolloClient()

  // Warm the page chunk (and Apollo cache where cheap) so navigation is instant
  const prefetch = {
    homey: () => import('src/pages/HomePage/HomePage'),
    profile: () => import('src/pages/ProfilePage/ProfilePage'),
    expenses: () => {
      import('src/pages/Expense/ExpensesPage/ExpensesPage')
      client.query({ query: EXPENSES_QUERY }).catch(() => {})
    },
    newExpense: () => {
      import('src/pages/Expense/NewExpensePage/NewExpensePage')
      client.query({ query: NEW_EXPENSE_QUERY }).catch(() => {})
    },
  }

  const handleLinkClick = () => {
    setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-0">
        {/* <TeamSwitcher teams={data.teams} /> */}
        {state === 'expanded' ? (
          <>
            <h1 className="mt-2 px-2 text-lg font-semibold">
              Welcome, {user.name}
            </h1>
            <p className="mb-4 px-2 text-sm text-muted-foreground">
              {user.email}
            </p>
          </>
        ) : (
          <div
            className="flex h-16 items-center justify-center"
            aria-label={`Welcome ${user.name}`}
          >
            <User2Icon size={32} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map(
            (item) =>
              (!item.onlyAdmin || hasRole('admin')) && (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={pathname === routes[item.url]()}
                    className="pl-4"
                  >
                    <Link
                      to={routes[item.url]()}
                      onClick={handleLinkClick}
                      onMouseEnter={prefetch[item.url]}
                      onFocus={prefetch[item.url]}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
          )}
        </SidebarMenu>
        <UserSidebarGroupCell />
        {hasRole('admin') && <NavMain items={data.navMain} />}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <UserButton /> */}
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

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
} from 'lucide-react'

import { NavLink, Link, routes } from '@redwoodjs/router'
import { useLocation } from '@redwoodjs/router'

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
  SidebarMenuAction,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from 'src/components/ui/Sidebar'
import UserSidebarGroupCell from 'src/components/UserSidebarGroup/UserSidebarGroupCell/UserSidebarGroupCell'

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
      title: 'Homepage',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Test',
          url: 'test',
        },
        // {
        //   title: 'Expenses',
        //   url: 'expenses',
        // },
        // {
        //   title: 'New Trip',
        //   url: 'newTrip',
        // },
      ],
    },

    {
      title: 'Settings2',
      url: 'trips',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: 'trips',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
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
  const { setOpenMobile } = useSidebar()
  const { pathname } = useLocation()
  const { hasRole, userMetadata } = useAuth()
  const user = {
    name: userMetadata.firstName
      ? userMetadata.firstName
      : userMetadata.username,
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  }

  const handleLinkClick = () => {
    setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-0">
        {/* <TeamSwitcher teams={data.teams} /> */}
        <h1 className="mt-2 px-2 text-lg font-semibold">
          Welcome, {user.name}
        </h1>
        <p className="mb-4 px-2 text-sm text-muted-foreground">{user.email}</p>
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
                    <Link to={routes[item.url]()} onClick={handleLinkClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-500" />
                </SidebarMenuItem>
              )
          )}
        </SidebarMenu>
        <UserSidebarGroupCell />
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <UserButton /> */}
        {/* <NavUser user={data.user} /> */}
        {hasRole('superuser') && (
          <div className="flex flex-col space-y-4">
            <NavLink
              to={routes.organizations()}
              className="text-gray-400"
              activeClassName="text-gray-900"
            >
              Manage Organizations
            </NavLink>
            <NavLink
              to={routes.sectors()}
              className="text-gray-400"
              activeClassName="text-gray-900"
            >
              Manage Sectors
            </NavLink>
            {/* Add more NavLinks as needed */}
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

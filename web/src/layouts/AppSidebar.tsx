import * as React from 'react'

// import { UserButton } from '@clerk/clerk-react'
import {
  AudioWaveform,
  Home,
  Inbox,
  BookOpen,
  Bot,
  Command,
  // Frame,
  GalleryVerticalEnd,
  Map,
  //PieChart,
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
//import { NavProjects } from 'src/components/NavProjects'
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

// This is sample data.
// Menu items.
const items = [
  {
    title: 'Home',
    url: 'homey',
    icon: Home,
  },
  {
    title: 'Test',
    url: 'test',
    icon: FlaskRound,
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
    title: 'Trips',
    url: 'trips',
    icon: Map,
  },
  {
    title: 'Projects',
    url: 'projects',
    icon: FolderOpenDot,
  },
  {
    title: 'Users',
    url: 'users',
    onlyAdmin: true,
    icon: User2Icon,
  },
]
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
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
    {
      title: 'Building Your Application',
      url: 'home',
    },
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
        {
          title: 'Expenses',
          url: 'expenses',
        },
        {
          title: 'New Trip',
          url: 'newTrip',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile } = useSidebar()
  const { pathname } = useLocation()
  const { hasRole } = useAuth()

  const handleLinkClick = () => {
    setOpenMobile(false)
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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

import * as React from 'react'

// import { UserButton } from '@clerk/clerk-react'
import {
  AudioWaveform,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  ChartArea,
  FolderOpenDot,
  FlaskRound,
} from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'
import { useLocation } from '@redwoodjs/router'

import { NavMain } from 'src/components/NavMain'
import { NavProjects } from 'src/components/NavProjects'
import { NavUser } from 'src/components/NavUser'
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
    url: 'addExpense',
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
      url: 'homey',
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
          url: 'trips/new',
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
          {items.map((item) => (
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
          ))}
        </SidebarMenu>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {/* <UserButton /> */}
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

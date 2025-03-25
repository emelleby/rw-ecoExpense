'use client'
import { Fragment } from 'react'

// import type { TripsByUser, FindProjectsbyUser } from 'types/graphql'
import { MapPin, FolderOpenDot, ChevronRight } from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'src/components/ui/Collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from 'src/components/ui/Sidebar'

interface MenuItem {
  title: string
  icon?: React.ElementType
  isActive?: boolean
  url: string
  items?: {
    id: number
    title: string
    url: string
  }[]
}

interface TripsByUserType {
  id: number
  name: string
}

interface FindProjectsbyUserType {
  id: number
  name: string
}

interface UserSidebarProps {
  tripsByUser: TripsByUserType[]
  projectsByUser: FindProjectsbyUserType[]
}

const UserSidebarGroup = ({
  tripsByUser,
  projectsByUser,
}: UserSidebarProps) => {
  const items: MenuItem[] = [
    {
      title: 'Trips',
      icon: MapPin,
      isActive: true,
      url: 'trips',
      items: tripsByUser.map((trip) => ({
        id: trip.id,
        title: trip.name,
        url: 'trip',
      })),
    },
    {
      title: 'Projects',
      icon: FolderOpenDot,
      isActive: false,
      url: 'projects',
      items: projectsByUser.map((project) => ({
        id: project.id,
        title: project.name,
        url: 'project',
      })),
    },
  ]
  // console.log(items)
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to={routes[item.url]()}>
                        <span>All</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  {item.items?.map((subItem) => {
                    // console.log('subItem=', subItem)
                    return (
                      <Fragment key={subItem.title}>
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            {subItem.url === '#' ? (
                              <span>{subItem.title}</span>
                            ) : (
                              <Link
                                to={routes[subItem.url]({ id: subItem.id })}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </Fragment>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default UserSidebarGroup

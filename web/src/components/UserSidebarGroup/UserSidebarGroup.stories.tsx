import type { Meta, StoryObj } from '@storybook/react'

import UserSidebarGroup from './UserSidebarGroup'

const meta: Meta<typeof UserSidebarGroup> = {
  component: UserSidebarGroup,
  tags: ['autodocs'],
  parameters: {
    // This ensures we have space for the sidebar to render
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj<typeof UserSidebarGroup>

const mockTrips = [
  {
    id: 1,
    name: 'Client Meeting in Oslo',
  },
  {
    id: 2,
    name: 'Tech Conference Berlin',
  },
  {
    id: 3,
    name: 'Team Offsite Stockholm',
  },
]

const mockProjects = [
  {
    id: 1,
    name: 'Website Redesign',
  },
  {
    id: 2,
    name: 'Mobile App Development',
  },
  {
    id: 3,
    name: 'Cloud Migration',
  },
]

export const Primary: Story = {
  args: {
    tripsByUser: mockTrips,
    projectsByUser: mockProjects,
  },
}

export const NoTrips: Story = {
  args: {
    tripsByUser: [],
    projectsByUser: mockProjects,
  },
}

export const NoProjects: Story = {
  args: {
    tripsByUser: mockTrips,
    projectsByUser: [],
  },
}

export const Empty: Story = {
  args: {
    tripsByUser: [],
    projectsByUser: [],
  },
}

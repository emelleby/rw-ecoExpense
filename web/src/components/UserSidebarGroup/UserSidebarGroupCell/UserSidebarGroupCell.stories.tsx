import type { Meta, StoryObj } from '@storybook/react'

import { Loading, Empty, Failure, Success } from './UserSidebarGroupCell'
import { standard } from './UserSidebarGroupCell.mock'

const meta: Meta = {
  title: 'Cells/UserSidebarGroupCell',
  tags: ['autodocs'],
  parameters: {
    // This ensures we have space for the sidebar to render
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj

export const loading: Story = {
  render: () => {
    return <Loading />
  },
}

export const empty: Story = {
  render: () => {
    return <Empty />
  },
}

export const failure: Story = {
  render: () => {
    return <Failure error={new Error('Failed to load user sidebar data')} />
  },
}

export const success: Story = {
  render: () => {
    const mockData = standard()
    return <Success {...mockData} />
  },
}

export const successWithNoTrips: Story = {
  render: () => {
    const mockData = {
      ...standard(),
      tripsByUser: [],
    }
    return <Success {...mockData} />
  },
}

export const successWithNoProjects: Story = {
  render: () => {
    const mockData = {
      ...standard(),
      projects: [],
    }
    return <Success {...mockData} />
  },
}

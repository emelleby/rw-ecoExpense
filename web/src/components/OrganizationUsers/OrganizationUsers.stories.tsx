import type { Meta, StoryObj } from '@storybook/react'

import OrganizationUsers from './OrganizationUsers'

const meta: Meta<typeof OrganizationUsers> = {
  component: OrganizationUsers,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof OrganizationUsers>

const mockUsers = [
  {
    id: 1,
    username: 'johndoe',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: 2,
    username: 'janedoe',
    email: 'jane.doe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
  },
  {
    id: 3,
    username: 'bobsmith',
    email: 'bob.smith@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
  },
]

export const Primary: Story = {
  args: {
    users: mockUsers,
  },
}

export const Empty: Story = {
  args: {
    users: [],
  },
}

export const SingleUser: Story = {
  args: {
    users: [mockUsers[0]],
  },
}

export const WithMissingData: Story = {
  args: {
    users: [
      {
        id: 1,
        username: 'incomplete',
        email: 'incomplete@example.com',
        firstName: null,
        lastName: null,
      },
    ],
  },
}

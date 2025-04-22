import type { Meta, StoryObj } from '@storybook/react'

import { Loading, Empty, Failure, Success } from './OnboardingCell'
import { standard } from './OnboardingCell.mock'

const meta: Meta = {
  title: 'Cells/OrganizationCell',
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      mockCurrentUser({
        id: 'user_2pkZyi796FvxrYZlUpFeddb3C0e',
        dbUserId: 4,
        organizationId: 8,
        roles: ['admin', 'superuser'],
        metadata: {
          organizationId: 8,
          roles: ['admin', 'superuser'],
        },
        username: 'testuser',
        primaryEmailAddress: {
          emailAddress: 'test@example.com',
        },
      })

      return <Story />
    },
  ],
}

export default meta

export const loading: StoryObj<typeof Loading> = {
  render: () => {
    return Loading ? <Loading /> : <></>
  },
}

export const empty: StoryObj<typeof Empty> = {
  render: () => {
    return Empty ? <Empty /> : <></>
  },
}

export const failure: StoryObj<typeof Failure> = {
  render: (args) => {
    return Failure ? <Failure error={new Error('Oh no')} {...args} /> : <></>
  },
}

export const success: StoryObj<typeof Success> = {
  render: (args) => {
    return Success ? <Success {...standard()} {...args} /> : <></>
  },
}

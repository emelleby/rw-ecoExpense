import type { Meta, StoryObj } from '@storybook/react'
import { mockUsers } from 'web/.storybook/mockData/users'
import { StoryAuthProvider } from 'web/.storybook/providers/StoryAuthProvider'

import OnboardingPage from './OnboardingPage'

const meta: Meta<typeof OnboardingPage> = {
  component: OnboardingPage,
  title: 'Pages/OnboardingPage',
  decorators: [
    (Story) => (
      <StoryAuthProvider mockUser={mockUsers.newUser}>
        <Story />
      </StoryAuthProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof OnboardingPage>

export const NewUser: Story = {}

export const WithExistingRole: Story = {
  decorators: [
    (Story) => (
      <StoryAuthProvider mockUser={mockUsers.member}>
        <Story />
      </StoryAuthProvider>
    ),
  ],
}

export const Loading: Story = {
  decorators: [
    (Story) => (
      <StoryAuthProvider authenticated={false}>
        <Story />
      </StoryAuthProvider>
    ),
  ],
}

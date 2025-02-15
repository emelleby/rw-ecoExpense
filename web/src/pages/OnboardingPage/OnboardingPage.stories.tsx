import { ClerkProvider } from '@clerk/clerk-react'
import type { Meta, StoryObj } from '@storybook/react'

import { routes } from '@redwoodjs/router'
import { mockCurrentUser } from '@redwoodjs/testing/web'

import OnboardingPage from './OnboardingPage'

const meta: Meta<typeof OnboardingPage> = {
  component: OnboardingPage,
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
      })

      // Mock the routes properly
      routes.login = () => '/login'
      routes.homey = () => '/homey'

      return (
        <ClerkProvider publishableKey="pk_test_cHJpbWUtYW5lbW9uZS01LmNsZXJrLmFjY291bnRzLmRldiQ">
          <Story />
        </ClerkProvider>
      )
    },
  ],
}

export default meta

type Story = StoryObj<typeof OnboardingPage>
export const Primary: Story = {}

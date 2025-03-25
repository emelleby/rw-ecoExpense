import React from 'react'

import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider as RedwoodAuthProvider } from 'web/src/auth.tsx'

export interface MockUser {
  id: string
  dbUserId: number
  organizationId: number
  roles: string[]
  metadata: {
    organizationId: number
    roles: string[]
  }
}

interface StoryAuthProviderProps {
  children: React.ReactNode
  mockUser?: MockUser
  authenticated?: boolean
}

const defaultMockUser: MockUser = {
  id: 'user_test',
  dbUserId: 1,
  organizationId: 1,
  roles: ['admin'],
  metadata: {
    organizationId: 1,
    roles: ['admin'],
  },
}

export const StoryAuthProvider = ({
  children,
  mockUser = defaultMockUser,
  authenticated = true,
}: StoryAuthProviderProps) => {
  // Mock Clerk's publishable key for Storybook
  const mockPublishableKey = 'pk_test_storybook-mock-key'

  return (
    <RedwoodAuthProvider>
      <ClerkProvider publishableKey={mockPublishableKey}>
        {children}
      </ClerkProvider>
    </RedwoodAuthProvider>
  )
}

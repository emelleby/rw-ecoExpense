import React, { useEffect, useRef } from 'react'

import { ClerkProvider, useUser } from '@clerk/clerk-react'

import { createAuth } from '@redwoodjs/auth-clerk-web'
import { navigate } from '@redwoodjs/router'

export const { AuthProvider: ClerkRwAuthProvider, useAuth } = createAuth()

const ClerkStatusUpdater = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  const { reauthenticate, isAuthenticated, loading } = useAuth()
  const retries = useRef(0)

  useEffect(() => {
    if (isLoaded) {
      reauthenticate()
    }
  }, [isSignedIn, user, reauthenticate, isLoaded])

  // Redwood's reauthenticate() has no retry: a failed or slow current-user
  // fetch (e.g. DB cold start) leaves isAuthenticated:false while Clerk is
  // signed in. Retry up to 3 times with backoff (0.5s, 1s, 2s).
  useEffect(() => {
    if (isAuthenticated) {
      retries.current = 0
      return
    }
    if (!isLoaded || !isSignedIn || loading || retries.current >= 3) return
    const timer = setTimeout(() => {
      retries.current++
      reauthenticate()
    }, 500 * 2 ** retries.current)
    return () => clearTimeout(timer)
  }, [isAuthenticated, loading, isSignedIn, isLoaded, reauthenticate])

  return null
}

type ClerkOptions =
  | { publishableKey: string; frontendApi?: never }
  | { publishableKey?: never; frontendApi: string }

interface Props {
  children: React.ReactNode
}

const ClerkProviderWrapper = ({
  children,
  clerkOptions,
}: Props & { clerkOptions: ClerkOptions }) => {
  const { reauthenticate } = useAuth()

  return (
    <ClerkProvider
      {...clerkOptions}
      navigate={(to) => reauthenticate().then(() => navigate(to))}
    >
      {children}
      <ClerkStatusUpdater />
    </ClerkProvider>
  )
}

export const AuthProvider = ({ children }: Props) => {
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY
  const frontendApi =
    process.env.CLERK_FRONTEND_API_URL || process.env.CLERK_FRONTEND_API

  const clerkOptions: ClerkOptions = publishableKey
    ? { publishableKey }
    : { frontendApi }

  return (
    <ClerkRwAuthProvider>
      <ClerkProviderWrapper clerkOptions={clerkOptions}>
        {children}
      </ClerkProviderWrapper>
    </ClerkRwAuthProvider>
  )
}

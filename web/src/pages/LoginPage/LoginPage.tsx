import { useEffect, useState } from 'react'

import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react'

import { Redirect, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import { Button } from '@/components/ui/Button'

const LoadingScreen = ({ label }: { label?: string }) => (
  <main
    className="flex min-h-screen flex-col items-center justify-center bg-slate-700"
    role="status"
    aria-live="polite"
  >
    <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-white"></div>
    <span className="sr-only">{label || 'Loading'}</span>
  </main>
)

// ClerkStatusUpdater retries the session restore ~3.5s total; if we're still
// here after that, offer a way out instead of spinning forever.
const RestoringSession = () => {
  const { reauthenticate, logOut } = useAuth()
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStuck(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  if (!stuck) return <LoadingScreen label="Restoring your session" />

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-700 text-white">
      <p>We couldn&apos;t restore your session.</p>
      <div className="flex flex-row gap-4">
        <Button
          onClick={() => {
            setStuck(false)
            reauthenticate()
          }}
        >
          Try again
        </Button>
        <Button onClick={() => logOut()}>Sign out</Button>
      </div>
    </main>
  )
}

const LoginPage = () => {
  const { isAuthenticated, signUp, loading, hasRole } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  // Redirect if user already has a role and is authenticated
  if (isAuthenticated) {
    if (hasRole(['admin', 'member', 'superuser'])) {
      return <Redirect to={routes.homey()} />
    }
    return <Redirect to={routes.onboarding()} />
  }

  return (
    <>
      <Metadata title="Login" description="Login page" />
      <SignedOut>
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-700">
          <h1 className="mb-4 flex flex-col items-center justify-center bg-slate-700 text-2xl font-bold leading-none tracking-tight text-white md:text-3xl lg:text-5xl">
            Welcome to EcoExpense
          </h1>
          <div className="mt-4 flex flex-row items-center justify-center gap-4">
            <SignInButton mode="modal" afterSignInUrl={routes.homey()}>
              <Button>Sign in</Button>
            </SignInButton>
            <Button
              onClick={(e) => {
                e.preventDefault()
                signUp({ afterSignUpUrl: routes.onboarding() })
              }}
            >
              sign up
            </Button>
          </div>
        </main>
      </SignedOut>
      {/*
        A live Clerk session exists but the app is still restoring it
        (slow/failed current-user fetch). Render a restoring state instead of
        the sign-in form, which <SignedOut> hides — that used to leave this
        page with no buttons and nowhere to navigate.
      */}
      <SignedIn>
        <RestoringSession />
      </SignedIn>
    </>
  )
}

export default LoginPage

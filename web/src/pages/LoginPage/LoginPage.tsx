import { SignInButton, SignedOut } from '@clerk/clerk-react'

import { Redirect, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import { Button } from '@/components/ui/Button'

const LoginPage = () => {
  const { isAuthenticated, signUp, loading, hasRole, currentUser } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-700">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-white"></div>
      </div>
    )
  }

  console.log('Hello from LoginPage', { isAuthenticated })

  // Redirect if user already has a role and is authenticated
  if (isAuthenticated) {
    console.log(
      'Hello from LoginPage',
      hasRole(['admin', 'member', 'superuser'])
    )
    if (hasRole(['admin', 'member', 'superuser'])) {
      return <Redirect to={routes.homey()} />
    }
    return <Redirect to={routes.onboarding()} />
  }

  return (
    <>
      <Metadata title="Login" description="Login page" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-700">
        <p>{JSON.stringify({ isAuthenticated })}</p>
        <p>{JSON.stringify({ currentUser })}</p>
        <h1 className="mb-4 flex flex-col items-center justify-center bg-slate-700 text-2xl font-bold leading-none tracking-tight text-white md:text-3xl lg:text-5xl">
          Welcome to EcoExpense
        </h1>
        <div className="mt-4 flex flex-row items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" afterSignInUrl={routes.homey()}>
              <Button>Sign in</Button>
            </SignInButton>
            <Button
              onClick={(e) => {
                e.preventDefault()
                signUp()
              }}
            >
              sign up
            </Button>
          </SignedOut>
        </div>
      </div>
    </>
  )
}

export default LoginPage

import { useEffect } from 'react'

import { SignUp, SignIn, SignInButton, SignedOut } from '@clerk/clerk-react'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import { Button } from '@/components/ui/Button'

const LoginPage = () => {
  const { isAuthenticated, signUp, signIn, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(routes.homey())
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-700">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-white"></div>
      </div>
    )
  }

  return (
    <>
      <Metadata title="Login" description="Login page" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-700">
        <p>{JSON.stringify({ isAuthenticated })}</p>
        <h1 className="mb-4 flex flex-col items-center justify-center bg-slate-700 text-2xl font-bold leading-none tracking-tight text-white md:text-3xl lg:text-5xl">
          Welcome to EcoExpense
        </h1>
        <div className="mt-4 flex flex-row items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" afterSignInUrl={routes.homey()}>
              <Button>Sign in</Button>
            </SignInButton>
            <Button onClick={signUp}>sign up</Button>
          </SignedOut>
        </div>
      </div>
    </>
  )
}

export default LoginPage

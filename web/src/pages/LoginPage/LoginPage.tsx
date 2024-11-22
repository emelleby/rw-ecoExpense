import { useEffect } from 'react'

import { SignUp, SignIn } from '@clerk/clerk-react'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const LoginPage = () => {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.homey())
    }
  }, [isAuthenticated])

  return (
    <>
      <Metadata title="Login" description="Login page" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-700">
        <p>{JSON.stringify({ isAuthenticated })}</p>
        {!isAuthenticated && <SignIn />}
      </div>
    </>
  )
}

export default LoginPage

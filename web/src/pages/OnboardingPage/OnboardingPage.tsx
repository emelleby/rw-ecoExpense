// import { Link, routes } from '@redwoodjs/router'
import { useUser } from '@clerk/clerk-react'

import { Redirect, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const UserRole = () => {
  const { user } = useUser()

  return (
    <div className="text-white">
      <h1>Welcome, {user.username}</h1>
      <p>Your role: {user.publicMetadata?.roles || 'No role assigned'}</p>
    </div>
  )
}

const OnboardingPage = () => {
  const { isAuthenticated } = useAuth()
  const { user } = useUser()

  if (!isAuthenticated) {
    return <Redirect to={routes.login()} />
  }
  // Redirect if user already has a role
  // if (user.publicMetadata?.role?.length > 0) {
  if (isAuthenticated) {
    return <Redirect to={routes.homey()} />
  }

  return (
    <>
      <Metadata title="Onboarding" description="Onboarding page" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-700">
        <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
        <div className="mt-8 w-full max-w-md rounded-lg bg-slate-800 p-6">
          <p className="text-white">Onboarding form will go here</p>
          <h2 className="text-yellow-100">Current User Role</h2>
          <UserRole />
          <p></p>
        </div>
      </div>

      {/*
          My default route is named `onboarding`, link to me with:
          `<Link to={routes.onboarding()}>Onboarding</Link>`
      */}
    </>
  )
}

export default OnboardingPage

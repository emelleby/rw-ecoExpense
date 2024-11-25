// import { Link, routes } from '@redwoodjs/router'
import { useUser } from '@clerk/clerk-react'

import { Redirect, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import OrganizationCell from 'src/components/OrganizationCell'

const UserRole = () => {
  const { user } = useUser()
  const { currentUser } = useAuth()

  return (
    <div className="text-white">
      <h1>Welcome, {user.username}</h1>
      <p>Your role: {(currentUser.roles as string) || 'No role assigned'}</p>
    </div>
  )
}

const OnboardingPage = () => {
  const { isAuthenticated, hasRole } = useAuth()

  if (!isAuthenticated) {
    return <Redirect to={routes.login()} />
  }
  // Redirect if user already has a role
  // Option 2: Use the built-in hasRole helper from auth.ts
  if (hasRole(['admin', 'member'])) {
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
          <OrganizationCell />
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

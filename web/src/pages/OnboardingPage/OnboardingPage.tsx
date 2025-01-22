// import { Link, routes } from '@redwoodjs/router'
import { useUser, UserButton } from '@clerk/clerk-react'

import { Redirect, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import OrganizationCell from 'src/components/OrganizationCell'

const UserRole = () => {
  const { user } = useUser()
  const { currentUser } = useAuth()

  return (
    <div className="text-slate-50">
      <h1>Welcome, {user.username}</h1>
      <p>Your role: {(currentUser.roles as string) || 'No role assigned'}</p>
    </div>
  )
}

const OnboardingPage = () => {
  const { isAuthenticated, hasRole, userMetadata } = useAuth()

  if (!isAuthenticated) {
    return <Redirect to={routes.login()} />
  }
  // Redirect if user already has a role
  // Option 2: Use the built-in hasRole helper from auth.ts
  if (hasRole(['admin', 'member', 'superuser'])) {
    return <Redirect to={routes.homey()} />
  }

  return (
    <>
      <Metadata title="Onboarding" description="Onboarding page" />
      <div className="flex min-h-screen flex-col items-center bg-slate-800">
        <UserButton />
        <h1 className="mt-6 text-2xl font-bold text-slate-100">
          Complete Your Profile
        </h1>

        <div className="mt-8 w-full max-w-md rounded-lg p-6">
          <h2 className="text-yellow-100">Current User Role:</h2>
          <UserRole />
          <OrganizationCell />
        </div>
        <div className="mt-8 w-full max-w-lg rounded-lg p-6 text-white">
          <h2 className="text-white">Current userMetadata Information</h2>
          <pre>{JSON.stringify(userMetadata.username, null, 2)}</pre>
          <pre>
            {JSON.stringify(
              userMetadata.primaryEmailAddress.emailAddress,
              null,
              2
            )}
          </pre>
          <pre>{JSON.stringify(userMetadata.unsafeMetadata, null, 2)}</pre>
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
          {/* <h2 className="mt-6 text-white">Current User Information</h2>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre> */}
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

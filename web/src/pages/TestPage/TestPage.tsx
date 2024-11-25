// import { Link, routes } from '@redwoodjs/router'
import { useUser } from '@clerk/clerk-react'

import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import { Button } from '@/components/ui/Button'

const UserRole = () => {
  const { user } = useUser()
  const { currentUser } = useAuth()

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Your role: {(currentUser.roles as string) || 'No role assigned'}</p>
    </div>
  )
}

const TestPage = () => {
  const { isAuthenticated, signUp, currentUser, userMetadata } = useAuth()
  return (
    <>
      <Metadata title="Test" description="Test page" />

      <h1>TestPage</h1>
      <p>
        Find me in <code>./web/src/pages/TestPage/TestPage.tsx</code>
      </p>
      <p>{JSON.stringify({ isAuthenticated })}</p>
      {/* <Button onClick={signUp}>sign up</Button> */}
      <Button
        onClick={(e) => {
          e.preventDefault()
          signUp()
        }}
      >
        sign up
      </Button>

      <h2 className="mt-6">Current User Information</h2>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>

      <h2>Current User Role</h2>
      <UserRole />

      <h2>Current userMetadata Information</h2>
      <pre>{JSON.stringify(userMetadata, null, 2)}</pre>

      {/*
          My default route is named `test`, link to me with:
          `<Link to={routes.test()}>Test</Link>`
      */}
    </>
  )
}

export default TestPage

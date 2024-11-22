// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import { Button } from '@/components/ui/Button'

const TestPage = () => {
  const { isAuthenticated, signUp } = useAuth()
  return (
    <>
      <Metadata title="Test" description="Test page" />

      <h1>TestPage</h1>
      <p>
        Find me in <code>./web/src/pages/TestPage/TestPage.tsx</code>
      </p>
      <p>{JSON.stringify({ isAuthenticated })}</p>
      <Button onClick={signUp}>sign up</Button>
      {/*
          My default route is named `test`, link to me with:
          `<Link to={routes.test()}>Test</Link>`
      */}
    </>
  )
}

export default TestPage

// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const TestPage = () => {
  return (
    <>
      <Metadata title="Test" description="Test page" />

      <h1>TestPage</h1>
      <p>
        Find me in <code>./web/src/pages/TestPage/TestPage.tsx</code>
      </p>
      {/*
          My default route is named `test`, link to me with:
          `<Link to={routes.test()}>Test</Link>`
      */}
    </>
  )
}

export default TestPage

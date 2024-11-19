// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const TripsPage = () => {
  return (
    <>
      <Metadata title="Trips" description="Trips page" />

      <h1>TripsPage</h1>
      <p>
        Find me in <code>./web/src/pages/TripsPage/TripsPage.tsx</code>
      </p>
      {/*
          My default route is named `trips`, link to me with:
          `<Link to={routes.trips()}>Trips</Link>`
      */}
    </>
  )
}

export default TripsPage

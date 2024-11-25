// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage
import { PrivateSet, Set, Router, Route } from '@redwoodjs/router'

import AppshellLayout from 'src/layouts/AppshellLayout'
import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import { useAuth } from './auth'
import LoaderSpinner from './components/LoaderSpinner/LoaderSpinner'

const Routes = () => {
  // const { user } = useUser()
  // const roles = user.publicMetadata?.roles
  const { currentUser } = useAuth()
  console.log('currentUser', currentUser)
  return (
    <Router useAuth={useAuth}>
      <Set wrap={ScaffoldLayout} title="Organizations" titleTo="organizations" buttonLabel="New Organization" buttonTo="newOrganization">
        <Route path="/organizations/new" page={OrganizationNewOrganizationPage} name="newOrganization" />
        <Route path="/organizations/{id:Int}/edit" page={OrganizationEditOrganizationPage} name="editOrganization" />
        <Route path="/organizations/{id:Int}" page={OrganizationOrganizationPage} name="organization" />
        <Route path="/organizations" page={OrganizationOrganizationsPage} name="organizations" />
      </Set>
      <Route path="/" page={LoginPage} name="login" />
      <PrivateSet whileLoadingPage={LoaderSpinner} unauthenticated="login">
        <Route path="/onboarding" page={OnboardingPage} name="onboarding" />
        <PrivateSet unauthenticated="login" roles={['admin', 'member']}>
          <Set wrap={ScaffoldLayout} title="Projects" titleTo="projects" buttonLabel="New Project" buttonTo="newProject">
            <Route path="/projects/new" page={ProjectNewProjectPage} name="newProject" />
            <Route path="/projects/{id:Int}/edit" page={ProjectEditProjectPage} name="editProject" />
            <Route path="/projects/{id:Int}" page={ProjectProjectPage} name="project" />
            <Route path="/projects" page={ProjectProjectsPage} name="projects" />
          </Set>
          <Set wrap={ScaffoldLayout} title="Trips" titleTo="trips" buttonLabel="New Trip" buttonTo="newTrip">
            <Route path="/trips/new" page={TripNewTripPage} name="newTrip" />
            <Route path="/trips/{id:Int}/edit" page={TripEditTripPage} name="editTrip" />
            <Route path="/trips/{id:Int}" page={TripTripPage} name="trip" />
            {/* <Route path="/trips" page={TripTripsPage} name="trips" /> */}
          </Set>
          <Set wrap={AppshellLayout}>
            <Route path="/test" page={TestPage} name="test" />
            <Route path="/home" page={HomePage} name="homey" />
            <Route path="/add-expense" page={AddExpensePage} name="addExpense" />
            {/* <Route path="/projects" page={ProjectsPage} name="projects" /> */}
            {/* <Route path="/trips" page={TripsPage} name="trips" /> */}
            <Route path="/expenses" page={ExpensesPage} name="expenses" />
            <Route path="/trips" page={TripTripsPage} name="trips" />
          </Set>
        </PrivateSet>
      </PrivateSet>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

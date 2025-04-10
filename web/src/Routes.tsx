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
      <PrivateSet wrap={(props) => <ScaffoldLayout {...props} title="Sectors" titleTo="sectors" buttonLabel="New Sector" buttonTo="newSector" />} whileLoadingPage={LoaderSpinner} unauthenticated="homey" roles={['superuser']}>
        <Route path="/admin/sectors/new" page={SectorNewSectorPage} name="newSector" />
        <Route path="/admin/sectors/{id:Int}/edit" page={SectorEditSectorPage} name="editSector" />
        <Route path="/admin/sectors/{id:Int}" page={SectorSectorPage} name="sector" />
        <Route path="/admin/sectors" page={SectorSectorsPage} name="sectors" />
      </PrivateSet>
      <PrivateSet wrap={(props) => <ScaffoldLayout {...props} title="Organizations" titleTo="organizations" buttonLabel="New Organization" buttonTo="newOrganization" />} whileLoadingPage={LoaderSpinner} unauthenticated="homey" roles={['superuser']}>
        <Route path="/admin/organizations/new" page={OrganizationNewOrganizationPage} name="newOrganization" />
        <Route path="/admin/organizations/{id:Int}/edit" page={OrganizationEditOrganizationPage} name="editOrganization" />
        <Route path="/admin/organizations/{id:Int}" page={OrganizationOrganizationPage} name="organization" />
        <Route path="/admin/organizations" page={OrganizationOrganizationsPage} name="organizations" />
      </PrivateSet>
      <Route path="/" page={LoginPage} name="login" />
      <PrivateSet whileLoadingPage={LoaderSpinner} unauthenticated="login">
        <Route path="/onboarding" page={OnboardingPage} name="onboarding" />

        <PrivateSet unauthenticated="login" roles={['admin', 'member']}>
          <Set wrap={(props) => <AppshellLayout {...props} title="Trips" titleTo="trips" />}>
            <Route path="/trip/new" page={TripNewTripPage} name="newTrip" />
            <Route path="/trip/{id:Int}/edit" page={TripEditTripPage} name="editTrip" />
            <Route path="/trip/{id:Int}" page={TripTripPage} name="trip" />
            <Route path="/trip/{id:Int}/report" page={TripReportPage} name="tripReport" />
            <Route path="/trips" page={TripTripsPage} name="trips" />
          </Set>

          <Set wrap={(props) => <AppshellLayout {...props} title="Users" titleTo="users" />}>
            <Route path="/users/new" page={UserNewUserPage} name="newUser" />
            <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
            <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
            <Route path="/users" page={UserUsersPage} name="users" />
          </Set>

          <Set wrap={(props) => <AppshellLayout {...props} title="EcoExpense" />}>
            <Route path="/test" page={TestPage} name="test" />
            <Route path="/home" page={HomePage} name="homey" />
            <Route path="/profile" page={ProfilePage} name="profile" />
            <Route path="/add-expense" page={AddExpensePage} name="addExpense" />
            <Route path="/expenses2" page={ExpensesPage} name="expenses2" />
            <Route path="/projects" page={ProjectProjectsPage} name="projects" />
            <Route path="/projects/new" page={ProjectNewProjectPage} name="newProject" />
            <Route path="/projects/{id:Int}/edit" page={ProjectEditProjectPage} name="editProject" />
            <Route path="/projects/{id:Int}" page={ProjectProjectPage} name="project" />
            <Route path="/expenses/new" page={ExpenseNewExpensePage} name="newExpense" />
            <Route path="/expenses/{id:Int}/edit" page={ExpenseEditExpensePage} name="editExpense" />
            <Route path="/expenses/{id:Int}" page={ExpenseExpensePage} name="expense" />
            <Route path="/expenses" page={ExpenseExpensesPage} name="expenses" />
          </Set>
        </PrivateSet>
      </PrivateSet>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

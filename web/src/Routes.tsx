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

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/" page={LoginPage} name="login" />
      <PrivateSet unauthenticated="login">
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
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

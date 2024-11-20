// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage
import { Set, Router, Route } from '@redwoodjs/router'

import AppshellLayout from 'src/layouts/AppshellLayout'
import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
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
        <Route path="/projects" page={ProjectsPage} name="projects" />
        {/* <Route path="/trips" page={TripsPage} name="trips" /> */}
        <Route path="/expenses" page={ExpensesPage} name="expenses" />
        <Route path="/trips" page={TripTripsPage} name="trips" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

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

const Routes = () => {
  return (
    <Router>
      <Set wrap={AppshellLayout}>
        <Route path="/test" page={TestPage} name="test" />
        <Route path="/home" page={HomePage} name="homey" />
        <Route path="/add-expense" page={AddExpensePage} name="addExpense" />
        <Route path="/projects" page={ProjectsPage} name="projects" />
        <Route path="/trips" page={TripsPage} name="trips" />
        <Route path="/expenses" page={ExpensesPage} name="expenses" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage
import { Router, Route } from '@redwoodjs/router'

import DashboardPage from 'src/pages/DashboardPage/DashboardPage'

const Routes = () => {
  return (
    <Router>
      <Route path="/test" page={TestPage} name="test" />
      <Route path="/home" page={HomePage} name="homey" />
      <Route path="/dashboard" page={DashboardPage} name="dashboard" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

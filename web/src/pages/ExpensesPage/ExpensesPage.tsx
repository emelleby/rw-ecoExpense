// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ExpensesPage = () => {
  return (
    <>
      <Metadata title="Expenses" description="Expenses page" />

      <h1>ExpensesPage</h1>
      <p>
        Find me in <code>./web/src/pages/ExpensesPage/ExpensesPage.tsx</code>
      </p>
      {/*
          My default route is named `expenses`, link to me with:
          `<Link to={routes.expenses()}>Expenses</Link>`
      */}
    </>
  )
}

export default ExpensesPage

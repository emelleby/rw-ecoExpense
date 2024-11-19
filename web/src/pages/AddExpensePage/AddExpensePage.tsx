// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const AddExpensePage = () => {
  return (
    <>
      <Metadata title="AddExpense" description="AddExpense page" />

      <h1>AddExpensePage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/AddExpensePage/AddExpensePage.tsx</code>
      </p>
      {/*
          My default route is named `addExpense`, link to me with:
          `<Link to={routes.addExpense()}>AddExpense</Link>`
      */}
    </>
  )
}

export default AddExpensePage

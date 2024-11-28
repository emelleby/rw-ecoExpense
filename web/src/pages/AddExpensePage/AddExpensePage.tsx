import { get } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/Button'

const AddExpensePage = () => {
  const getLink = (url: string) => {
    const link = routes[url]()
    return link
  }
  return (
    <>
      <Metadata title="AddExpense" description="AddExpense page" />
      <h1>AddExpensePage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/AddExpensePage/AddExpensePage.tsx</code>
      </p>
      My default route is named `addExpense`, link to me with: `
      <Link to={getLink('homey')}>
        <Button>AddExpense</Button>
      </Link>
      `
    </>
  )
}

export default AddExpensePage

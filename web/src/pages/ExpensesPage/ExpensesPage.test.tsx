import { render } from '@redwoodjs/testing/web'

import ExpensesPage from './ExpensesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ExpensesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ExpensesPage />)
    }).not.toThrow()
  })
})

import { render } from '@redwoodjs/testing/web'

import AddExpensePage from './AddExpensePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AddExpensePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AddExpensePage />)
    }).not.toThrow()
  })
})

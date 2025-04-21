import { render } from '@redwoodjs/testing/web'

import Customers from './Customers'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Customers', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Customers />)
    }).not.toThrow()
  })
})

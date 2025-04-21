import { render } from '@redwoodjs/testing/web'

import Address from './Address'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Address', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Address />)
    }).not.toThrow()
  })
})

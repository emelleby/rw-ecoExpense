import { render } from '@redwoodjs/testing/web'

import RatesDialog from './RatesDialog'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('RatesDialog', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RatesDialog />)
    }).not.toThrow()
  })
})

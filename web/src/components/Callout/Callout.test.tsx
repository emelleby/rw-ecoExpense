import { render } from '@redwoodjs/testing/web'

import Callout from './Callout'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Callout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Callout />)
    }).not.toThrow()
  })
})

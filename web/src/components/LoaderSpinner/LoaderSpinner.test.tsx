import { render } from '@redwoodjs/testing/web'

import LoaderSpinner from './LoaderSpinner'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('LoaderSpinner', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LoaderSpinner />)
    }).not.toThrow()
  })
})

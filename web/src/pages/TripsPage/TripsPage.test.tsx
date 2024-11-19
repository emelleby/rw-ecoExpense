import { render } from '@redwoodjs/testing/web'

import TripsPage from './TripsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TripsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TripsPage />)
    }).not.toThrow()
  })
})

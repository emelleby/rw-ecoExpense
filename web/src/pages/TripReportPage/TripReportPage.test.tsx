import { render } from '@redwoodjs/testing/web'

import TripReportPage from './TripReportPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TripReportPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TripReportPage id={42} />)
    }).not.toThrow()
  })
})

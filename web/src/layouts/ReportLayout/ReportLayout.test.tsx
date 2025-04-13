import { render } from '@redwoodjs/testing/web'

import ReportLayout from './ReportLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ReportLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ReportLayout />)
    }).not.toThrow()
  })
})

import { render } from '@redwoodjs/testing/web'

import TasksLayout from './TasksLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TasksLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TasksLayout />)
    }).not.toThrow()
  })
})

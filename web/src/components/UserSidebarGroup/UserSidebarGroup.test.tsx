import { render } from '@redwoodjs/testing/web'

import UserSidebarGroup from './UserSidebarGroup'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UserSidebarGroup', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserSidebarGroup />)
    }).not.toThrow()
  })
})

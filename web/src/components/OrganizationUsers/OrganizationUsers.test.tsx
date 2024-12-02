import { render } from '@redwoodjs/testing/web'

import OrganizationUsers from './OrganizationUsers'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('OrganizationUsers', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrganizationUsers />)
    }).not.toThrow()
  })
})

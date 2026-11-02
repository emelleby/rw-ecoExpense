import { render } from '@redwoodjs/testing/web'

import AppshellLayout from './AppshellLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AppshellLayout', () => {
  it('renders successfully', () => {
    mockCurrentUser({
      id: 'user_test',
      dbUserId: 42,
      roles: 'user',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    })
    expect(() => {
      render(<AppshellLayout />)
    }).not.toThrow()
  })
})

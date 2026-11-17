import { render } from '@redwoodjs/testing/web'

import OrganizationUsers from './OrganizationUsers'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('OrganizationUsers', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <OrganizationUsers
          users={[
            {
              id: 1,
              username: 'ada',
              email: 'ada@example.com',
              firstName: 'Ada',
              lastName: 'Lovelace',
            },
          ]}
        />
      )
    }).not.toThrow()
  })
})

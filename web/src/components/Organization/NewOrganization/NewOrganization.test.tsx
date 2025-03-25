import { render } from '@redwoodjs/testing/web'

import NewOrganization from './NewOrganization'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NewOrganization', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewOrganization />)
    }).not.toThrow()
  })
})

import { render } from '@redwoodjs/testing/web'

import { standard } from 'src/components/ProfileCell/ProfileCell.mock'

import Address from './Address'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Address', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <Address user={standard().user} isLoaded={false} mapError={null} />
      )
    }).not.toThrow()
  })
})

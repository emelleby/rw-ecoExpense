import { render } from '@redwoodjs/testing/web'

import { SidebarProvider } from 'src/components/ui/Sidebar'

import UserSidebarGroup from './UserSidebarGroup'
import { standard } from './UserSidebarGroupCell/UserSidebarGroupCell.mock'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UserSidebarGroup', () => {
  it('renders successfully', () => {
    expect(() => {
      const { projects, tripsByUser } = standard()
      render(
        <SidebarProvider>
          <UserSidebarGroup
            tripsByUser={tripsByUser}
            projectsByUser={projects}
          />
        </SidebarProvider>
      )
    }).not.toThrow()
  })
})

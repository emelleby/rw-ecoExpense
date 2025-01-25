import type {
  UserSidebarGroupQuery,
  UserSidebarGroupQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import UserSidebarGroup from 'src/components/UserSidebarGroup/UserSidebarGroup'

export const QUERY: TypedDocumentNode<
  UserSidebarGroupQuery,
  UserSidebarGroupQueryVariables
> = gql`
  query UserSidebarGroupQuery {
    projects(take: 5) {
      id
      name
    }
    tripsByUser(take: 3) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  projects,
  tripsByUser,
}: CellSuccessProps<UserSidebarGroupQuery>) => {
  console.log(projects)
  return (
    <UserSidebarGroup tripsByUser={tripsByUser} projectsByUser={projects} />
  )
}

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
    projectsByUser {
      id
      name
    }
    tripsByUser {
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
  projectsByUser,
  tripsByUser,
}: CellSuccessProps<UserSidebarGroupQuery>) => {
  console.log(projectsByUser)
  return (
    <UserSidebarGroup
      tripsByUser={tripsByUser}
      projectsByUser={projectsByUser}
    />
    // <div>
    //   {tripsByUser?.map((trip) => <div key={trip.id}>{trip.name}</div>)}
    //   {projectsByUser?.map((project) => (
    //     <div key={project.id}>{project.name}</div>
    //   ))}
    // </div>
  )
}

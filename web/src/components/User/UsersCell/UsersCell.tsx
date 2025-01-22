import type {
  FindUsersByOrganization,
  FindUsersByOrganizationVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Spinner from 'src/components/ui/Spinner'
import Users from 'src/components/User/Users'

export const QUERY: TypedDocumentNode<
  FindUsersByOrganization,
  FindUsersByOrganizationVariables
> = gql`
  query FindUsersByOrganization($organizationId: Int!) {
    usersByOrganization(organizationId: $organizationId) {
      id
      username
      email
      firstName
      lastName
      bankAccount
      status
      organizationId
    }
  }
`

export const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner />
  </div>
)

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No users yet.{' '}
      <Link to={routes.newUser()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({
  error,
}: CellFailureProps<FindUsersByOrganization>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  usersByOrganization,
}: CellSuccessProps<
  FindUsersByOrganization,
  FindUsersByOrganizationVariables
>) => {
  return <Users usersByOrganization={usersByOrganization} />
}

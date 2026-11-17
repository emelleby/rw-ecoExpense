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

import Users from 'src/components/User/Users'
import PageLoading from 'src/components/ui/PageLoading'

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
      status
      organizationId
    }
    organization(id: $organizationId) {
      id
      name
      regnr
    }
  }
`

export const Loading = PageLoading

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
  organization,
}: CellSuccessProps<
  FindUsersByOrganization,
  FindUsersByOrganizationVariables
>) => {
  return (
    <Users
      usersByOrganization={usersByOrganization}
      organization={organization}
    />
  )
}

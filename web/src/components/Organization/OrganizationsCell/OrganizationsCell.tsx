import type {
  FindOrganizations,
  FindOrganizationsVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Organizations from 'src/components/Organization/Organizations'

export const QUERY: TypedDocumentNode<
  FindOrganizations,
  FindOrganizationsVariables
> = gql`
  query FindOrganizations {
    organizations {
      id
      regnr
      name
      description
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No organizations yet.{' '}
      <Link to={routes.newOrganization()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindOrganizations>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  organizations,
}: CellSuccessProps<FindOrganizations, FindOrganizationsVariables>) => {
  return <Organizations organizations={organizations} />
}

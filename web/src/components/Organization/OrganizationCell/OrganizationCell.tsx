// This file is not in use. We are using the OrganizationCell component one level up at the moment.

import { useAuth } from '@clerk/clerk-react'
import type {
  FindOrganizationById,
  FindOrganizationByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Organization from 'src/components/Organization/Organization'

export const QUERY: TypedDocumentNode<
  FindOrganizationById,
  FindOrganizationByIdVariables
> = gql`
  query FindOrganizationById($id: Int!) {
    organization: organization(id: $id) {
      id
      regnr
      name
      description
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Organization not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindOrganizationByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  organization,
}: CellSuccessProps<FindOrganizationById, FindOrganizationByIdVariables>) => {
  return <Organization organization={organization} />
}

import type { FindUserById, FindUserByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Spinner from 'src/components/ui/Spinner'
import User from 'src/components/User/User'

export const QUERY: TypedDocumentNode<FindUserById, FindUserByIdVariables> =
  gql`
    query FindUserById($id: Int!) {
      user: user(id: $id) {
        id
        clerkId
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
export const Empty = () => <div>User not found</div>

export const Failure = ({ error }: CellFailureProps<FindUserByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  user,
}: CellSuccessProps<FindUserById, FindUserByIdVariables>) => {
  return <User user={user} />
}

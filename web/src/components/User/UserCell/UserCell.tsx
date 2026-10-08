import type { FindUserById, FindUserByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import User from 'src/components/User/User'
import PageLoading from 'src/components/ui/PageLoading'

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
        status
        organizationId
      }
    }
  `

export const Loading = PageLoading
export const Empty = () => <div>User not found</div>

export const Failure = ({ error }: CellFailureProps<FindUserByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  user,
}: CellSuccessProps<FindUserById, FindUserByIdVariables>) => {
  return <User user={user} />
}

import type { FindTripById, FindTripByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Trip from 'src/components/Trip/Trip'
import Spinner from 'src/components/ui/Spinner'

export const QUERY: TypedDocumentNode<FindTripById, FindTripByIdVariables> =
  gql`
    query FindTripById($id: Int!) {
      trip: trip(id: $id) {
        id
        name
        description
        startDate
        endDate
        userId
        approvedDate
        reimbursementStatus
        transactionId
      }
    }
  `

export const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner />
  </div>
)

export const Empty = () => <div>Trip not found</div>

export const Failure = ({ error }: CellFailureProps<FindTripByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  trip,
}: CellSuccessProps<FindTripById, FindTripByIdVariables>) => {
  return <Trip trip={trip} />
}

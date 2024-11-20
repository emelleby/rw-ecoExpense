import type { FindTrips, FindTripsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Trips from 'src/components/Trip/Trips'

export const QUERY: TypedDocumentNode<FindTrips, FindTripsVariables> = gql`
  query FindTrips {
    trips {
      id
      name
      startDate
      endDate
      userId
      approvedDate
      reimbursementStatus
      transactionId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No trips yet.{' '}
      <Link to={routes.newTrip()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindTrips>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  trips,
}: CellSuccessProps<FindTrips, FindTripsVariables>) => {
  return <Trips trips={trips} />
}

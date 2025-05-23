import type { FindTripById, FindTripByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Spinner from 'src/components/ui/Spinner'

import TripReport from '../TripReport/TripReport'

export const QUERY: TypedDocumentNode<FindTripById, FindTripByIdVariables> =
  gql`
    query FindTripByIdForReport($id: Int!) {
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
        projectId
        project {
          id
          name
        }
        user {
          id
          firstName
          lastName
          email
          homeAddress
          workAddress
          bankAccount
        }
        expenses {
          id
          scope1Co2Emissions
          scope2Co2Emissions
          scope3Co2Emissions
          totalCo2Emissions
          description
          merchant
          receipt {
            url
          }
          categoryId
          nokAmount
          kwh
          date
          category {
            name
          }
        }
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
  return <TripReport trip={trip} />
}

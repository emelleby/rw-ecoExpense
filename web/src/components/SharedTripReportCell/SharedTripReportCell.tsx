import type {
  FindSharedTripByToken,
  FindSharedTripByTokenVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'


import TripReport from '../TripReport/TripReport'
import PageLoading from 'src/components/ui/PageLoading'

export const QUERY: TypedDocumentNode<
  FindSharedTripByToken,
  FindSharedTripByTokenVariables
> = gql`
  query FindSharedTripByToken($token: String!) {
    trip: sharedTripReport(token: $token) {
      id
      name
      description
      startDate
      endDate
      userId
      approvedDate
      reimbursementStatus
      transactionId
      secondaryCurrency
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
        iban
        swiftBic
        internationalAccountName
        internationalBankAddress
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
        secondaryAmount
        kwh
        date
        category {
          name
        }
      }
    }
  }
`

export const Loading = PageLoading

export const Empty = () => <div>Trip not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindSharedTripByTokenVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  trip,
}: CellSuccessProps<FindSharedTripByToken, FindSharedTripByTokenVariables>) => {
  return <TripReport trip={trip} />
}

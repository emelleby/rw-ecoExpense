import type { FindExpenseById, FindExpenseByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Expense from 'src/components/Expense/Expense'

export const QUERY: TypedDocumentNode<
  FindExpenseById,
  FindExpenseByIdVariables
> = gql`
  query FindExpenseById($id: Int!) {
    expense: expense(id: $id) {
      id
      userId
      categoryId
      amount
      currency
      exchangeRate
      nokAmount
      date
      description
      kilometers
      fuelType
      fuelAmountLiters
      sectorId
      supplierId
      tripId
      projectId
      scope1Co2Emissions
      scope2Co2Emissions
      scope3Co2Emissions
      kwh
      scope3CategoryId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Expense not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindExpenseByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  expense,
}: CellSuccessProps<FindExpenseById, FindExpenseByIdVariables>) => {
  return <Expense expense={expense} />
}

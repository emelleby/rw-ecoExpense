import type { FindExpenses, FindExpensesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Expenses from 'src/components/Expense/Expenses'

export const QUERY: TypedDocumentNode<FindExpenses, FindExpensesVariables> =
  gql`
    query FindExpenses {
      expenses {
        id
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
        userId
        scope1Co2Emissions
        scope2Co2Emissions
        scope3Co2Emissions
        kwh
        scope3CategoryId
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No expenses yet.{' '}
      <Link to={routes.newExpense()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindExpenses>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  expenses,
}: CellSuccessProps<FindExpenses, FindExpensesVariables>) => {
  return <Expenses expenses={expenses} />
}

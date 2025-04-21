import type { FindExpenses, FindExpensesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Expenses from 'src/components/Expense/Expenses'
import Spinner from 'src/components/ui/Spinner'

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
        merchant
        kilometers
        fuelType
        fuelAmountLiters
        sectorId
        supplierId
        tripId
        trip {
          reimbursementStatus
        }
        projectId
        userId
        scope1Co2Emissions
        scope2Co2Emissions
        scope3Co2Emissions
        totalCo2Emissions
        kwh
        scope3CategoryId
        receipt {
          url
        }
        category {
          name
        }
      }
    }
  `

export const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner />
  </div>
)

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
  <div className="rw-cell-error">Failure: {error?.message}</div>
)

export const Success = ({
  expenses,
}: CellSuccessProps<FindExpenses, FindExpensesVariables>) => {
  return <Expenses expenses={expenses} />
}

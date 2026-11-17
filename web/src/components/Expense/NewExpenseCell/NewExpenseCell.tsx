import type {
  CreateExpenseMutation,
  CreateExpenseInput,
  CreateExpenseMutationVariables,
  NewExpenseFormData,
  NewExpenseFormDataVariables,
} from 'types/graphql'

import { Link, navigate, routes } from '@redwoodjs/router'
import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ExpenseForm from 'src/components/Expense/ExpenseForm'
import PageLoading from 'src/components/ui/PageLoading'
import useLoader from 'src/hooks/useLoader'

export const QUERY: TypedDocumentNode<
  NewExpenseFormData,
  NewExpenseFormDataVariables
> = gql`
  query NewExpenseFormData {
    expenseCategories {
      id
      name
      group
    }
    tripsByUser {
      id
      name
      reimbursementStatus
    }
  }
`

const CREATE_EXPENSE_MUTATION: TypedDocumentNode<
  CreateExpenseMutation,
  CreateExpenseMutationVariables
> = gql`
  mutation CreateExpenseMutation($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      receipt {
        id
        url
        fileName
        fileType
      }
    }
  }
`

export const Loading = PageLoading

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">Error loading data: {error?.message}</div>
)

export const Success = ({
  expenseCategories,
  tripsByUser,
}: CellSuccessProps<NewExpenseFormData>) => {
  const { showLoader, hideLoader, Loader } = useLoader()

  const [createExpense, { loading, error }] = useMutation(
    CREATE_EXPENSE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Expense created')
        navigate(routes.expenses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = async (input: CreateExpenseInput) => {
    showLoader()
    await createExpense({ variables: { input } })
    hideLoader()
  }

  const trips = tripsByUser.filter(
    (trip) => trip.reimbursementStatus === 'NOT_REQUESTED'
  )

  if (trips.length === 0) {
    return (
      <div className="rw-text-center">
        <p>There are no open trips available.</p>
        <p>
          Please open a trip on the{' '}
          <Link to={routes.trips()} className="rw-link">
            Trips page
          </Link>{' '}
          or create a{' '}
          <Link to={routes.newTrip()} className="rw-link">
            new trip
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Expense</h2>
      </header>
      <div className="rw-segment-main">
        <ExpenseForm
          trips={trips}
          categories={expenseCategories}
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
      <Loader />
    </div>
  )
}

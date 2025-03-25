import type {
  CreateExpenseMutation,
  CreateExpenseInput,
  CreateExpenseMutationVariables,
  TripsByUser,
  TripsByUserVariables,
} from 'types/graphql'

import { Link, navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ExpenseForm from 'src/components/Expense/ExpenseForm'
import Spinner from 'src/components/ui/Spinner'
import useLoader from 'src/hooks/useLoader'
// Add a query to fetch categories
const CATEGORIES_QUERY = gql`
  query ExpenseCategories {
    expenseCategories {
      id
      name
    }
  }
`
const QUERY: TypedDocumentNode<TripsByUser, TripsByUserVariables> = gql`
  query TripsByUserForNewExpense {
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
const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner />
  </div>
)

const NewExpense = () => {
  const { showLoader, hideLoader, Loader } = useLoader()

  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(CATEGORIES_QUERY)

  const {
    data: tripsData,
    loading: tripsLoading,
    error: tripsError,
  } = useQuery(QUERY, {
    onCompleted: (data) => {
      console.log('Trips data loaded:', data)
    },
    notifyOnNetworkStatusChange: true,
  })

  console.log('Data: ', tripsData)

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
    console.log('Input received for NewExpense:', input)
    showLoader()
    await createExpense({ variables: { input } })
    hideLoader()
  }

  // Handle loading states
  if (categoryLoading || tripsLoading) {
    return <Loading />
  }

  // Handle errors -  || tripsError || projectsError
  if (categoryError) {
    return <div>Error loading category data</div>
  }

  const trips =
    tripsData?.tripsByUser.filter(
      (trip) => trip.reimbursementStatus === 'NOT_REQUESTED'
    ) || []

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
          categories={categoryData?.expenseCategories}
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
      <Loader />
    </div>
  )
}

export default NewExpense

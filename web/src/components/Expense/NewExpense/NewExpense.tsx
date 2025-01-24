import type {
  CreateExpenseMutation,
  CreateExpenseInput,
  CreateExpenseMutationVariables,
  TripsByUser,
  TripsByUserVariables,
  FindProjectsbyUser,
  FindProjectsbyUserVariables,
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

const QUERY: TypedDocumentNode<TripsByUser, TripsByUserVariables> = gql`
  query TripsByUserForNewExpense {
    tripsByUser {
      id
      name
      reimbursementStatus
    }
  }
`

const PROJECTQUERY: TypedDocumentNode<
  FindProjectsbyUser,
  FindProjectsbyUserVariables
> = gql`
  query FindProjectsbyUserForNewExpense {
    projects {
      id
      name
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

  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useQuery(PROJECTQUERY)

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

  // const onSave = async (input: CreateExpenseInput) => {
  //   const { receipt, ...expenseData } = input

  //   // Ensure the receipt fields are handled properly
  //   const createExpenseInput: CreateExpenseInput = {
  //     ...expenseData,
  //     receipt: receipt
  //       ? {
  //           url: receipt.url,
  //           fileName: receipt.fileName,
  //           fileType: receipt.fileType,
  //         }
  //       : undefined, // Omit receipt if not provided
  //   }

  //   await createExpense({
  //     variables: { input: createExpenseInput },
  //   })
  // }

  // Handle loading states
  if (categoryLoading || tripsLoading || projectsLoading) {
    return <Loading />
  }

  // Handle errors
  if (categoryError || tripsError || projectsError) {
    return <div>Error loading data</div>
  }

  const trips = tripsData?.tripsByUser || []

  if (trips.length === 0) {
    return (
      <div className="rw-text-center">
        No open trip has found you need to create trip or open one{' '}
        <Link to={routes.trips()} className="rw-link">
          Go to Trips
        </Link>
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
          projects={projectsData?.projects || []}
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

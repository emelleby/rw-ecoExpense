import type {
  CreateExpenseMutation,
  CreateExpenseInput,
  CreateExpenseMutationVariables,
  TripsByUser,
  TripsByUserVariables,
  FindProjectsbyUser,
  FindProjectsbyUserVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
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
  const { data: categoryData } = useQuery(CATEGORIES_QUERY)

  const { showLoader, hideLoader, Loader } = useLoader()

  const { data: tripsData, loading: tripsLoading } = useQuery(QUERY)
  const { data: projectsData, loading: projectsLoading } =
    useQuery(PROJECTQUERY)

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

  if (tripsLoading || projectsLoading) {
    return <Loading />
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Expense</h2>
      </header>
      <div className="rw-segment-main">
        <ExpenseForm
          trips={tripsData?.tripsByUser}
          projects={projectsData?.projects}
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

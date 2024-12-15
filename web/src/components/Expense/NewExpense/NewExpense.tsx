import type {
  CreateExpenseMutation,
  CreateExpenseInput,
  CreateExpenseMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ExpenseForm from 'src/components/Expense/ExpenseForm'
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

const NewExpense = () => {
  const { data: categoryData } = useQuery(CATEGORIES_QUERY)
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
    await createExpense({ variables: { input } })
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

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Expense</h2>
      </header>
      <div className="rw-segment-main">
        <ExpenseForm
          categories={categoryData?.expenseCategories}
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewExpense

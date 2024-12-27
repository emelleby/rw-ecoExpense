import type {
  EditExpenseById,
  FindProjectsbyUser,
  FindProjectsbyUserVariables,
  TripsByUser,
  TripsByUserVariables,
  UpdateExpenseInput,
  UpdateExpenseMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ExpenseForm from 'src/components/Expense/ExpenseForm'
import Spinner from 'src/components/ui/Spinner'

export const QUERY: TypedDocumentNode<EditExpenseById> = gql`
  query EditExpenseById($id: Int!) {
    expense: expense(id: $id) {
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
      receipt {
        id
        url
        fileName
        fileType
      }
    }
    expenseCategories {
      id
      name
    }
  }
`

const UPDATE_EXPENSE_MUTATION: TypedDocumentNode<
  EditExpenseById,
  UpdateExpenseMutationVariables
> = gql`
  mutation UpdateExpenseMutation($id: Int!, $input: UpdateExpenseInput!) {
    updateExpense(id: $id, input: $input) {
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

const TRIPS_QUERY: TypedDocumentNode<TripsByUser, TripsByUserVariables> = gql`
  query TripsByUser {
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
  query FindProjectsbyUser {
    projects {
      id
      name
    }
  }
`

export const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner />
  </div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  expense,
  expenseCategories,
}: CellSuccessProps<EditExpenseById>) => {
  const [updateExpense, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_EXPENSE_MUTATION, {
      onCompleted: () => {
        toast.success('Expense updated')
        navigate(routes.expenses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const {
    data: tripsData,
    loading: tripsLoading,
    error: tripsError,
  } = useQuery(TRIPS_QUERY)
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useQuery(PROJECTQUERY)

  if (tripsLoading || projectsLoading) {
    return <Loading />
  }

  if (tripsError || projectsError) {
    return <Failure error={tripsError || projectsError} />
  }

  const onSave = (
    input: UpdateExpenseInput,
    id: EditExpenseById['expense']['id']
  ) => {
    updateExpense({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Expense {expense?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ExpenseForm
          trips={tripsData?.tripsByUser}
          projects={projectsData?.projects}
          expense={expense}
          categories={expenseCategories}
          onSave={onSave}
          error={updateError}
          loading={updateLoading}
        />
      </div>
    </div>
  )
}

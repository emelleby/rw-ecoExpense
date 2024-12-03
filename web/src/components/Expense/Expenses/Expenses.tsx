import type {
  DeleteExpenseMutation,
  DeleteExpenseMutationVariables,
  FindExpenses,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Expense/ExpensesCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_EXPENSE_MUTATION: TypedDocumentNode<
  DeleteExpenseMutation,
  DeleteExpenseMutationVariables
> = gql`
  mutation DeleteExpenseMutation($id: Int!) {
    deleteExpense(id: $id) {
      id
    }
  }
`

const ExpensesList = ({ expenses }: FindExpenses) => {
  const [deleteExpense] = useMutation(DELETE_EXPENSE_MUTATION, {
    onCompleted: () => {
      toast.success('Expense deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteExpenseMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete expense ' + id + '?')) {
      deleteExpense({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Category id</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Exchange rate</th>
            <th>Nok amount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Kilometers</th>
            <th>Fuel type</th>
            <th>Fuel amount liters</th>
            <th>Sector id</th>
            <th>Supplier id</th>
            <th>Trip id</th>
            <th>Project id</th>
            <th>User id</th>
            <th>Receipt filename</th>
            <th>Receipt path</th>
            <th>Receipt uploaded at</th>
            <th>Scope1 co2 emissions</th>
            <th>Scope2 co2 emissions</th>
            <th>Scope3 co2 emissions</th>
            <th>Kwh</th>
            <th>Scope3 category id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{truncate(expense.id)}</td>
              <td>{truncate(expense.categoryId)}</td>
              <td>{truncate(expense.amount)}</td>
              <td>{truncate(expense.currency)}</td>
              <td>{truncate(expense.exchangeRate)}</td>
              <td>{truncate(expense.nokAmount)}</td>
              <td>{timeTag(expense.date)}</td>
              <td>{truncate(expense.description)}</td>
              <td>{truncate(expense.kilometers)}</td>
              <td>{truncate(expense.fuelType)}</td>
              <td>{truncate(expense.fuelAmountLiters)}</td>
              <td>{truncate(expense.sectorId)}</td>
              <td>{truncate(expense.supplierId)}</td>
              <td>{truncate(expense.tripId)}</td>
              <td>{truncate(expense.projectId)}</td>
              <td>{truncate(expense.userId)}</td>
              <td>{truncate(expense.receiptFilename)}</td>
              <td>{truncate(expense.receiptPath)}</td>
              <td>{timeTag(expense.receiptUploadedAt)}</td>
              <td>{truncate(expense.scope1Co2Emissions)}</td>
              <td>{truncate(expense.scope2Co2Emissions)}</td>
              <td>{truncate(expense.scope3Co2Emissions)}</td>
              <td>{truncate(expense.kwh)}</td>
              <td>{truncate(expense.scope3CategoryId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.expense({ id: expense.id })}
                    title={'Show expense ' + expense.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editExpense({ id: expense.id })}
                    title={'Edit expense ' + expense.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete expense ' + expense.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(expense.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpensesList

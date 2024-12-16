import type {
  DeleteExpenseMutation,
  DeleteExpenseMutationVariables,
  FindExpenseById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

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

interface Props {
  expense: NonNullable<FindExpenseById['expense']>
}

const Expense = ({ expense }: Props) => {
  const [deleteExpense] = useMutation(DELETE_EXPENSE_MUTATION, {
    onCompleted: () => {
      toast.success('Expense deleted')
      navigate(routes.expenses())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteExpenseMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete expense ' + id + '?')) {
      deleteExpense({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Expense {expense.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{expense.id}</td>
            </tr>
            <tr>
              <th>Category id</th>
              <td>{expense.categoryId}</td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>{expense.amount}</td>
            </tr>
            <tr>
              <th>Currency</th>
              <td>{expense.currency}</td>
            </tr>
            <tr>
              <th>Exchange rate</th>
              <td>{expense.exchangeRate}</td>
            </tr>
            <tr>
              <th>Nok amount</th>
              <td>{expense.nokAmount}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{timeTag(expense.date)}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{expense.description}</td>
            </tr>
            <tr>
              <th>Kilometers</th>
              <td>{expense.kilometers}</td>
            </tr>
            <tr>
              <th>Fuel type</th>
              <td>{expense.fuelType}</td>
            </tr>
            <tr>
              <th>Fuel amount liters</th>
              <td>{expense.fuelAmountLiters}</td>
            </tr>
            <tr>
              <th>Sector id</th>
              <td>{expense.sectorId}</td>
            </tr>
            <tr>
              <th>Supplier id</th>
              <td>{expense.supplierId}</td>
            </tr>
            <tr>
              <th>Trip id</th>
              <td>{expense.tripId}</td>
            </tr>
            <tr>
              <th>Project id</th>
              <td>{expense.projectId}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{expense.userId}</td>
            </tr>

            <tr>
              <th>Scope1 co2 emissions</th>
              <td>{expense.scope1Co2Emissions}</td>
            </tr>
            <tr>
              <th>Scope2 co2 emissions</th>
              <td>{expense.scope2Co2Emissions}</td>
            </tr>
            <tr>
              <th>Scope3 co2 emissions</th>
              <td>{expense.scope3Co2Emissions}</td>
            </tr>
            <tr>
              <th>Kwh</th>
              <td>{expense.kwh}</td>
            </tr>
            <tr>
              <th>Scope3 category id</th>
              <td>{expense.scope3CategoryId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editExpense({ id: expense.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(expense.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Expense

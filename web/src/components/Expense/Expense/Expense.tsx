import type {
  DeleteExpenseMutationVariables,
  FindExpenseById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ReceiptPreview from 'src/components/ReceiptPreview/ReceiptPreview'
import { Alert, AlertDescription } from 'src/components/ui/Alert'
import { timeTag } from 'src/lib/formatters'

const DELETE_SINGLE_EXPENSE_MUTATION = gql`
  mutation DeleteSingleExpenseMutation($id: Int!) {
    deleteExpense(id: $id) {
      ... on Expense {
        id
      }
      ... on ExpenseValidationError {
        message
      }
    }
  }
`

interface Props {
  expense: NonNullable<FindExpenseById['expense']>
}

const Expense = ({ expense }: Props) => {
  const [deleteExpense] = useMutation(DELETE_SINGLE_EXPENSE_MUTATION, {
    onCompleted: (data) => {
      if ('message' in data.deleteExpense) {
        // This is a validation error
        toast.error(data.deleteExpense.message)
      } else {
        toast.success('Expense deleted')
        navigate(routes.expenses())
      }
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

  const isExpenseEditable = (tripStatus: string) => {
    return !['PENDING', 'REIMBURSED'].includes(tripStatus)
  }

  // `|| null` hides zero-default fields (kilometers, fuel, kWh, scopes) that
  // only apply to certain expense types; the filter drops rows without data.
  const userName =
    [expense.user.firstName, expense.user.lastName].filter(Boolean).join(' ') ||
    expense.user.username
  const rows: Array<[string, unknown]> = [
    ['Id', expense.id],
    ['Category', expense.category.name],
    ['Amount', expense.amount],
    ['Currency', expense.currency],
    ['Exchange rate', expense.exchangeRate],
    ['Nok amount', expense.nokAmount],
    ['Date', timeTag(expense.date)],
    ['Description', expense.description],
    ['Kilometers', expense.kilometers || null],
    ['Fuel type', expense.fuelType],
    ['Fuel amount liters', expense.fuelAmountLiters || null],
    ['Sector', expense.Sector?.name ?? null],
    ['Trip', expense.trip.name],
    ['Project', expense.project?.name ?? null],
    ['User', userName],
    ['Scope1 co2 emissions', expense.scope1Co2Emissions || null],
    ['Scope2 co2 emissions', expense.scope2Co2Emissions || null],
    ['Scope3 co2 emissions', expense.scope3Co2Emissions || null],
    ['Kwh', expense.kwh || null],
  ]

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Expense {expense.id} Detail
          </h2>
        </header>
        {!isExpenseEditable(expense.trip.reimbursementStatus) && (
          <Alert variant="warning" className="mb-4">
            <AlertDescription>
              {expense.trip.reimbursementStatus === 'PENDING'
                ? 'This expense cannot be modified because the trip is pending reimbursement'
                : 'This expense cannot be modified because the trip has been reimbursed'}
            </AlertDescription>
          </Alert>
        )}
        <table className="rw-table">
          <tbody>
            {rows
              .filter(
                ([, value]) =>
                  value !== null && value !== undefined && value !== ''
              )
              .map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {expense.receipt && (
          <div className="border-t px-4 py-4">
            <h3 className="rw-heading rw-heading-secondary mb-2">Receipt</h3>
            <ReceiptPreview
              url={expense.receipt.url}
              fileType={expense.receipt.fileType}
              fileName={expense.receipt.fileName}
              className="max-h-96 w-auto max-w-full rounded-lg border object-contain"
            />
          </div>
        )}
      </div>
      <nav className="rw-button-group">
        <Link
          to={
            isExpenseEditable(expense.trip.reimbursementStatus)
              ? routes.editExpense({ id: expense.id })
              : '#'
          }
          className={`rw-button ${!isExpenseEditable(expense.trip.reimbursementStatus) ? 'rw-button-disabled opacity-50' : 'rw-button-blue'}`}
          onClick={(e) => {
            if (!isExpenseEditable(expense.trip.reimbursementStatus)) {
              e.preventDefault()
              toast.error(
                `Cannot edit expenses for trips that are ${expense.trip.reimbursementStatus.toLowerCase()}. Pending trips can be opened from the all trips page.`
              )
            }
          }}
        >
          Edit
        </Link>
        <button
          type="button"
          className={`rw-button ${!isExpenseEditable(expense.trip.reimbursementStatus) ? 'rw-button-disabled cursor-not-allowed opacity-50' : 'rw-button-red'}`}
          onClick={() => onDeleteClick(expense.id)}
          disabled={!isExpenseEditable(expense.trip.reimbursementStatus)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}
export default Expense

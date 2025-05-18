import { MoreHorizontal } from 'lucide-react'
import type { DeleteExpenseMutationVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Expense/ExpensesCell'
import { Button } from 'src/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/DropdownMenu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/ui/Tooltip'

const DELETE_EXPENSE_MUTATION = gql`
  mutation DeleteExpenseMutation($id: Int!) {
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

interface ExpenseActionsProps {
  id: DeleteExpenseMutationVariables['id']
  tripStatus: string
}

const isExpenseEditable = (tripStatus: string) => {
  return !['PENDING', 'REIMBURSED'].includes(tripStatus)
}

export function ExpenseActions({ id, tripStatus }: ExpenseActionsProps) {
  const [deleteExpense] = useMutation(DELETE_EXPENSE_MUTATION, {
    onCompleted: (data) => {
      if ('message' in data.deleteExpense) {
        // This is a validation error
        toast.error(data.deleteExpense.message)
      } else {
        toast.success('Expense deleted')
      }
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

  const disabledReason = !isExpenseEditable(tripStatus)
    ? tripStatus === 'PENDING'
      ? 'This expense cannot be modified because the trip is pending reimbursement'
      : 'This expense cannot be modified because the trip has been reimbursed'
    : ''

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 bg-muted p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <Link to={routes.expense({ id })}>
            <DropdownMenuItem>Show</DropdownMenuItem>
          </Link>

          {isExpenseEditable(tripStatus) ? (
            <Link to={routes.editExpense({ id })}>
              <DropdownMenuItem className="text-sky-600">Edit</DropdownMenuItem>
            </Link>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuItem
                  className="cursor-not-allowed text-sky-600 opacity-50"
                  onClick={() =>
                    toast.error(
                      `Cannot edit expenses for trips that are ${tripStatus.toLowerCase()}`
                    )
                  }
                >
                  Edit
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{disabledReason}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {isExpenseEditable(tripStatus) ? (
            <DropdownMenuItem
              className="text-rose-500"
              onClick={() => onDeleteClick(id)}
            >
              Delete
            </DropdownMenuItem>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuItem
                  className="cursor-not-allowed text-rose-500 opacity-50"
                  onClick={() =>
                    toast.error(
                      `Cannot delete expenses for trips that are ${tripStatus.toLowerCase()}`
                    )
                  }
                >
                  Delete
                </DropdownMenuItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{disabledReason}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

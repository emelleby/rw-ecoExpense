import { MoreHorizontal } from 'lucide-react'
import {
  DeleteExpenseMutation,
  DeleteExpenseMutationVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Expense/ExpensesCell'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/DropdownMenu'

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

interface ExpenseActionsProps {
  id: DeleteExpenseMutationVariables['id']
}

export function ExpenseActions({ id }: ExpenseActionsProps) {
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

        <Link to={routes.editExpense({ id })}>
          <DropdownMenuItem className="text-sky-600">Edit</DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="text-rose-600"
          onClick={() => {
            onDeleteClick(id)
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

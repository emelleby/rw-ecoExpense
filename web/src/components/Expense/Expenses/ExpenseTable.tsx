import type { UpdateReimbursementStatusInput } from 'types/graphql'

import { TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Trip/TripCell/TripCell'
import { Button } from 'src/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/Table'

import ImageDialog from '../../Trip/Trip/ImageDialog'

import { ExpenseActions } from './ExpenseActions'

import { formatCurrency } from '@/lib/formatters'

export type ExpenseCategory =
  | 'Accommodation'
  | 'Car distance-based'
  | 'Fuel Expenses'
  | 'Flights'
  | 'Other Miscellaneous'
  | 'Groceries'

interface Expense {
  id: string
  category: ExpenseCategory
  amount: number
  emissions: number
  date: string
  description: string
  imageUrl: string
}

interface ExpenseChartProps {
  data: Expense[]
  showReimburseButton: boolean
  tripId: number
  tripStatus: string
}

const Update_Reimbursement_Status: TypedDocumentNode<UpdateReimbursementStatusInput> = gql`
  mutation UpdateReimbursementStatus(
    $reimbursementStatus: ReimbursementStatus!
    $id: Int!
  ) {
    updateReimbursementStatus(
      reimbursementStatus: $reimbursementStatus
      id: $id
    )
  }
`

export function ExpenseTable({
  data,
  showReimburseButton = true,
  tripId,
  tripStatus,
}: ExpenseChartProps) {
  console.log('Data in Table; ', data)
  const [updateReimbursementStatus] = useMutation(Update_Reimbursement_Status, {
    onCompleted: () => {
      toast.success('Trip updated')
      //navigate(routes.trips())
    },
    onError: (error) => {
      toast.error(error.message)
    },

    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const handleReimburse = async () => {
    try {
      const data = await updateReimbursementStatus({
        variables: { reimbursementStatus: 'PENDING', id: tripId },
      })

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Actions</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Emissions</TableHead>
            <TableHead className="text-right">Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((expense) => (
            <TableRow key={`${expense.id}_${expense.date}`}>
              <TableCell>
                <ExpenseActions
                  id={Number(expense.id)}
                  tripStatus={tripStatus}
                />
              </TableCell>
              <TableCell>
                {new Date(expense.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(expense.amount)} NOK
              </TableCell>
              <TableCell className="text-right">
                {expense.emissions.toFixed(2)} kg Co2e
              </TableCell>
              <TableCell className="text-right">
                <ImageDialog
                  imageUrl={expense.imageUrl}
                  title="Example Image"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>{' '}
        {showReimburseButton && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={1000} className="text-center">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleReimburse()}
                >
                  Reimburse
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  )
}

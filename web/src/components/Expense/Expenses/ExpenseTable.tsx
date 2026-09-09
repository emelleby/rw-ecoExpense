import type { UpdateReimbursementStatusInput } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Trip/TripCell/TripCell'
import { Alert, AlertDescription } from 'src/components/ui/Alert'
import { Button } from 'src/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/Table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/ui/Tooltip'

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
  tripStatus?: string // Add trip status to each expense
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
  // console.log('Data in Table; ', data)
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
    <TooltipProvider>
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
            {data.map((expense) => {
              // Use each expense's individual trip status
              const expenseTripStatus = expense.tripStatus || tripStatus
              const isModificationDisabled = expenseTripStatus === 'PENDING' || expenseTripStatus === 'REIMBURSED'
              const disabledReason = isModificationDisabled
                ? expenseTripStatus === 'PENDING'
                  ? 'This expense cannot be modified because the trip is pending reimbursement'
                  : 'This expense cannot be modified because the trip has been reimbursed'
                : ''

              return (
                <TableRow
                  key={`${expense.id}_${expense.date}`}
                  className={isModificationDisabled ? 'opacity-80 bg-muted' : ''}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ExpenseActions
                        id={Number(expense.id)}
                        tripStatus={expenseTripStatus}
                      />
                      {isModificationDisabled && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help text-muted-foreground">🔒</span>
                          </TooltipTrigger>
                          <TooltipContent side="right" sideOffset={5} className="z-[100]">
                            <p>{disabledReason}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
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
              )
            })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={1000} className="space-x-6 text-center">
              {showReimburseButton && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleReimburse()}
                >
                  Reimburse
                </Button>
              )}
              <Button variant="link" size="sm" asChild>
                <Link to={routes.tripReport({ id: tripId })}>View report</Link>
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
    </TooltipProvider>
  )
}

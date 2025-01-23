import { Badge } from 'src/components/ui/Badge'
import { formatEnum } from 'src/lib/formatters'

import { ExpenseTable } from './ExpenseTable'

type ExpenseCategory =
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

interface ExpenseDetailsProps {
  data: Expense[]
  reimbursementStatus: string
  tripId: number
}

export function ExpenseDetails({
  data,
  reimbursementStatus,
  tripId,
}: ExpenseDetailsProps) {
  const showReimburseButton =
    reimbursementStatus === 'NOT_REQUESTED' && data.length > 0

  return (
    <div className="mx-auto w-full space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            A list of all expenses for the trip
          </p>
        </div>
        <Badge variant="destructive">{formatEnum(reimbursementStatus)}</Badge>
      </div>

      <ExpenseTable
        data={data}
        showReimburseButton={showReimburseButton}
        tripId={tripId}
      />
    </div>
  )
}

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

// Add this helper function above your component
const getBadgeVariant = (status: string) => {
  switch (status) {
    case 'REIMBURSED':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'NOT_REQUESTED':
      return 'destructive'
    default:
      return 'default'
  }
}

export function ExpenseDetails({
  data,
  reimbursementStatus,
  tripId,
}: ExpenseDetailsProps) {
  console.log('Expense Details Data:', data)
  const showReimburseButton =
    reimbursementStatus === 'NOT_REQUESTED' && data.length > 0

  return (
    <div className="mx-auto w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <div>
          <p className="text-muted-foreground">
            A list of all expenses for the trip
          </p>
        </div>

        <Badge variant={getBadgeVariant(reimbursementStatus)}>
          {formatEnum(reimbursementStatus)}
        </Badge>
      </div>

      <ExpenseTable
        data={data}
        showReimburseButton={showReimburseButton}
        tripId={tripId}
      />
    </div>
  )
}

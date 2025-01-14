import { Badge } from 'src/components/ui/Badge'

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
}

export function ExpenseDetails({ data }: ExpenseDetailsProps) {
  return (
    <div className="mx-auto w-full space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            A list of all expenses for the trip
          </p>
        </div>
        <Badge variant="destructive">NOT REIMBURSED</Badge>
      </div>

      <ExpenseTable data={data} />
    </div>
  )
}

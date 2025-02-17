import { routes, navigate } from '@redwoodjs/router'

import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/Card'

import { formatCurrency } from '@/lib/formatters'

export type ExpenseCategory =
  | 'Accommodation'
  | 'Car distance-based'
  | 'Fuel expenses'
  | 'Flights'
  | 'Other Miscellaneous'

interface Expense {
  id: string
  category: ExpenseCategory
  amount: number
  emissions: number
  date: string
  description: string
}

interface RecentExpensesProps {
  expenses: Expense[]
  displayType: 'amount' | 'emissions'
}

export function RecentExpenses({ expenses, displayType }: RecentExpensesProps) {
  const sortedExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {sortedExpenses.map((expense) => (
          <Card
            key={`${expense.id}_${expense.date}`}
            className="flex justify-between bg-accent p-4"
          >
            <div className="space-y-2">
              <p className="font-medium">{expense.category}</p>
              <p className="text-sm ">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-lg font-bold ">
                {displayType === 'amount' ? (
                  <>
                    {formatCurrency(expense.amount)}
                    <span className="text-base font-medium text-muted-foreground">
                      {' '}
                      NOK
                    </span>
                  </>
                ) : (
                  <>
                    {expense.emissions.toFixed(1)}
                    <span className="text-sm font-bold text-muted-foreground">
                      {' '}
                      Kg CO2e
                    </span>
                  </>
                )}
              </p>
              <Button
                variant="link"
                className="text-sky-600"
                onClick={() => {
                  navigate(routes.expense({ id: Number(expense.id) }))
                }}
              >
                View Expense
              </Button>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

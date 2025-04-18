import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
// import { Expense } from 'types/graphql'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/Card'

import { formatCurrency } from '@/lib/formatters'

const COLORS = {
  Accommodation: 'hsl(var(--chart-1))', // Blue
  'Car - distance-based': 'hsl(var(--chart-2))', // Red
  'Fuel Expenses': 'hsl(var(--chart-3))', // Green
  Flights: 'hsl(var(--chart-4))', // Orange
  Groceries: 'hsl(var(--chart-5))', // Purple
  'Other miscellaneous': 'hsl(var(--chart-6))', // Teal
} as const

export type ExpenseCategory =
  | 'Accommodation'
  | 'Car - distance-based'
  | 'Fuel Expenses'
  | 'Flights'
  | 'Other miscellaneous'
  | 'Groceries'

interface Expense {
  id: string
  category: ExpenseCategory
  amount: number
  emissions: number
  date: string
  description: string
}

interface ExpenseChartProps {
  data: Expense[]
  type: 'amount' | 'emissions'
}

export function ExpenseChart({ data, type }: ExpenseChartProps) {
  const chartData = Object.entries(
    data.reduce(
      (acc, expense) => {
        const value = type === 'amount' ? expense.amount : expense.emissions
        acc[expense.category] = (acc[expense.category] || 0) + value
        return acc
      },
      {} as Record<string, number>
    )
  ).map(([category, value]) => ({
    category,
    value,
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle>
          {type === 'amount' ? 'Expenses' : 'Emissions'}
          <span className="mt-2 block text-sm font-normal text-muted-foreground">
            {new Date().toLocaleDateString()} -{' '}
            {new Date().toLocaleDateString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[entry.category as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {formatCurrency(Math.round(total))}
              </div>
              <div className="text-base font-bold text-muted-foreground">
                {type === 'amount' ? 'NOK' : 'Kg CO2e'}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.map(({ category }) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[category as keyof typeof COLORS],
                }}
              />
              <span className="text-sm">{category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

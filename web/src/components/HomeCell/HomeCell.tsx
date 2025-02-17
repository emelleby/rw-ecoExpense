import {
  PlusCircle,
  Plane,
  TrendingUp,
  AlertCircle,
  DollarSign,
  LucideIcon,
} from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'

export const QUERY = gql`
  query DashboardQuery {
    dashboard {
      expenses {
        total
        percentageChange
        pending {
          amount
          count
        }
        recent {
          id
          type
          project
          trip
          amount
          status
        }
      }
      carbonFootprint {
        total
        percentageChange
        byCategory {
          category
          amount
          unit
        }
      }
    }
  }
`

export const Loading = () => (
  <div className="space-y-6">
    <div className="animate-pulse space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-32 rounded-lg bg-muted" />
        <div className="h-32 rounded-lg bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 rounded-lg bg-muted" />
        <div className="h-32 rounded-lg bg-muted" />
        <div className="h-32 rounded-lg bg-muted" />
      </div>
      <div className="h-64 rounded-lg bg-muted" />
      <div className="h-48 rounded-lg bg-muted" />
    </div>
  </div>
)

export const Empty = () => (
  <div className="space-y-6">
    <Alert variant="warning">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>No Data Available</AlertTitle>
      <AlertDescription>
        Start by adding your first expense to see your dashboard come to life.
      </AlertDescription>
    </Alert>
  </div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <Alert variant="destructive">
    <AlertCircle className="h-5 w-5" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error?.message}</AlertDescription>
  </Alert>
)

interface ActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

const ActionCard = ({
  icon: Icon,
  title,
  description,
  href,
}: ActionCardProps) => (
  <Link to={href}>
    <Card className="transition hover:shadow-lg">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  </Link>
)

interface MetricCardProps {
  title: string
  value: string
  subValue?: string
  icon: LucideIcon
  trend: number
}

const MetricCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
}: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p
        className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}
      >
        {trend > 0 ? '+' : ''}
        {trend.toFixed(1)}% from last month
      </p>
      {subValue && (
        <div className="mt-2 text-sm text-muted-foreground">{subValue}</div>
      )}
    </CardContent>
  </Card>
)

interface RecentExpense {
  id: number
  type: string
  project?: string
  trip?: string
  amount: number
  status: string
}

const RecentExpensesList = ({ expenses }: { expenses: RecentExpense[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Expenses</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
          >
            <div>
              <div className="font-medium">{expense.type}</div>
              <div className="text-sm text-muted-foreground">
                {expense.project || expense.trip}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium">${expense.amount.toFixed(2)}</div>
                <div
                  className={`text-sm ${
                    expense.status === 'REIMBURSED'
                      ? 'text-green-500'
                      : expense.status === 'PENDING'
                        ? 'text-orange-500'
                        : 'text-red-500'
                  }`}
                >
                  {expense.status
                    .split('_')
                    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(' ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

interface CarbonCategory {
  category: string
  amount: number
  unit: string
}

const CarbonImpactChart = ({
  categories,
}: {
  categories: CarbonCategory[]
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Carbon Impact by Category</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {categories.map((category) => (
        <div key={category.category}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <div>{category.category}</div>
            <div>
              {category.amount} {category.unit}
            </div>
          </div>
          <Progress
            value={
              (category.amount /
                categories.reduce((acc, cat) => acc + cat.amount, 0)) *
              100
            }
          />
        </div>
      ))}
    </CardContent>
  </Card>
)

interface DashboardData {
  expenses: {
    total: number
    percentageChange: number
    pending: {
      amount: number
      count: number
    }
    recent: RecentExpense[]
  }
  carbonFootprint: {
    total: number
    percentageChange: number
    byCategory: CarbonCategory[]
  }
}

export const Success = ({
  dashboard,
}: CellSuccessProps<{
  dashboard: DashboardData
}>) => {
  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <ActionCard
          icon={PlusCircle}
          title="New Expense"
          description="Add a new expense report"
          href={routes.newExpense()}
        />
        <ActionCard
          icon={Plane}
          title="New Trip"
          description="Create a new business trip"
          href={routes.newTrip()}
        />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Expenses"
          value={`$${dashboard.expenses.total.toFixed(2)}`}
          trend={dashboard.expenses.percentageChange}
          icon={DollarSign}
        />
        <MetricCard
          title="Pending Reimbursement"
          value={`$${dashboard.expenses.pending.amount.toFixed(2)}`}
          subValue={`${dashboard.expenses.pending.count} expenses pending`}
          trend={0}
          icon={TrendingUp}
        />
        <MetricCard
          title="Carbon Footprint"
          value={`${dashboard.carbonFootprint.total} kg`}
          trend={dashboard.carbonFootprint.percentageChange}
          icon={Plane}
        />
      </div>

      {/* Recent Expenses */}
      <RecentExpensesList expenses={dashboard.expenses.recent} />

      {/* Carbon Impact Chart */}
      <CarbonImpactChart categories={dashboard.carbonFootprint.byCategory} />
    </div>
  )
}

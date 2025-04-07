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
import { GlowEffect } from '@/components/ui/glow-effect'
import { Progress } from '@/components/ui/Progress'
import { formatCurrency } from '@/lib/formatters'

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
      }
      trips {
        id
        name
        description
        project
        reimbursementStatus
        expenseCount
        expenseAmount
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
  <Link to={href} className="h-full">
    <div className="relative h-full">
      <GlowEffect
        colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
        mode="colorShift"
        blur="strong"
        duration={3}
        scale={0.98}
      />
      <Card className="relative h-full transition hover:shadow-lg">
        <CardContent className="flex gap-4 p-6">
          <div className="h-10 rounded-lg bg-primary/10 p-2">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </Link>
)

interface MetricCardProps {
  title: string
  value: string
  subValue?: string
  icon: LucideIcon
  percentageChange?: number
}

const MetricCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  percentageChange,
}: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {percentageChange !== undefined && (
        <p
          className={`text-xs ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
        >
          {percentageChange > 0 ? '+' : ''}
          {percentageChange.toFixed(1)}% from last year to date
        </p>
      )}
      {subValue && (
        <div className="mt-2 text-sm text-muted-foreground">{subValue}</div>
      )}
    </CardContent>
  </Card>
)

interface RecentTrip {
  id: number
  name: string
  description: string
  project?: string
  reimbursementStatus: string
  expenseCount: number
  expenseAmount: number
}

const RecentTripsList = ({ trips }: { trips: RecentTrip[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Trips</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            to={routes.trip({ id: trip.id })}
            className="-mx-6 flex items-center justify-between border-b px-6 py-2 pb-4 transition-colors last:border-0 last:pb-0 hover:bg-muted/50"
          >
            <div>
              <div className="font-medium">{trip.name}</div>
              <div className="text-sm text-muted-foreground">
                {trip.description}
              </div>
              {trip.project && (
                <div className="text-sm text-muted-foreground">
                  {trip.project}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-1 text-right">
                <div className="text-sm text-muted-foreground">
                  {trip.expenseCount}{' '}
                  {trip.expenseCount === 1 ? 'expense' : 'expenses'}
                </div>
                <div className="font-medium">
                  NOK {formatCurrency(trip.expenseAmount)}
                </div>
                <div
                  className={`text-sm ${
                    trip.reimbursementStatus === 'REIMBURSED'
                      ? 'text-green-500'
                      : trip.reimbursementStatus === 'PENDING'
                        ? 'text-orange-500'
                        : 'text-red-500'
                  }`}
                >
                  {trip.reimbursementStatus
                    .split('_')
                    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(' ')}
                </div>
              </div>
            </div>
          </Link>
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
  }
  trips: RecentTrip[]
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
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
        <ActionCard
          icon={PlusCircle}
          title="New Expense"
          description="Add a new expense"
          href={routes.newExpense()}
        />

        <ActionCard
          icon={Plane}
          title="New Trip"
          description="Create a new business trip or group"
          href={routes.newTrip()}
        />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          title="Total Expenses"
          value={`NOK ${formatCurrency(dashboard.expenses.total.toFixed(2))}`}
          percentageChange={dashboard.expenses.percentageChange}
          icon={DollarSign}
        />

        <MetricCard
          title="Carbon Footprint"
          value={`${dashboard.carbonFootprint.total} kg Co2e`}
          percentageChange={dashboard.carbonFootprint.percentageChange}
          icon={Plane}
        />
        <MetricCard
          title="Pending Reimbursement"
          value={`NOK ${formatCurrency(dashboard.expenses.pending.amount.toFixed(2))}`}
          subValue={`${dashboard.expenses.pending.count} trips pending`}
          icon={TrendingUp}
        />
      </div>

      {/* Recent Trips */}
      <RecentTripsList trips={dashboard.trips} />

      {/* Carbon Impact Chart */}
      <CarbonImpactChart categories={dashboard.carbonFootprint.byCategory} />
    </div>
  )
}

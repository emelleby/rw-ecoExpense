import {
  PlusCircle,
  Plane,
  TrendingUp,
  AlertCircle,
  DollarSign,
  LucideIcon,
  Calendar,
  Building2,
  Globe,
  Receipt,
  Clock,
  BadgeCheck,
  BadgeAlert,
  BadgeHelp,
  CalendarRange,
} from 'lucide-react'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { GlowEffect } from '@/components/ui/glow-effect'
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
        emissions
        startDate
        endDate
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
  <div className="space-y-8">
    <Alert variant="info">
      <AlertCircle className="h-6 w-6" />
      <AlertTitle>No Data Yet</AlertTitle>
      <AlertDescription>
        Welcome! Start to add data to get started. Expenses are grouped into
        trips and trips belong to projects.
      </AlertDescription>
    </Alert>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ActionCard
        icon={Plane}
        title="New Project"
        description="Create a project to associate with trips or groups."
        href={routes.newProject()}
      />
      <ActionCard
        icon={Plane}
        title="New Trip"
        description="Create a new business trip or group"
        href={routes.newTrip()}
      />
      <ActionCard
        icon={PlusCircle}
        title="New Expense"
        description="Add a new expense"
        href={routes.newExpense()}
      />
    </div>
  </div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <Alert variant="destructive">
    <AlertCircle className="h-5 w-5" />
    <AlertTitle>Error - Failure</AlertTitle>
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
        blur="medium"
        duration={3}
        scale={0.98}
      />
      <Card className="gradient-card relative h-full transition hover:shadow-lg">
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
  percentageChange?: number | null
}

const MetricCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  percentageChange,
}: MetricCardProps) => (
  <Card className="gradient-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {percentageChange !== undefined && percentageChange !== null && (
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
  emissions: number
  startDate: string
  endDate: string
}

const RecentTripsList = ({ trips }: { trips: RecentTrip[] }) => {
  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'REIMBURSED':
        return <BadgeCheck className="h-4 w-4 text-green-500" />
      case 'PENDING':
        return <BadgeAlert className="h-4 w-4 text-orange-500" />
      default:
        return <BadgeHelp className="h-4 w-4 text-red-500" />
    }
  }

  // Helper function to format date range
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return 'No dates specified'

    const start = new Date(startDate)
    const formattedStart = start.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })

    if (!endDate) return formattedStart

    const end = new Date(endDate)
    const formattedEnd = end.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })

    return `${formattedStart} - ${formattedEnd}`
  }

  // No mock data needed anymore as we get real data from the backend

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trips.map((trip) => {
            // Use real data from the backend
            return (
              <Link
                key={trip.id}
                to={routes.trip({ id: trip.id })}
                className="-mx-6 flex items-center justify-between border-b px-6 py-3 pb-4 transition-colors last:border-0 last:pb-0 hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{trip.name}</div>
                  </div>

                  <div className="mt-2 flex flex-col gap-1">
                    {trip.description && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{trip.description}</span>
                      </div>
                    )}

                    {trip.project && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{trip.project}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {trip.expenseCount}{' '}
                      {trip.expenseCount === 1 ? 'expense' : 'expenses'}
                    </span>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-center gap-2 font-medium">
                    <span>NOK {formatCurrency(trip.expenseAmount)}</span>
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span>{trip.emissions} kg CO₂e</span>
                    <Globe className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div
                    className={`mt-1 flex items-center gap-1 text-sm ${
                      trip.reimbursementStatus === 'REIMBURSED'
                        ? 'text-green-500'
                        : trip.reimbursementStatus === 'PENDING'
                          ? 'text-orange-500'
                          : 'text-red-500'
                    }`}
                  >
                    {getStatusIcon(trip.reimbursementStatus)}
                    <span>
                      {trip.reimbursementStatus
                        .split('_')
                        .map(
                          (word) => word.charAt(0) + word.slice(1).toLowerCase()
                        )
                        .join(' ')}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

interface CarbonCategory {
  category: string
  amount: number
  unit: string
}

// Color mapping for carbon categories, using the same colors as PieChart
const CATEGORY_COLORS = {
  'Car - distance-based': 'hsl(var(--chart-1))', // Blue
  Accommodation: 'hsl(var(--chart-2))', // Red
  'Fuel Expenses': 'hsl(var(--chart-3))', // Green
  Flights: 'hsl(var(--chart-4))', // Orange
  'Other miscellaneous': 'hsl(var(--chart-5))', // Purple
  Groceries: 'hsl(var(--chart-6))', // Teal
} as const

// Default color for categories not in the mapping
const DEFAULT_COLOR = 'hsl(var(--primary))'

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
      {categories.map((category) => {
        const categoryColor =
          CATEGORY_COLORS[category.category as keyof typeof CATEGORY_COLORS] ||
          DEFAULT_COLOR
        return (
          <div key={category.category}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <div>{category.category}</div>
              <div>
                {category.amount} {category.unit}
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="absolute h-full transition-all"
                style={{
                  width: `${(category.amount / categories.reduce((acc, cat) => acc + cat.amount, 0)) * 100}%`,
                  backgroundColor: categoryColor,
                }}
              />
            </div>
          </div>
        )
      })}
    </CardContent>
  </Card>
)

interface DashboardData {
  expenses: {
    total: number
    percentageChange: number | null
    pending: {
      amount: number
      count: number
    }
  }
  trips: RecentTrip[]
  carbonFootprint: {
    total: number
    percentageChange: number | null
    byCategory: CarbonCategory[]
  }
}

export const Success = ({
  dashboard,
}: CellSuccessProps<{
  dashboard: DashboardData
}>) => {
  // Render the full dashboard directly
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

      {/* Recent Trips - Only render if there are trips */}
      {dashboard.trips.length > 0 && (
        <RecentTripsList trips={dashboard.trips} />
      )}

      {/* Carbon Impact Chart - Only render if there are categories */}
      {dashboard.carbonFootprint.byCategory.length > 0 && (
        <CarbonImpactChart categories={dashboard.carbonFootprint.byCategory} />
      )}
    </div>
  )
}

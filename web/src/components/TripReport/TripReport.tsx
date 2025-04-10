import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/Card'
import { ExpenseTable } from 'src/components/Expense/Expenses/ExpenseTable'

interface TripReportProps {
  trip: {
    id: number
    name: string
    description?: string
    startDate: string
    endDate: string
    reimbursementStatus: string
    project?: {
      id: number
      name: string
    }
    expenses: {
      id: string
      scope1Co2Emissions: number
      scope2Co2Emissions: number
      scope3Co2Emissions: number
      totalCo2Emissions: number
      description: string
      receipt?: {
        url: string
      }
      categoryId: number
      nokAmount: number
      kwh: number
      date: string
      category: {
        name: string
      }
    }[]
  }
}

const TripReport = ({ trip }: TripReportProps) => {
  // Calculate total expenses
  const totalExpenses = trip.expenses.reduce(
    (sum, expense) => sum + expense.nokAmount,
    0
  )

  // Calculate total emissions
  const totalEmissions = trip.expenses.reduce(
    (sum, expense) => sum + expense.totalCo2Emissions,
    0
  )

  // Format dates
  const startDate = new Date(trip.startDate).toLocaleDateString()
  const endDate = new Date(trip.endDate).toLocaleDateString()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Trip Report: {trip.name}</CardTitle>
          <CardDescription>
            {startDate} - {endDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trip.description && (
            <div className="mb-4">
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-gray-600">{trip.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500">Project</h3>
              <p className="text-lg font-semibold">
                {trip.project ? trip.project.name : 'No project assigned'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Expenses
              </h3>
              <p className="text-lg font-semibold">
                {formatCurrency(totalExpenses)} NOK
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total CO2 Emissions
              </h3>
              <p className="text-lg font-semibold">
                {totalEmissions.toFixed(2)} kg CO2e
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>
            All expenses associated with this trip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseTable
            data={trip.expenses.map(expense => ({
              id: expense.id,
              category: expense.category.name,
              amount: expense.nokAmount,
              emissions: expense.totalCo2Emissions,
              date: expense.date,
              description: expense.description || '',
              imageUrl: expense.receipt?.url || ''
            }))}
            showReimburseButton={false}
            tripId={trip.id}
            tripStatus={trip.reimbursementStatus}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TripReport

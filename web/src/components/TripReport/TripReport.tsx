import { ExpenseTable } from 'src/components/Expense/Expenses/ExpenseTable'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/Card'

import { formatCurrency } from '@/lib/formatters'

// Using Tailwind's print: variants for print-specific styling

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
    <div className="space-y-8">
      {/* Trip header */}
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">
            Trip Report: {trip.name}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {startDate} - {endDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trip.description && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="text-gray-600">{trip.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 print:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-500">Project</h3>
              <p className="text-lg font-semibold text-gray-900">
                {trip.project ? trip.project.name : 'No project assigned'}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Expenses
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalExpenses)} NOK
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total CO2 Emissions
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {totalEmissions.toFixed(2)} kg CO2e
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature section */}
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Signatures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 print:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Employee Signature
              </h3>
              <div className="h-16 border-b border-gray-300"></div>
              <p className="mt-2 text-sm text-gray-500">
                Date: _______________
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Manager Approval
              </h3>
              <div className="h-16 border-b border-gray-300"></div>
              <p className="mt-2 text-sm text-gray-500">
                Date: _______________
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TripReport

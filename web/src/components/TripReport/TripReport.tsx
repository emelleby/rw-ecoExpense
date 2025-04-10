import { Link, routes } from '@redwoodjs/router'

import { Button } from 'src/components/ui/Button'
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

      {/* Expenses list */}
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Expenses</CardTitle>
          <CardDescription className="text-gray-600">
            All expenses associated with this trip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trip.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start space-x-4">
                  {expense.receipt?.url && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                      <img
                        src={expense.receipt.url}
                        alt="Receipt"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {expense.category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(expense.nokAmount)} NOK
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between md:mt-0">
                  <div className="mr-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        expense.totalCo2Emissions > 10
                          ? 'bg-red-100 text-red-800'
                          : expense.totalCo2Emissions > 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {expense.totalCo2Emissions.toFixed(2)} kg CO2e
                    </span>
                  </div>
                  {expense.receipt?.url && (
                    <a
                      href={expense.receipt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 print:hidden"
                    >
                      View Receipt
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
            <p className="text-lg font-semibold text-gray-900">
              Total Amount: {formatCurrency(totalExpenses)} NOK
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signature section */}
      <Card className="bg-white text-black print:break-before-page">
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

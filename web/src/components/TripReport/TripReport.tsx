import {
  Calendar,
  Globe,
  Tag,
  FileText,
  Store,
  Briefcase,
  DollarSign,
  BarChart,
  Plane,
} from 'lucide-react'

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
    projectId?: number
    project?: {
      id: number
      name: string
    } | null
    expenses: {
      id: number | string
      scope1Co2Emissions: number
      scope2Co2Emissions: number
      scope3Co2Emissions: number
      totalCo2Emissions: number
      description?: string
      merchant?: string
      receipt?: {
        url: string
      } | null
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
    <div className="space-y-4">
      {/* Trip header */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="relative text-2xl text-slate-900">
            <Plane className="absolute -top-1 right-0 h-6 w-6 text-slate-500" />
            Trip Report: {trip.name}
          </CardTitle>
          <CardDescription className="text-slate-600">
            {startDate} - {endDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trip.description && (
            <div className="relative mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <FileText className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900">
                Description
              </h3>
              <p className="mt-1 text-slate-600">{trip.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 print:grid-cols-3">
            <div className="relative rounded-lg border border-slate-200 bg-slate-100 p-4">
              <Briefcase className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-medium text-slate-600">Project</h3>
              <p className="text-lg font-semibold text-slate-900">
                {trip.project && trip.project.name
                  ? trip.project.name
                  : 'No project assigned'}
              </p>
            </div>
            <div className="relative rounded-lg border border-slate-200 bg-slate-100 p-4">
              <DollarSign className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-medium text-slate-600">
                Total Expenses
              </h3>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(totalExpenses)} NOK
              </p>
            </div>
            <div className="relative rounded-lg border border-slate-200 bg-slate-100 p-4">
              <Globe className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-medium text-slate-600">
                Total CO2 Emissions
              </h3>
              <p className="text-lg font-semibold text-slate-900">
                {totalEmissions.toFixed(2)} kg CO2e
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses list */}
      <Card className="bg-white text-black">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Expenses</CardTitle>
          <CardDescription className="text-slate-600">
            All expenses associated with this trip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 print:space-y-2">
            {trip.expenses.map((expense) => (
              <Card
                key={expense.id}
                className="break-inside-avoid-page overflow-hidden bg-white shadow print:mb-4"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Receipt image - only shown if available */}
                  {expense.receipt?.url && (
                    <div className="sm:max-w-1/3 h-auto">
                      <img
                        src={expense.receipt.url}
                        alt="Receipt"
                        className="h-full max-h-80 w-full object-contain"
                      />
                    </div>
                  )}

                  {/* Expense details */}
                  <div
                    className={`flex flex-col justify-between p-4 ${expense.receipt?.url ? 'sm:w-full' : 'w-full'}`}
                  >
                    <div className="mb-4">
                      <div className="flex items-baseline justify-between">
                        <h3 className="flex items-center text-lg font-medium text-slate-900">
                          <Tag className="mr-1.5 h-5 w-5 text-slate-500" />
                          {expense.category.name}
                        </h3>
                        <p className="flex items-center text-sm font-semibold text-slate-600">
                          <Calendar className="mr-1.5 h-4 w-4 text-slate-500" />
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center">
                        <Store className="mr-1.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                        <p className="mb-1 text-sm font-medium text-slate-700">
                          {expense.merchant || 'No merchant provided'}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <FileText className="mr-1.5 mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                        <p className="text-sm text-slate-600">
                          {expense.description || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          expense.totalCo2Emissions > 100
                            ? 'bg-red-100 text-red-800'
                            : expense.totalCo2Emissions > 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <Globe className="mr-1 h-4 w-4" />
                        {expense.totalCo2Emissions.toFixed(2)} kg CO2e
                      </span>
                      <p className="text-xl font-semibold text-slate-900">
                        {formatCurrency(expense.nokAmount)} NOK
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex break-inside-avoid-page justify-end border-t border-slate-200 pt-4">
            <p className="text-lg font-semibold text-slate-900">
              Total Amount: {formatCurrency(totalExpenses)} NOK
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signature section */}
      <Card className="bg-white text-black print:mt-0 print:break-before-page">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Signatures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 print:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium text-slate-900">
                Employee Signature
              </h3>
              <div className="h-16 border-b border-slate-300"></div>
              <p className="mt-2 text-sm text-slate-500">
                Date: _______________
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium text-slate-900">
                Manager Approval
              </h3>
              <div className="h-16 border-b border-slate-300"></div>
              <p className="mt-2 text-sm text-slate-500">
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

import { useState } from 'react'

import {
  Calendar,
  Globe,
  Tag,
  FileText,
  Store,
  Briefcase,
  DollarSign,
  Plane,
  User,
  Home,
  CreditCard,
  Landmark,
  Mail,
} from 'lucide-react'

import ReceiptPreview from 'src/components/ReceiptPreview/ReceiptPreview'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/Card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from 'src/components/ui/Sheet'

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
    secondaryCurrency?: string | null
    projectId?: number
    project?: {
      id: number
      name: string
    } | null
    user?: {
      id: number
      firstName?: string
      lastName?: string
      email: string
      homeAddress?: string
      workAddress?: string
      bankAccount?: string
      iban?: string
      swiftBic?: string
      internationalAccountName?: string
      internationalBankAddress?: string
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
      secondaryAmount?: number | null
      kwh: number
      date: string
      category: {
        name: string
      }
    }[]
  }
}

const TripReport = ({ trip }: TripReportProps) => {
  const [openReceipt, setOpenReceipt] = useState<{
    url: string
    merchant?: string
  } | null>(null)

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

  // Total in the trip's reimbursement currency, if one is set
  const totalSecondary = trip.secondaryCurrency
    ? trip.expenses.reduce(
        (sum, expense) => sum + (expense.secondaryAmount ?? 0),
        0
      )
    : null

  // Format dates
  const startDate = new Date(trip.startDate).toLocaleDateString()
  const endDate = new Date(trip.endDate).toLocaleDateString()

  // International bank details (e.g. a Wise account), may differ from the
  // domestic bank account. Shown so payers abroad can use SWIFT transfer.
  const internationalBankDetails = trip.user
    ? [
        { label: 'Name', value: trip.user.internationalAccountName },
        { label: 'IBAN', value: trip.user.iban },
        { label: 'Swift/BIC', value: trip.user.swiftBic },
        { label: 'Address', value: trip.user.internationalBankAddress },
      ].filter((detail) => !!detail.value)
    : []

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

          {/* User Information */}
          {trip.user && (
            <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-2 text-lg font-medium text-slate-900">
                Employee Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:grid-cols-2">
                <div>
                  <p className="flex items-center text-sm font-medium text-slate-700">
                    <User className="mr-2 h-4 w-4 text-slate-500" />
                    Name: {trip.user.firstName || ''} {trip.user.lastName || ''}
                  </p>
                  <p className="mt-2 flex items-center text-sm font-medium text-slate-700">
                    <Mail className="mr-2 h-4 w-4 text-slate-500" />
                    Email: {trip.user.email}
                  </p>
                </div>
                <div>
                  {trip.user.homeAddress && (
                    <p className="flex items-center text-sm font-medium text-slate-700">
                      <Home className="mr-2 h-4 w-4 text-slate-500" />
                      Home Address: {trip.user.homeAddress}
                    </p>
                  )}
                  {trip.user.bankAccount && (
                    <p className="mt-2 flex items-center text-sm font-medium text-slate-700">
                      <CreditCard className="mr-2 h-4 w-4 text-slate-500" />
                      Bank Account (domestic): {trip.user.bankAccount}
                    </p>
                  )}
                </div>
              </div>
              {internationalBankDetails.length > 0 && (
                <div className="mt-4 break-inside-avoid-page rounded-lg border border-slate-200 bg-white p-4">
                  <h4 className="flex items-center text-sm font-medium text-slate-900">
                    <Landmark className="mr-2 h-4 w-4 text-slate-500" />
                    International Bank Details
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    If you're sending money from a bank in SEPA, you can use
                    these details to make a domestic transfer. If you're sending
                    from somewhere else, make an international Swift transfer.
                  </p>
                  <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 print:grid-cols-2">
                    {internationalBankDetails.map((detail) => (
                      <div key={detail.label} className="flex text-sm">
                        <dt className="font-medium text-slate-500">
                          {detail.label}:
                        </dt>
                        <dd className="ml-2 text-slate-700">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
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
              <Globe className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-medium text-slate-600">
                Total CO2 Emissions
              </h3>
              <p className="text-lg font-semibold text-slate-900">
                {totalEmissions.toFixed(2)} kg CO2e
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
              {totalSecondary !== null && (
                <p className="text-sm text-slate-600">
                  {formatCurrency(totalSecondary)} {trip.secondaryCurrency}
                </p>
              )}
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
                      <ReceiptPreview
                        url={expense.receipt.url}
                        className="h-full max-h-80 w-full object-contain"
                        onView={() =>
                          setOpenReceipt({
                            url: expense.receipt!.url,
                            merchant: expense.merchant,
                          })
                        }
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

                      <div className="mt-3 flex items-baseline">
                        <Store className="mr-1.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                        <p className="mb-1 text-sm font-medium text-slate-700">
                          {expense.merchant || 'No merchant provided'}
                        </p>
                      </div>
                      <div className="flex items-baseline">
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
                      <div className="text-right">
                        <p className="text-xl font-semibold text-slate-900">
                          {formatCurrency(expense.nokAmount)} NOK
                        </p>
                        {trip.secondaryCurrency &&
                          expense.secondaryAmount != null && (
                            <p className="text-sm text-slate-600">
                              {formatCurrency(expense.secondaryAmount)}{' '}
                              {trip.secondaryCurrency}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex break-inside-avoid-page flex-col items-end rounded-lg border-b-2 bg-accent/50 p-4">
            <p className="text-lg font-semibold text-slate-900">
              Total Amount: {formatCurrency(totalExpenses)} NOK
            </p>
            {totalSecondary !== null && (
              <p className="text-base text-slate-600">
                {formatCurrency(totalSecondary)} {trip.secondaryCurrency}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Signature section - print only */}
      <Card className="hidden bg-white text-black print:mt-0 print:block">
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

      <Sheet
        open={!!openReceipt}
        onOpenChange={(open) => !open && setOpenReceipt(null)}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-xl"
        >
          <SheetHeader>
            <SheetTitle>{openReceipt?.merchant || 'Receipt'}</SheetTitle>
          </SheetHeader>
          {openReceipt && (
            <div className="mt-4">
              <ReceiptPreview url={openReceipt.url} className="w-full" />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default TripReport

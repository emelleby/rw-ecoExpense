import { formatCurrency } from '@/lib/formatters'

interface Expense {
  id: string
  category: string
  amount: number
  emissions: number
  date: string
  description: string
  imageUrl?: string
}

interface TripExpensesTableProps {
  expenses: Expense[]
}

const TripExpensesTable = ({ expenses }: TripExpensesTableProps) => {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-500">Date</th>
            <th className="px-4 py-3 font-medium text-gray-500">Category</th>
            <th className="px-4 py-3 font-medium text-gray-500">Description</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">
              Amount
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">
              Emissions
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 print:hidden">
              Receipt
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">
                {new Date(expense.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-gray-900">{expense.category}</td>
              <td className="px-4 py-3 text-gray-900">{expense.description}</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatCurrency(expense.amount)} NOK
              </td>
              <td className="px-4 py-3 text-right text-gray-900">
                {expense.emissions.toFixed(2)} kg CO2e
              </td>
              <td className="px-4 py-3 text-right print:hidden">
                {expense.imageUrl ? (
                  <a
                    href={expense.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TripExpensesTable

import { useEffect, useState } from 'react'

import type { FindExpenses } from 'types/graphql'

import { ExpenseTable } from './ExpenseTable'

const ExpensesList = ({ expenses }: FindExpenses) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const data = expenses.map((expense) => {
      let totalEmissions = expense.scope1Co2Emissions + expense.scope2Co2Emissions + expense.scope3Co2Emissions
      return {
        category: expense.category.name,
        emissions: totalEmissions,
        amount: expense.nokAmount,
        id: expense.id,
        description: expense.description,
        date: expense.date,
        imageUrl: expense.receipt?.url,
      }
    })
    setData(data)
  }, [])

  return <ExpenseTable data={data} showReimburseButton={false} tripId={0} />
}

export default ExpensesList

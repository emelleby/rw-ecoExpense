import { useEffect, useState } from 'react'

import type { FindExpenses } from 'types/graphql'

import { ExpenseTable } from './ExpenseTable'

const ExpensesList = ({ expenses }: FindExpenses) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const data = expenses.map((expense) => {
      return {
        category: expense.category.name,
        emissions: expense.totalCo2Emissions,
        amount: expense.nokAmount,
        id: expense.id,
        description: expense.description,
        date: expense.date,
        imageUrl: expense.receipt?.url,
        tripStatus: expense.trip.reimbursementStatus, // Include trip status for each expense
      }
    })
    setData(data)
  }, [expenses])

  return <ExpenseTable data={data} showReimburseButton={false} tripId={0} tripStatus="NOT_REQUESTED" />
}

export default ExpensesList

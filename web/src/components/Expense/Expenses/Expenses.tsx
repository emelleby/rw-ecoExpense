import { useMemo, useState } from 'react'

import type { FindExpenses } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/Select'

import { ExpenseTable } from './ExpenseTable'

const ExpensesList = ({ expenses }: FindExpenses) => {
  const [tripFilter, setTripFilter] = useState('all')

  const trips = useMemo(() => {
    const byId = new Map<number, string>()
    expenses.forEach((expense) => byId.set(expense.trip.id, expense.trip.name))
    return Array.from(byId, ([id, name]) => ({ id, name }))
  }, [expenses])

  const groups = useMemo(() => {
    const sorted = [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    const byTrip = new Map<number, typeof sorted>()
    sorted.forEach((expense) => {
      if (tripFilter !== 'all' && expense.trip.id !== Number(tripFilter)) {
        return
      }
      const group = byTrip.get(expense.trip.id) ?? []
      group.push(expense)
      byTrip.set(expense.trip.id, group)
    })
    return Array.from(byTrip, ([tripId, tripExpenses]) => ({
      tripId,
      tripName: tripExpenses[0].trip.name,
      data: tripExpenses.map((expense) => ({
        id: expense.id,
        category: expense.category.name,
        emissions: expense.totalCo2Emissions,
        amount: expense.nokAmount,
        description: expense.description,
        date: expense.date,
        imageUrl: expense.receipt?.url,
        tripStatus: expense.trip.reimbursementStatus,
      })),
    }))
  }, [expenses, tripFilter])

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={tripFilter} onValueChange={setTripFilter}>
          <SelectTrigger className="mt-0 w-56">
            <SelectValue placeholder="All trips" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All trips</SelectItem>
            {trips.map((trip) => (
              <SelectItem key={trip.id} value={trip.id.toString()}>
                {trip.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {groups.map(({ tripId, tripName, data }) => (
        <div key={tripId} className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            <Link to={routes.trip({ id: tripId })} className="hover:underline">
              {tripName}
            </Link>
          </h2>
          <ExpenseTable
            data={data}
            showReimburseButton={false}
            tripId={tripId}
            tripStatus="NOT_REQUESTED"
          />
        </div>
      ))}
    </div>
  )
}

export default ExpensesList

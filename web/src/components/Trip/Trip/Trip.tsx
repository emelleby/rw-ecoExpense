import { useEffect, useState } from 'react'

import type { FindTripById } from 'types/graphql'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'src/components/ui/Tabs'

import { ExpenseDetails } from '../../Expense/Expenses/ExpenseDetails'

import { ExpenseChart as PieChart } from './PieChart'
import { RecentExpenses } from './RecentExpenses'

interface Props {
  trip: NonNullable<FindTripById['trip']>
}

const Trip = ({ trip }: Props) => {
  const [expenses, setExpenses] = useState([])

  // const [deleteTrip] = useMutation(DELETE_TRIP_MUTATION, {
  //   onCompleted: () => {
  //     toast.success('Trip deleted')
  //     navigate(routes.trips())
  //   },
  //   onError: (error) => {
  //     toast.error(error.message)
  //   },
  // })

  // const onDeleteClick = (id: DeleteTripMutationVariables['id']) => {
  //   if (confirm('Are you sure you want to delete trip ' + id + '?')) {
  //     deleteTrip({ variables: { id } })
  //   }
  // }

  useEffect(() => {
    const data = trip.expenses.map((expense) => {
      return {
        category: expense.category.name,
        emissions: expense.scope3Co2Emissions,
        amount: expense.nokAmount,
        id: expense.id,
        description: expense.description,
        date: expense.date,
        imageUrl: expense.receipt?.url,
      }
    })
    setExpenses(data)
  }, [trip])

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-2 sm:p-4 lg:p-8">
      <h1 className="text-3xl font-bold">Report for {trip.name}</h1>
      {/* <div>{DateRangeDisplay()}</div> */}

      <Tabs defaultValue="expenses">
        <TabsList className="h-11 w-full px-3 py-2">
          <TabsTrigger value="expenses" className="w-full text-base">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="emissions" className="w-full text-base">
            Emissions
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="expenses">
            <div className="grid gap-4 md:grid-cols-2">
              <PieChart data={expenses} type="amount" />
              <RecentExpenses expenses={expenses} displayType="amount" />
            </div>
          </TabsContent>

          <TabsContent value="emissions">
            <div className="grid gap-4 md:grid-cols-2">
              <PieChart data={expenses} type="emissions" />
              <RecentExpenses expenses={expenses} displayType="emissions" />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex justify-center">
        <ExpenseDetails
          data={expenses}
          tripId={trip?.id}
          reimbursementStatus={trip?.reimbursementStatus ?? ''}
        />
      </div>
    </div>
  )
}

// const Trip = ({ trip }: Props) => {
//   return (
//     <div className="mx-auto max-w-7xl space-y-8 p-2 sm:p-4 lg:p-8">
//       <h1 className="text-3xl font-bold">Report for {trip.name}</h1>

//       <Tabs defaultValue="expenses">
//         <TabsList className="h-11 w-full px-3 py-2">
//           <TabsTrigger value="expenses" className="w-full text-base">
//             Expenses
//           </TabsTrigger>
//         </TabsList>

//         <div className="mt-8">
//           <TabsContent value="expenses">
//             <div className="grid gap-4 md:grid-cols-2">
//               <PieChart data={trip.expenses} type="amount" />
//               <RecentExpenses expenses={trip.expenses} displayType="amount" />
//             </div>
//           </TabsContent>
//         </div>
//       </Tabs>

//       <div className="flex justify-center">
//         <ExpenseDetails
//           data={trip.expenses}
//           tripId={trip.id}
//           reimbursementStatus={trip.reimbursementStatus ?? ''}
//         />
//       </div>
//     </div>
//   )
// }

export default Trip

import React, { FC } from 'react'

import { CreateExpenseInput, EditExpenseById } from 'types/graphql'

import { RWGqlError } from '@redwoodjs/forms'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'src/components/ui/Tabs'

import { FutureFlights } from './FutureFlights'
import { PastFlights } from './PastFlights'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void // Accept CreateExpenseInput directly
  expense?: FormExpense
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  error: RWGqlError
}

export const Flight: FC<ExpenseFormProps> = (props: ExpenseFormProps) => {
  return (
    <div>
      <Tabs defaultValue="pastFlight">
        <TabsList className="flex w-full justify-center">
          <TabsTrigger className="w-1/2" value="pastFlight">
            Past Flight
          </TabsTrigger>
          <TabsTrigger className="w-1/2" value="futureFlight">
            Future Flight
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pastFlight">
          <PastFlights {...props} />
        </TabsContent>
        <TabsContent value="futureFlight">
          <FutureFlights {...props} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

import React, { FC } from 'react'

import { AlertCircle } from 'lucide-react'
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

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'

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
    <div className="!mt-4 space-y-2">
      <Alert variant="info" className="mb-4">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Choose past or future flights</AlertTitle>
        <AlertDescription>
          <p>
            If you have a future flight and its flight number we can provide a
            bit better emissions estimate as we will also take airplane model
            into account. Add all your segmants.
          </p>
        </AlertDescription>
      </Alert>
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

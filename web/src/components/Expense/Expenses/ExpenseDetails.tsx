import type { UpdateReimbursementStatusInput } from 'types/graphql'

import { TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Trip/TripCell/TripCell'
import { Badge } from 'src/components/ui/Badge'
import { Button } from 'src/components/ui/Button'
import { formatEnum } from 'src/lib/formatters'

import { ExpenseTable } from './ExpenseTable'

type ExpenseCategory =
  | 'Accommodation'
  | 'Car distance-based'
  | 'Fuel Expenses'
  | 'Flights'
  | 'Other Miscellaneous'
  | 'Groceries'

interface Expense {
  id: string
  category: ExpenseCategory
  amount: number
  emissions: number
  date: string
  description: string
  imageUrl: string
}

interface ExpenseDetailsProps {
  data: Expense[]
  reimbursementStatus: string
  tripId: number
}
const Update_Reimbursement_Status: TypedDocumentNode<UpdateReimbursementStatusInput> = gql`
  mutation UpdateReimbursementStatus(
    $reimbursementStatus: ReimbursementStatus!
    $id: Int!
  ) {
    updateReimbursementStatus(
      reimbursementStatus: $reimbursementStatus
      id: $id
    )
  }
`

// Add this helper function above your component
const getBadgeVariant = (status: string) => {
  switch (status) {
    case 'REIMBURSED':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'NOT_REQUESTED':
      return 'destructive'
    default:
      return 'default'
  }
}

export function ExpenseDetails({
  data,
  reimbursementStatus,
  tripId,
}: ExpenseDetailsProps) {
  console.log('Expense Details Data:', data)
  const showReimburseButton =
    reimbursementStatus === 'NOT_REQUESTED' && data.length > 0
  console.log('Data in Table; ', data)

  // TODO
  const [updateReimbursementStatus] = useMutation(Update_Reimbursement_Status, {
    onCompleted: () => {
      toast.success('Trip updated')
      //navigate(routes.trips())
    },
    onError: (error) => {
      toast.error(error.message)
    },

    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })
  const handleOpenTrip = async (tripId: number) => {
    try {
      const data = await updateReimbursementStatus({
        variables: { reimbursementStatus: 'NOT_REQUESTED', id: tripId },
      })

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="mx-auto w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <div>
          <p className="text-muted-foreground">
            A list of all expenses for the trip
          </p>
        </div>

        <div className="flex items-center gap-x-2">
          <Badge
            variant={getBadgeVariant(reimbursementStatus)}
            className="ml-3 text-nowrap"
          >
            {formatEnum(reimbursementStatus)}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            disabled={reimbursementStatus !== 'PENDING'}
            onClick={() => handleOpenTrip(tripId)}
          >
            Open
          </Button>
        </div>
      </div>

      <ExpenseTable
        data={data}
        showReimburseButton={showReimburseButton}
        tripId={tripId}
        tripStatus={reimbursementStatus}
      />
    </div>
  )
}

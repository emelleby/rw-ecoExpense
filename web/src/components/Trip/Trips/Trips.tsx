import type {
  DeleteTripMutation,
  DeleteTripMutationVariables,
  TripsByUser,
  UpdateReimbursementStatusInput,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Trip/TripsCell'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'

import { Button } from '@/components/ui/Button'
import { GlowEffect } from '@/components/ui/glow-effect'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

const DELETE_TRIP_MUTATION: TypedDocumentNode<
  DeleteTripMutation,
  DeleteTripMutationVariables
> = gql`
  mutation DeleteTripMutation($id: Int!) {
    deleteTrip(id: $id) {
      id
    }
  }
`

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

const TripsList = ({ tripsByUser }: TripsByUser) => {
  const [deleteTrip] = useMutation(DELETE_TRIP_MUTATION, {
    onCompleted: () => {
      toast.success('Trip deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteTripMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete trip ' + id + '?')) {
      deleteTrip({ variables: { id } })
    }
  }

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

  const handleOpenTrip = async (id: number) => {
    try {
      const data = await updateReimbursementStatus({
        variables: { reimbursementStatus: 'NOT_REQUESTED', id },
      })

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="relative">
        <GlowEffect
          colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
          mode="colorShift"
          blur="soft"
          duration={3}
          scale={1}
        />

        <Link
          to={routes.newTrip()}
          className="rw-button rw-button-primary relative m-4 items-center"
        >
          <div className="rw-button-icon relative">+</div> New Trip
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>End date</TableHead>

              <TableHead>Reimbursement status</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tripsByUser.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell>{truncate(trip.name)}</TableCell>
                <TableCell>{timeTag(trip.startDate)}</TableCell>
                <TableCell>{timeTag(trip.endDate)}</TableCell>

                <TableCell>{formatEnum(trip.reimbursementStatus)}</TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <div className="relative">
                      <GlowEffect
                        colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                        mode="colorShift"
                        blur="soft"
                        duration={3}
                        scale={0.9}
                      />
                      <Button
                        className="relative"
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link
                          to={routes.trip({ id: trip.id })}
                          title={'Show trip ' + trip.id + ' detail'}
                        >
                          Show
                        </Link>
                      </Button>
                    </div>

                    <Button variant="secondary" size="sm" asChild>
                      <Link
                        to={routes.editTrip({ id: trip.id })}
                        title={'Edit trip ' + trip.id}
                      >
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteClick(trip.id)}
                    >
                      Delete
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={trip.reimbursementStatus !== 'PENDING'}
                      onClick={() => handleOpenTrip(trip.id)}
                    >
                      Open
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default TripsList

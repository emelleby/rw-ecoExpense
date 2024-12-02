import type {
  DeleteTripMutation,
  DeleteTripMutationVariables,
  FindTrips,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Trip/TripsCell'
import { formatEnum, timeTag, truncate } from 'src/lib/formatters'

import { Button } from '@/components/ui/Button'
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

const TripsList = ({ trips }: FindTrips) => {
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

  return (
    <>
      <Link
        to={routes.newProject()}
        className="rw-button rw-button-primary m-4 items-center"
      >
        <div className="rw-button-icon">+</div> New Trip
      </Link>

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
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell>{truncate(trip.name)}</TableCell>
                <TableCell>{timeTag(trip.startDate)}</TableCell>
                <TableCell>{timeTag(trip.endDate)}</TableCell>

                <TableCell>{formatEnum(trip.reimbursementStatus)}</TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to={routes.trip({ id: trip.id })}
                        title={'Show trip ' + trip.id + ' detail'}
                      >
                        Show
                      </Link>
                    </Button>
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

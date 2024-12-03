import type {
  DeleteTripMutation,
  DeleteTripMutationVariables,
  FindTripById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { formatEnum, timeTag } from 'src/lib/formatters'

import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/Table'

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

interface Props {
  trip: NonNullable<FindTripById['trip']>
}

const Trip = ({ trip }: Props) => {
  const [deleteTrip] = useMutation(DELETE_TRIP_MUTATION, {
    onCompleted: () => {
      toast.success('Trip deleted')
      navigate(routes.trips())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteTripMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete trip ' + id + '?')) {
      deleteTrip({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Trip Details: {trip.name}
          </h2>
        </header>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Name</TableCell>
              <TableCell>{trip.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Description</TableCell>
              <TableCell>{trip.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Start Date</TableCell>
              <TableCell>{timeTag(trip.startDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">End Date</TableCell>
              <TableCell>{timeTag(trip.endDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Reimbursement Status
              </TableCell>
              <TableCell>
                <Badge variant="info">
                  {formatEnum(trip.reimbursementStatus)}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Approved Date</TableCell>
              <TableCell>
                {trip.approvedDate ? timeTag(trip.approvedDate) : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editTrip({ id: trip.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(trip.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Trip

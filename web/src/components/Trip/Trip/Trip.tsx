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
            Trip {trip.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{trip.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{trip.name}</td>
            </tr>
            <tr>
              <th>Start date</th>
              <td>{timeTag(trip.startDate)}</td>
            </tr>
            <tr>
              <th>End date</th>
              <td>{timeTag(trip.endDate)}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{trip.userId}</td>
            </tr>
            <tr>
              <th>Approved date</th>
              <td>{timeTag(trip.approvedDate)}</td>
            </tr>
            <tr>
              <th>Reimbursement status</th>
              <td>{formatEnum(trip.reimbursementStatus)}</td>
            </tr>
            <tr>
              <th>Transaction id</th>
              <td>{trip.transactionId}</td>
            </tr>
          </tbody>
        </table>
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

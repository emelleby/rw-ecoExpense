import type {
  CreateTripMutation,
  CreateTripInput,
  CreateTripMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import TripForm from 'src/components/Trip/TripForm'

const CREATE_TRIP_MUTATION: TypedDocumentNode<
  CreateTripMutation,
  CreateTripMutationVariables
> = gql`
  mutation CreateTripMutation($input: CreateTripInput!) {
    createTrip(input: $input) {
      id
    }
  }
`

const NewTrip = () => {
  const { currentUser } = useAuth()
  const userId = Number(currentUser.dbUserId)

  const [createTrip, { loading, error }] = useMutation(CREATE_TRIP_MUTATION, {
    onCompleted: () => {
      toast.success('Trip created')
      navigate(routes.trips())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: CreateTripInput) => {
    createTrip({
      variables: {
        input: {
          ...input,
          userId: userId,
        },
      },
    })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Trip</h2>
      </header>
      <div className="rw-segment-main">
        <TripForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewTrip

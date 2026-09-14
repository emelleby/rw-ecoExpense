import type {
  TripPrivacyToggleMutation,
  TripPrivacyToggleMutationVariables,
  TripPrivacyToggleQuery,
  TripPrivacyToggleQueryVariables,
} from 'types/graphql'

import { TypedDocumentNode, gql, useMutation, useQuery } from '@redwoodjs/web'

const QUERY: TypedDocumentNode<
  TripPrivacyToggleQuery,
  TripPrivacyToggleQueryVariables
> = gql`
  query TripPrivacyToggleQuery($id: Int!) {
    trip(id: $id) {
      id
      isPrivate
    }
  }
`

const UPDATE_TRIP_MUTATION: TypedDocumentNode<
  TripPrivacyToggleMutation,
  TripPrivacyToggleMutationVariables
> = gql`
  mutation TripPrivacyToggleMutation($id: Int!, $isPrivate: Boolean!) {
    updateTrip(id: $id, input: { isPrivate: $isPrivate }) {
      id
      isPrivate
    }
  }
`

const TripPrivacyToggle = ({ tripId }: { tripId: number }) => {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id: tripId },
  })
  const [updateTrip] = useMutation(UPDATE_TRIP_MUTATION)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="rw-cell-error">{error.message}</div>
  }

  return (
    <label className="mb-4 flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={data?.trip?.isPrivate ?? false}
        onChange={(event) => {
          updateTrip({
            variables: { id: tripId, isPrivate: event.target.checked },
          }).then(() => refetch())
        }}
      />
      Mark private
    </label>
  )
}

export default TripPrivacyToggle

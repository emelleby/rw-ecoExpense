import type {
  CreateTripMutation,
  CreateTripInput,
  CreateTripMutationVariables,
  projectsNewTrip,
  projectsNewTripVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import TripForm from 'src/components/Trip/TripForm'
import PageLoading from 'src/components/ui/PageLoading'

export const QUERY: TypedDocumentNode<
  projectsNewTrip,
  projectsNewTripVariables
> = gql`
  query projectsNewTrip {
    projects {
      id
      name
      description
      active
      organizationId
    }
  }
`

const CREATE_TRIP_MUTATION: TypedDocumentNode<
  CreateTripMutation,
  CreateTripMutationVariables
> = gql`
  mutation CreateTripMutation($input: CreateTripInput!) {
    createTrip(input: $input) {
      id
      projectId
    }
  }
`

export const Loading = PageLoading

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ projects }: CellSuccessProps<projectsNewTrip>) => {
  const { currentUser } = useAuth()
  const userId = Number(currentUser?.dbUserId)

  const [createTrip, { loading, error }] = useMutation(CREATE_TRIP_MUTATION, {
    onCompleted: () => {
      toast.success('Trip created')
      navigate(routes.trips())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: CreateTripInput) =>
    createTrip({
      variables: {
        input: {
          ...input,
          userId,
          projectId: Number(input.projectId),
          secondaryCurrency: input.secondaryCurrency || null,
        },
      },
    })

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-primary text-gradient-blue-green w-fit">
          New Trip
        </h2>
      </header>
      <div className="rw-segment-main">
        <TripForm
          projects={projects}
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

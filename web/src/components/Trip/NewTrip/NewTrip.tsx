import { useEffect } from 'react'

import type {
  CreateTripMutation,
  CreateTripInput,
  CreateTripMutationVariables,
} from 'types/graphql'
import type { FindProjects, FindProjectsVariables } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import TripForm from 'src/components/Trip/TripForm'
import useLoader from 'src/hooks/useLoader'

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

interface NewTripProps {
  projects: {
    id: number
    name: string
    description?: string
    active: boolean
  }[]
  p: string
}

// export const QUERY = gql`
//   query projectsNewTrip {
//     projects {
//       id
//       name
//       description
//       active
//       organizationId
//     }
//   }
// `

// console.log('QUERY structure:', QUERY)

const NewTrip = ({ projects, p }: NewTripProps) => {
  const { currentUser } = useAuth()
  const userId = Number(currentUser.dbUserId)
  console.log('Current user newTrip:', currentUser)
  console.log('P newTrip:', p)
  console.log('Projects newTrip:', projects)

  // const {
  //   data: projectsData,
  //   loading: queryLoading,
  //   error: queryError,
  // } = useQuery<FindProjects, FindProjectsVariables>(QUERY, {
  //   onCompleted: (data) => console.log('Query completed:', data),
  //   onError: (error) => console.log('Query error:', error),
  // })

  // setTimeout(() => {
  //   console.log('Query state after 2 seconds:', {
  //     isLoading: queryLoading,
  //     hasData: !!projectsData,
  //     hasError: !!queryError,
  //   })
  // }, 2000)

  // useEffect(() => {
  //   console.log('Query triggered')
  //   console.log('Loading:', queryLoading)
  //   console.log('Error:', queryError)
  // }, [queryLoading, queryError])

  // console.log('Query state:', { projectsData, queryLoading, queryError })
  const { showLoader, hideLoader } = useLoader()

  const [createTrip, { loading, error }] = useMutation(CREATE_TRIP_MUTATION, {
    onCompleted: () => {
      toast.success('Trip created')
      navigate(routes.trips())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  console.log('Query state:', { projects, loading, error })

  const onSave = async (input: CreateTripInput) => {
    showLoader()
    await createTrip({
      variables: {
        input: {
          ...input,
          userId: userId,
        },
      },
    })
    hideLoader()
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Trip</h2>
      </header>
      <div className="rw-segment-main">
        <TripForm
          projects={projects}
          onSave={onSave}
          loading={loading}
          error={error}
          p={p}
        />
      </div>
    </div>
  )
}

export default NewTrip

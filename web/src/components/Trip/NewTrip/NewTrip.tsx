import { useEffect } from 'react'

// import { gql } from 'graphql-tag'
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
      projectId
    }
  }
`

// const CREATE_TRIP_MUTATION = gql`
//   mutation CreateTripMutation($input: CreateTripInput!) {
//     createTrip(input: {
//       name: String!
//       description: String
//       startDate: DateTime!
//       endDate: DateTime!
//       projectId: Int!
//       userId: Int!
//     }) {
//       id
//     }
//   }
// `

export const QUERY = gql`
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

const NewTrip = ({ p }) => {
  const { currentUser } = useAuth()
  const userId = Number(currentUser?.dbUserId) // Ensure currentUser exists

  console.log('Current user newTrip:', currentUser)
  console.log('P newTrip:', p)

  // const {
  //   data: projectsData,
  //   loading: queryLoading,
  //   error: queryError,
  // } = useQuery(QUERY, {
  //   onCompleted: (data) => console.log('Query completed:', data),
  //   onError: (error) => console.error('Query error:', error.message),
  // })

  const {
    data: projectsData,
    loading: queryLoading,
    error: queryError,
  } = useQuery<FindProjects, FindProjectsVariables>(QUERY, {
    onCompleted: (data) => console.log('Query completed:', data),
    onError: (error) => console.log('Query error:', error),
  })

  useEffect(() => {
    console.log('Query triggered')
    console.log('Loading:', queryLoading)
    console.log('Error:', queryError)
    console.log('Data:', projectsData)
  }, [queryLoading, queryError, projectsData])
  console.log('Query state:', { projectsData, queryLoading, queryError })
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

  const onSave = async (input: CreateTripInput) => {
    showLoader()
    await createTrip({
      variables: {
        input: {
          ...input,
          userId: userId,
          projectId: Number(input.projectId),
        },
      },
    })
    hideLoader()
  }

  return (
    <div className="rw-segment">
      <div>
        {queryLoading && <p>Loading...</p>}
        {queryError && <p>Error: {queryError.message}</p>}
        {projectsData && (
          <ul>
            {projectsData.projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        )}
      </div>

      {
        // It is important to wait for the data to be loaded before rendering the TripForm component
        projectsData && (
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">New Trip</h2>
            </header>
            <div className="rw-segment-main">
              <TripForm
                projects={projectsData.projects}
                onSave={onSave}
                loading={loading}
                error={error}
                p={p}
              />
            </div>
          </div>
        )
      }
    </div>
  )
}

export default NewTrip

import type { FindNewTripQuery, FindNewTripQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import NewTrip from 'src/components/Trip/NewTrip'

export const QUERY: TypedDocumentNode<
  FindNewTripQuery,
  FindNewTripQueryVariables
> = gql`
  query FindNewTripQuery {
    projects {
      id
      name
      description
      active
      organizationId
    }
  }
`

export const Loading = ({ projects }) => {
  console.log('ProjectsCellProjectsWhileLoading:', projects)
  return <div>Loading...</div>
}

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindNewTripQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  projects,
}: CellSuccessProps<FindNewTripQuery, FindNewTripQueryVariables>) => {
  const p = 'Hei'
  console.log('p in ProjectsCell:', p)
  console.log('projects ProjectsCell:', projects)
  return <NewTrip projects={projects} p={p} />
}

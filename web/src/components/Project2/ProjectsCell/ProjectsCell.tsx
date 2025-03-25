import type { ProjectsQuery, ProjectsQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<ProjectsQuery, ProjectsQueryVariables> =
  gql`
    query ProjectsQuery {
      projects {
        id
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Tom</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ projects }: CellSuccessProps<ProjectsQuery>) => {
  return (
    <ul>
      {projects.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}

import type { FindProjects, FindProjectsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Projects from 'src/components/Project/Projects'

export const QUERY: TypedDocumentNode<FindProjects, FindProjectsVariables> =
  gql`
    query FindProjects {
      projects {
        id
        name
        description
        userId
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No projects yet.{' '}
      <Link to={routes.newProject()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindProjects>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  projects,
}: CellSuccessProps<FindProjects, FindProjectsVariables>) => {
  return <Projects projects={projects} />
}

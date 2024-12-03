import type {
  FindProjectsbyUser,
  FindProjectsbyUserVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Projects from 'src/components/Project/Projects'

// export const QUERY: TypedDocumentNode<FindProjects, FindProjectsVariables> =
//   gql`
//     query FindProjects {
//       projects {
//         id
//         name
//         description
//         userId
//       }
//     }
//   `

export const QUERY: TypedDocumentNode<
  FindProjectsbyUser,
  FindProjectsbyUserVariables
> = gql`
  query FindProjectsbyUser {
    projects {
      id
      name
      description
      expenses {
        id
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center mt-6">
      No projects yet.{' '}
      <Link to={routes.newProject()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindProjectsbyUser>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  projects,
}: CellSuccessProps<FindProjectsbyUser, FindProjectsbyUserVariables>) => {
  return <Projects projects={projects} />
}

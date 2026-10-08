import { AlertCircle } from 'lucide-react'
import type { FindProjects, FindProjectsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Projects from 'src/components/Project/Projects'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import PageLoading from 'src/components/ui/PageLoading'

export const QUERY: TypedDocumentNode<FindProjects, FindProjectsVariables> =
  gql`
    query FindProjects {
      projects {
        id
        name
        description
        active
        organizationId
        expenses {
          id
          nokAmount
        }

        trips {
          id
        }

        createdBy {
          username
        }
        createdAt
      }
    }
  `

export const Loading = PageLoading

export const Empty = () => {
  return (
    <Alert variant="warning">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>No Projects Found</AlertTitle>
      <AlertDescription>
        <p>Your organization needs at least one project to track expenses.</p>
        <Link
          to={routes.newProject()}
          className="text-warning hover:text-warning/80 mt-2 inline-block font-medium"
        >
          Create First Project →
        </Link>
      </AlertDescription>
    </Alert>
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

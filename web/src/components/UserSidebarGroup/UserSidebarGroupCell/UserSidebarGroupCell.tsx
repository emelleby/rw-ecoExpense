import { AlertCircle } from 'lucide-react'
import type {
  UserSidebarGroupQuery,
  UserSidebarGroupQueryVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { useSidebar } from 'src/components/ui/Sidebar'
import UserSidebarGroup from 'src/components/UserSidebarGroup/UserSidebarGroup'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'

export const QUERY: TypedDocumentNode<
  UserSidebarGroupQuery,
  UserSidebarGroupQueryVariables
> = gql`
  query UserSidebarGroupQuery {
    projects(take: 5) {
      id
      name
    }
    tripsByUser(take: 3) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  const { setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    setOpenMobile(false)
  }

  return (
    <Alert variant="warning" className="mx-auto w-11/12">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>No Projects Found</AlertTitle>
      <AlertDescription>
        <Link
          to={routes.newProject()}
          className="text-warning hover:text-warning/80 mt-2 inline-block font-medium"
          onClick={handleLinkClick}
        >
          Create First Project →
        </Link>
      </AlertDescription>
    </Alert>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  projects,
  tripsByUser,
}: CellSuccessProps<UserSidebarGroupQuery>) => {
  // console.log(projects)
  return (
    <UserSidebarGroup tripsByUser={tripsByUser} projectsByUser={projects} />
  )
}

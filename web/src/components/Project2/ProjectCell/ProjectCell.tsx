import type { FindProjectById, FindProjectByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Project from 'src/components/Project/Project'

export const QUERY: TypedDocumentNode<
  FindProjectById,
  FindProjectByIdVariables
> = gql`
  query FindProjectByIdOld($id: Int!) {
    project: project(id: $id) {
      id
      name
      description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Project not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindProjectByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  project,
}: CellSuccessProps<FindProjectById, FindProjectByIdVariables>) => {
  return <Project project={project} />
}

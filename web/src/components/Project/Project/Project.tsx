import type {
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  FindProjectById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

const DELETE_PROJECT_MUTATION: TypedDocumentNode<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
> = gql`
  mutation DeleteProjectMutation($id: Int!) {
    deleteProject(id: $id) {
      id
    }
  }
`

interface Props {
  project: NonNullable<FindProjectById['project']>
}

const Project = ({ project }: Props) => {
  console.log(project)
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    onCompleted: () => {
      toast.success('Project deleted')
      navigate(routes.projects())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteProjectMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete project ' + id + '?')) {
      deleteProject({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Project Detail: {project.name}
          </h2>
        </header>
        <Table className="rw-table">
          <TableBody>
            <TableRow>
              <TableHead>Id:</TableHead>
              <TableCell>{project.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Name:</TableHead>
              <TableCell>{project.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Description:</TableHead>
              <TableCell>{project.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Created by:</TableHead>
              <TableCell>{project.createdBy.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Status active:</TableHead>
              <TableCell>{checkboxInputTag(project.active)}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Created date:</TableHead>
              <TableCell>{timeTag(project.createdAt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <nav className="mt-4 flex justify-center space-x-2">
        <Link
          to={routes.editProject({ id: project.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(project.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Project

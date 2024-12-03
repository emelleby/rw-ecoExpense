import type {
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  FindProjectsbyUser,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Project/ProjectsCell'
import { truncate } from 'src/lib/formatters'

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

const ProjectsList = ({ projects }: FindProjectsbyUser) => {
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    onCompleted: () => {
      toast.success('Project deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteProjectMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete project ' + id + '?')) {
      deleteProject({ variables: { id } })
    }
  }

  return (
    <>
      <Link
        to={routes.newProject()}
        className="rw-button rw-button-primary m-4 items-center"
      >
        <div className="rw-button-icon">+</div> New Project
      </Link>
      <div className="rw-segment rw-table-wrapper-responsive">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead># Expenses</TableHead>
              <TableHead className="text-right">&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{truncate(project.name)}</TableCell>
                <TableCell>{truncate(project.description)}</TableCell>
                <TableCell>{truncate(project.expenses.length)}</TableCell>
                <TableCell>
                  <nav className="flex justify-end space-x-2">
                    <Link
                      to={routes.project({ id: project.id })}
                      title={'Show project ' + project.id + ' detail'}
                      className="rw-button rw-button-small"
                    >
                      Show
                    </Link>
                    <Link
                      to={routes.editProject({ id: project.id })}
                      title={'Edit project ' + project.id}
                      className="rw-button rw-button-small rw-button-blue"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      title={'Delete project ' + project.id}
                      className="rw-button rw-button-small rw-button-red"
                      onClick={() => onDeleteClick(project.id)}
                    >
                      Delete
                    </button>
                  </nav>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default ProjectsList

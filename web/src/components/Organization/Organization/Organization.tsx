// This is the Show organization component
import type {
  DeleteOrganizationMutation,
  DeleteOrganizationMutationVariables,
  FindOrganizationById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import OrganizationUsers from '@/components/OrganizationUsers/OrganizationUsers'

const DELETE_ORGANIZATION_MUTATION: TypedDocumentNode<
  DeleteOrganizationMutation,
  DeleteOrganizationMutationVariables
> = gql`
  mutation DeleteOrganizationMutation($id: Int!) {
    deleteOrganization(id: $id) {
      id
    }
  }
`

interface Props {
  organization: NonNullable<FindOrganizationById['organization']>
}

const Organization = ({ organization }: Props) => {
  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success('Organization deleted')
      navigate(routes.organizations())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteOrganizationMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete organization ' + id + '?')) {
      deleteOrganization({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Organization {organization.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{organization.id}</td>
            </tr>
            <tr>
              <th>Regnr</th>
              <td>{organization.regnr}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{organization.name}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{organization.description}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(organization.createdAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editOrganization({ id: organization.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(organization.id)}
        >
          Delete
        </button>
      </nav>
      <OrganizationUsers users={organization.users} />
    </>
  )
}

export default Organization

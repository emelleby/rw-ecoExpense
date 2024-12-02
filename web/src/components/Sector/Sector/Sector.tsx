import type {
  DeleteSectorMutation,
  DeleteSectorMutationVariables,
  FindSectorById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

const DELETE_SECTOR_MUTATION: TypedDocumentNode<
  DeleteSectorMutation,
  DeleteSectorMutationVariables
> = gql`
  mutation DeleteSectorMutation($id: Int!) {
    deleteSector(id: $id) {
      id
    }
  }
`

interface Props {
  sector: NonNullable<FindSectorById['sector']>
}

const Sector = ({ sector }: Props) => {
  const [deleteSector] = useMutation(DELETE_SECTOR_MUTATION, {
    onCompleted: () => {
      toast.success('Sector deleted')
      navigate(routes.sectors())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteSectorMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete sector ' + id + '?')) {
      deleteSector({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Sector {sector.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{sector.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{sector.name}</td>
            </tr>
            <tr>
              <th>Factor</th>
              <td>{sector.factor}</td>
            </tr>
            <tr>
              <th>Currency</th>
              <td>{sector.currency}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editSector({ id: sector.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(sector.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Sector

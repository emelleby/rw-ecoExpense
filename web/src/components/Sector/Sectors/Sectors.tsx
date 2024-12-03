import type {
  DeleteSectorMutation,
  DeleteSectorMutationVariables,
  FindSectors,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Sector/SectorsCell'
import { truncate } from 'src/lib/formatters'

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

const SectorsList = ({ sectors }: FindSectors) => {
  const [deleteSector] = useMutation(DELETE_SECTOR_MUTATION, {
    onCompleted: () => {
      toast.success('Sector deleted')
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

  const onDeleteClick = (id: DeleteSectorMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete sector ' + id + '?')) {
      deleteSector({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Factor</th>
            <th>Currency</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {sectors.map((sector) => (
            <tr key={sector.id}>
              <td>{truncate(sector.id)}</td>
              <td>{truncate(sector.name)}</td>
              <td>{truncate(sector.factor)}</td>
              <td>{truncate(sector.currency)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.sector({ id: sector.id })}
                    title={'Show sector ' + sector.id + ' detail'}
                    className="rw-button rw-button-small rw-button-green"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editSector({ id: sector.id })}
                    title={'Edit sector ' + sector.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete sector ' + sector.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(sector.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SectorsList

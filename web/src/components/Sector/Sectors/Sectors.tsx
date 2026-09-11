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

import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

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
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Factor</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.map((sector) => (
              <TableRow key={sector.id} className="hover:bg-neutral-100">
                <TableCell className="font-medium">{sector.name}</TableCell>
                <TableCell>{sector.factor}</TableCell>
                <TableCell className="text-muted-foreground">
                  {sector.currency}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to={routes.sector({ id: sector.id })}
                        title={'Show sector ' + sector.id + ' detail'}
                      >
                        Show
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to={routes.editSector({ id: sector.id })}
                        title={'Edit sector ' + sector.id}
                      >
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      title={'Delete sector ' + sector.id}
                      onClick={() => onDeleteClick(sector.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default SectorsList

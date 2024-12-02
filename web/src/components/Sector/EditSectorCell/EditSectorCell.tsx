import type {
  EditSectorById,
  UpdateSectorInput,
  UpdateSectorMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import SectorForm from 'src/components/Sector/SectorForm'

export const QUERY: TypedDocumentNode<EditSectorById> = gql`
  query EditSectorById($id: Int!) {
    sector: sector(id: $id) {
      id
      name
      factor
      currency
    }
  }
`

const UPDATE_SECTOR_MUTATION: TypedDocumentNode<
  EditSectorById,
  UpdateSectorMutationVariables
> = gql`
  mutation UpdateSectorMutation($id: Int!, $input: UpdateSectorInput!) {
    updateSector(id: $id, input: $input) {
      id
      name
      factor
      currency
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ sector }: CellSuccessProps<EditSectorById>) => {
  const [updateSector, { loading, error }] = useMutation(
    UPDATE_SECTOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Sector updated')
        navigate(routes.sectors())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateSectorInput,
    id: EditSectorById['sector']['id']
  ) => {
    updateSector({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Sector {sector?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <SectorForm
          sector={sector}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}

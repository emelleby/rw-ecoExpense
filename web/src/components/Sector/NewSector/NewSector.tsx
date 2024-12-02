import type {
  CreateSectorMutation,
  CreateSectorInput,
  CreateSectorMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import SectorForm from 'src/components/Sector/SectorForm'

const CREATE_SECTOR_MUTATION: TypedDocumentNode<
  CreateSectorMutation,
  CreateSectorMutationVariables
> = gql`
  mutation CreateSectorMutation($input: CreateSectorInput!) {
    createSector(input: $input) {
      id
    }
  }
`

const NewSector = () => {
  const [createSector, { loading, error }] = useMutation(
    CREATE_SECTOR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Sector created')
        navigate(routes.sectors())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateSectorInput) => {
    createSector({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Sector</h2>
      </header>
      <div className="rw-segment-main">
        <SectorForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewSector

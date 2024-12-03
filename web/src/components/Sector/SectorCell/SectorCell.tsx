import type { FindSectorById, FindSectorByIdVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Sector from 'src/components/Sector/Sector'

export const QUERY: TypedDocumentNode<FindSectorById, FindSectorByIdVariables> =
  gql`
    query FindSectorById($id: Int!) {
      sector: sector(id: $id) {
        id
        name
        factor
        currency
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Sector not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindSectorByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  sector,
}: CellSuccessProps<FindSectorById, FindSectorByIdVariables>) => {
  return <Sector sector={sector} />
}

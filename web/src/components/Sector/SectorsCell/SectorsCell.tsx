import type { FindSectors, FindSectorsVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Sectors from 'src/components/Sector/Sectors'
import PageLoading from 'src/components/ui/PageLoading'

export const QUERY: TypedDocumentNode<FindSectors, FindSectorsVariables> = gql`
  query FindSectors {
    sectors {
      id
      name
      factor
      currency
    }
  }
`

export const Loading = PageLoading

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No sectors yet.{' '}
      <Link to={routes.newSector()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindSectors>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  sectors,
}: CellSuccessProps<FindSectors, FindSectorsVariables>) => {
  return <Sectors sectors={sectors} />
}

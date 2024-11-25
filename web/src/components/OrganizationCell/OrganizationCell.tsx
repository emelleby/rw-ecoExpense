import type {
  FindOrganizationsQuery,
  FindOrganizationsQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  FindOrganizationsQuery,
  FindOrganizationsQueryVariables
> = gql`
  query FindOrganizationsQuery {
    organizations {
      id
      name
      description
      regnr
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="rounded-lg bg-slate-800 p-6 text-white">
    <h3 className="text-xl font-semibold">No Organizations Found</h3>
    <p className="mt-2">Create your first organization to get started</p>
    {/* We'll add the CreateOrganization component here later */}
  </div>
)

export const Failure = ({
  error,
}: CellFailureProps<FindOrganizationsQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  organizations,
}: CellSuccessProps<FindOrganizationsQuery>) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-slate-800 p-6">
        <h2 className="text-xl font-bold text-white">
          Available Organizations
        </h2>
        <ul className="mt-4 space-y-2">
          {organizations.map((org) => (
            <li key={org.id} className="rounded bg-slate-700 p-4 text-white">
              <h3 className="font-semibold">{org.name}</h3>
              <p>{org.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

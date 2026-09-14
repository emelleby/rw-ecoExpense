import type {
  CreateShareLinkMutation,
  CreateShareLinkMutationVariables,
  RevokeShareLinkMutation,
  RevokeShareLinkMutationVariables,
  ShareTripControlsQuery,
  ShareTripControlsQueryVariables,
} from 'types/graphql'

import { TypedDocumentNode, gql, useMutation, useQuery } from '@redwoodjs/web'
import { useState } from 'react'

const QUERY: TypedDocumentNode<
  ShareTripControlsQuery,
  ShareTripControlsQueryVariables
> = gql`
  query ShareTripControlsQuery($id: Int!) {
    trip(id: $id) {
      id
      shareToken
    }
  }
`

const CREATE_SHARE_LINK_MUTATION: TypedDocumentNode<
  CreateShareLinkMutation,
  CreateShareLinkMutationVariables
> = gql`
  mutation CreateShareLinkMutation($tripId: Int!) {
    createShareLink(tripId: $tripId) {
      id
      shareToken
    }
  }
`

const REVOKE_SHARE_LINK_MUTATION: TypedDocumentNode<
  RevokeShareLinkMutation,
  RevokeShareLinkMutationVariables
> = gql`
  mutation RevokeShareLinkMutation($tripId: Int!) {
    revokeShareLink(tripId: $tripId) {
      id
      shareToken
    }
  }
`

const ShareTripControls = ({ tripId }: { tripId: number }) => {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id: tripId },
  })
  const [createShareLink] = useMutation(CREATE_SHARE_LINK_MUTATION)
  const [revokeShareLink] = useMutation(REVOKE_SHARE_LINK_MUTATION)
  const [copied, setCopied] = useState(false)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="rw-cell-error">{error.message}</div>
  }

  const shareToken = data?.trip?.shareToken
  const shareUrl = shareToken
    ? `${window.location.origin}/shared/trip/${shareToken}`
    : null

  const copyLink = () => {
    if (!shareUrl) {
      return
    }
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mb-4 rounded-md border border-gray-200 p-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-700">Share</h2>
      {shareToken ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">Shared</span>
          <input
            type="text"
            readOnly
            value={shareUrl ?? ''}
            className="min-w-0 flex-1 rounded-md border border-gray-200 px-2 py-2 text-sm text-gray-700"
          />
          <button
            type="button"
            onClick={copyLink}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={() =>
              revokeShareLink({ variables: { tripId } }).then(() => refetch())
            }
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Revoke link
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Not shared</span>
          <button
            type="button"
            onClick={() =>
              createShareLink({ variables: { tripId } }).then(() => refetch())
            }
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Create share link
          </button>
        </div>
      )}
    </div>
  )
}

export default ShareTripControls

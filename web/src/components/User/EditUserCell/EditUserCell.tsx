import type {
  EditUserById,
  UpdateUserInput,
  UpdateUserMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import Spinner from 'src/components/ui/Spinner'
import UserForm from 'src/components/User/UserForm'
import useLoader from 'src/hooks/useLoader'

export const QUERY: TypedDocumentNode<EditUserById> = gql`
  query EditUserById($id: Int!) {
    user: user(id: $id) {
      id
      clerkId
      username
      email
      firstName
      lastName
      bankAccount
      status
      organizationId
    }
  }
`

const UPDATE_USER_MUTATION: TypedDocumentNode<
  EditUserById,
  UpdateUserMutationVariables
> = gql`
  mutation UpdateUserMutation($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      clerkId
      username
      email
      firstName
      lastName
      bankAccount
      status
      organizationId
    }
  }
`

export const Loading = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner />
  </div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ user }: CellSuccessProps<EditUserById>) => {
  // const { showLoader, hideLoader, Loader } = useLoader()

  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User updated')
      navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = async (
    input: UpdateUserInput,
    id: EditUserById['user']['id']
  ) => {
    // showLoader()
    await updateUser({ variables: { id, input } })
    // hideLoader()
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit User {user?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <UserForm user={user} onSave={onSave} error={error} loading={loading} />
      </div>
      {/* {Loader()} */}
    </div>
  )
}

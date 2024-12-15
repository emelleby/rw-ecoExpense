import type {
  //  DeleteUserMutation,
  //DeleteUserMutationVariables,
  FindUsersByOrganization,
  updateUserStatus,
} from 'types/graphql'

//import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { UserManagement } from 'src/components/Custom/UserManagement/UserManagement'
import { QUERY } from 'src/components/User/UsersCell'
import useLoader from 'src/hooks/useLoader'
//import { formatEnum, truncate } from 'src/lib/formatters'

// const DELETE_USER_MUTATION: TypedDocumentNode<
//   DeleteUserMutation,
//   DeleteUserMutationVariables
// > = gql`
//   mutation DeleteUserMutation($id: Int!) {
//     deleteUser(id: $id) {
//       id
//     }
//   }
//`

const UPDATE_USER_MUTATION: TypedDocumentNode<updateUserStatus> = gql`
  mutation updateUserStatus($id: Int!) {
    updateUserStatus(id: $id) {
      id
    }
  }
`

const UsersList = ({ usersByOrganization: users }: FindUsersByOrganization) => {
  const { Loader, showLoader, hideLoader } = useLoader()
  // const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
  //   onCompleted: () => {
  //     toast.success('User deleted')
  //   },
  //   onError: (error) => {
  //     toast.error(error.message)
  //   },
  //   // This refetches the query on the list page. Read more about other ways to
  //   // update the cache over here:
  //   // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
  //   refetchQueries: [{ query: QUERY }],
  //   awaitRefetchQueries: true,
  // })

  // const onDeleteClick = (id: DeleteUserMutationVariables['id']) => {
  //   if (confirm('Are you sure you want to delete user ' + id + '?')) {
  //     deleteUser({ variables: { id } })
  //   }
  // }

  const [updateUserStatus] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User status updated')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [
      { query: QUERY, variables: { organizationId: users[0]?.organizationId } },
    ],
    awaitRefetchQueries: true,
  })

  const updateUserStatusAction = async (id: number) => {
    if (confirm('Are you sure you want to update user status ?')) {
      showLoader()
      await updateUserStatus({ variables: { id } })

      hideLoader()
    }
  }

  const activeUsers = users.filter((user) => user.status === 'ACTIVE')

  const inactiveUsers = users.filter((user) => user.status === 'INACTIVE')

  return (
    <div>
      <UserManagement
        activeUsers={activeUsers}
        inactiveUsers={inactiveUsers}
        updateUserStatus={updateUserStatusAction}
      />
      {Loader()}
    </div>
  )
}

export default UsersList

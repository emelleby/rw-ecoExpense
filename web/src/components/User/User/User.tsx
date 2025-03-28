import type {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  FindUserById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { formatEnum } from 'src/lib/formatters'

import { useAuth } from '@/auth'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/Table'

const DELETE_USER_MUTATION: TypedDocumentNode<
  DeleteUserMutation,
  DeleteUserMutationVariables
> = gql`
  mutation DeleteUserMutation($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

interface Props {
  user: NonNullable<FindUserById['user']>
}

const User = ({ user }: Props) => {
  const { hasRole, currentUser } = useAuth()
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User deleted')
      navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteUserMutationVariables['id']) => {
    if (hasRole('admin')) {
      toast.error('Cannot delete admin users')
      return
    }
    if (confirm('Are you sure you want to delete user ' + id + '?')) {
      deleteUser({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            User {user.id} Detail
          </h2>
        </header>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>{user.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Clerk id</TableCell>
              <TableCell>{user.clerkId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>First name</TableCell>
              <TableCell>{user.firstName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Last name</TableCell>
              <TableCell>{user.lastName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bank account</TableCell>
              <TableCell>{user.bankAccount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>{formatEnum(user.status)}</TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell>Organization id</TableCell>
              <TableCell>{user.organizationId}</TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </div>
      <nav className="rw-button-group space-x-3">
        <Button
          variant="outline"
          type="button"
          className=""
          onClick={() => navigate(routes.users())}
        >
          CANCEL
        </Button>
        <Link
          to={routes.editUser({ id: user.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <Button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(user.id)}
        >
          Delete
        </Button>
      </nav>
    </>
  )
}

export default User

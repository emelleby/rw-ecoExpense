import { useAuth } from 'src/auth'
import UsersCell from 'src/components/User/UsersCell'

const UsersPage = () => {
  const { currentUser } = useAuth()

  return <UsersCell organizationId={currentUser.organizationId as number} />
}

export default UsersPage

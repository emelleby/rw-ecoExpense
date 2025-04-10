// import { Link, routes } from '@redwoodjs/router'
import { useAuth } from 'src/auth'
import ProfileCell from 'src/components/ProfileCell'

const ProfilePage = () => {
  const { currentUser } = useAuth()

  return <ProfileCell id={currentUser.dbUserId as number} />
}

export default ProfilePage

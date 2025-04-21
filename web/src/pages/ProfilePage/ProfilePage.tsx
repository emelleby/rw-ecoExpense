// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import ProfileCell from 'src/components/ProfileCell'

const ProfilePage = ({ title = 'My Profile' }) => {
  const { currentUser } = useAuth()

  return (
    <>
      <Metadata title="My Profile" description="User profile page" />
      <ProfileCell id={currentUser.dbUserId as number} />
    </>
  )
}

export default ProfilePage

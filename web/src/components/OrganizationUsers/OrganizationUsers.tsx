interface User {
  id: number
  username: string
  email: string
  firstName: string | null
  lastName: string | null
}

interface OrganizationUsersProps {
  users: User[]
}

const OrganizationUsers = ({ users }: OrganizationUsersProps) => {
  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrganizationUsers

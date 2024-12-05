import { useState } from 'react'

import { toast } from '@redwoodjs/web/toast'

import { UserSearch } from './UserSearch'
import { UserTable } from './UserTable'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// We should probably import our own types here
type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: Date
  status: 'pending' | 'approved'
  organizationId: string
}

// Mock data for demonstration
const mockPendingUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date('2024-03-15'),
    status: 'pending',
    organizationId: 'org1',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    createdAt: new Date('2024-03-14'),
    status: 'pending',
    organizationId: 'org1',
  },
]

const mockApprovedUsers: User[] = [
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    createdAt: new Date('2024-03-10'),
    status: 'approved',
    organizationId: 'org1',
  },
  {
    id: '4',
    firstName: 'Bob',
    lastName: 'Wilson',
    email: 'bob@example.com',
    createdAt: new Date('2024-03-09'),
    status: 'approved',
    organizationId: 'org1',
  },
]

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredApprovedUsers = mockApprovedUsers.filter((user) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  })

  const handlePendingAction = (userId: string, action: string) => {
    toast.success('Operation completed successfully')
  }

  const handleApprovedAction = (userId: string, action: string) => {
    toast.success('Operation completed successfully')
  }

  const handleError = (error) => {
    toast.error('Something went wrong: ' + error.message)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pending Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={mockPendingUsers}
            type="pending"
            onAction={handlePendingAction}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserSearch value={searchQuery} onChange={setSearchQuery} />
          <UserTable
            users={filteredApprovedUsers}
            type="approved"
            onAction={handleApprovedAction}
          />
        </CardContent>
      </Card>
    </div>
  )
}

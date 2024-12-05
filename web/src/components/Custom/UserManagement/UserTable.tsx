import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

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
// And our own formatters
import { TimeTag } from '@/lib/formatters'

import { format } from 'date-fns'
export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy')
}

interface UserTableProps {
  users: User[]
  type: 'pending' | 'approved'
  onAction: (userId: string, action: string) => void
}

export function UserTable({ users, type, onAction }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatDate(user.createdAt)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {type === 'pending' ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onAction(user.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onAction(user.id, 'deny')}
                    >
                      Deny
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAction(user.id, 'details')}
                    >
                      Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onAction(user.id, 'reports')}
                    >
                      Reports
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

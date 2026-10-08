import { Edit } from 'lucide-react'
import type { CustomersByUser, CustomersByUserVariables } from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import PageLoading from 'src/components/ui/PageLoading'

import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

export type Customer = { id: number; name: string }

export const QUERY: TypedDocumentNode<
  CustomersByUser,
  CustomersByUserVariables
> = gql`
  query CustomersByUser {
    customersByUser {
      id
      name
    }
  }
`

export const Loading = PageLoading

export const Empty = () => (
  <div className="py-4 text-center text-muted-foreground">
    No customers found. Add your first customer to get started.
  </div>
)

export const Failure = ({ error }: CellFailureProps) => (
  <div className="py-4 text-center text-destructive">
    Error: {error?.message}
  </div>
)

export const Success = ({
  customersByUser,
  onEdit,
  onViewRates,
}: CellSuccessProps<CustomersByUser> & {
  onEdit: (customer: Customer) => void
  onViewRates: (customer: Customer) => void
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {customersByUser.map((customer) => (
        <TableRow key={customer.id}>
          <TableCell>{customer.name}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(customer)}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewRates(customer)}
              >
                View Rates
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

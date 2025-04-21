import { Edit, Trash2 } from 'lucide-react'

import { useMutation } from '@redwoodjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

// Define the Rate type directly in this file
export type Rate = {
  id: number
  customerId: number
  rateType: 'hourly' | 'daily'
  rateAmount: number
  description?: string | null
}

import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

// Define query types
type FindRatesByCustomerQuery = {
  ratesByCustomer: Rate[]
}

type FindRatesByCustomerQueryVariables = {
  customerId: number
}

export const QUERY: TypedDocumentNode<
  FindRatesByCustomerQuery,
  FindRatesByCustomerQueryVariables
> = gql`
  query FindRatesByCustomerQuery($customerId: Int!) {
    ratesByCustomer(customerId: $customerId) {
      id
      rateType
      rateAmount
      description
      customerId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="py-4 text-center text-muted-foreground">
    No rates found for this customer. Add a rate to get started.
  </div>
)

export const Failure = ({
  error,
}: CellFailureProps<FindRatesByCustomerQueryVariables>) => (
  <div className="py-4 text-center text-destructive">
    Error: {error?.message}
  </div>
)

const DELETE_RATE_MUTATION = gql`
  mutation DeleteRateMutation($id: Int!) {
    deleteRate(id: $id) {
      id
    }
  }
`

export const Success = ({
  ratesByCustomer,
  onEdit,
  customerId,
}: CellSuccessProps<
  FindRatesByCustomerQuery,
  FindRatesByCustomerQueryVariables
> & {
  onEdit?: (rate: Rate) => void
}) => {
  const [deleteRate] = useMutation(DELETE_RATE_MUTATION, {
    onCompleted: () => {
      toast.success('Rate deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY, variables: { customerId: customerId } }],
  })

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this rate?')) {
      deleteRate({ variables: { id } })
    }
  }

  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ratesByCustomer &&
          ratesByCustomer.map((rate: Rate) => (
            <TableRow key={rate.id}>
              <TableCell className="capitalize">{rate.rateType}</TableCell>
              <TableCell>{rate.rateAmount}</TableCell>
              <TableCell>{rate.description || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2 sm:space-x-1">
                  <Button
                    variant="outline"
                    className="p-2 sm:p-3"
                    size="sm"
                    onClick={() => onEdit && onEdit(rate)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    <div className="hidden sm:block">Edit</div>
                  </Button>
                  <Button
                    variant="outline"
                    className="p-2 sm:p-3"
                    size="sm"
                    onClick={() => handleDelete(rate.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    <div className="hidden sm:block">Delete</div>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

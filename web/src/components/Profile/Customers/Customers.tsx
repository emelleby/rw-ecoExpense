import { useState } from 'react'

import { PlusCircle, Users } from 'lucide-react'

import { useForm } from '@redwoodjs/forms'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

type Customer = {
  id: number
  name: string
}

type CustomerFormValues = {
  name: string
}

const CUSTOMERS_QUERY = gql`
  query CustomersByUser {
    customersByUser {
      id
      name
    }
  }
`

const CREATE_CUSTOMER_MUTATION = gql`
  mutation CreateCustomerMutation($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      name
    }
  }
`

const Customers = () => {
  const [open, setOpen] = useState(false)

  const formMethods = useForm<CustomerFormValues>({
    defaultValues: {
      name: '',
    },
  })

  const { data, loading: queryLoading, refetch } = useQuery(CUSTOMERS_QUERY)

  const [createCustomer, { loading: mutationLoading }] = useMutation(
    CREATE_CUSTOMER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Customer created successfully')
        setOpen(false)
        formMethods.reset()
        refetch() // Refresh the customer list
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSubmit = (data: CustomerFormValues) => {
    createCustomer({ variables: { input: data } })
  }

  const loading = queryLoading || mutationLoading

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="text-lg font-medium">Your Customers</span>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Add a new customer to your list. You can add rates for this
                customer later.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  {...formMethods.register('name', {
                    required: 'Customer name is required',
                  })}
                  placeholder="Enter customer name"
                />
                {formMethods.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {formMethods.formState.errors.name.message}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Customer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {queryLoading ? (
        <div className="py-4 text-center">Loading customers...</div>
      ) : data?.customersByUser?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.customersByUser.map((customer: Customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Rates
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-4 text-center text-muted-foreground">
          No customers found. Add your first customer to get started.
        </div>
      )}
    </div>
  )
}

export default Customers

import { useState } from 'react'

import { Edit, PlusCircle, Users } from 'lucide-react'

import {
  Form,
  Label,
  TextField,
  FieldError,
  Submit,
  FormError,
  useForm,
} from '@redwoodjs/forms'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import CustomerRatesCell from 'src/components/Profile/Customers/CustomerRatesCell/CustomerRatesCell'
import { Rate } from 'src/components/Profile/Customers/CustomerRatesCell/CustomerRatesCell'
import RatesDialog from 'src/components/Profile/Customers/RatesDialog/RatesDialog'

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
// Import removed
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

// We're using the Rate type imported from CustomerRatesCell

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

const UPDATE_CUSTOMER_MUTATION = gql`
  mutation UpdateCustomerMutation($id: Int!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      name
    }
  }
`

const Customers = () => {
  const [open, setOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)

  // Rates dialog state
  const [ratesDialogOpen, setRatesDialogOpen] = useState(false)
  const [rateFormDialogOpen, setRateFormDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  )
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null)

  const formMethods = useForm()

  const { data, loading: queryLoading, refetch } = useQuery(CUSTOMERS_QUERY)

  const [createCustomer, { loading: createLoading }] = useMutation(
    CREATE_CUSTOMER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Customer created successfully')
        setOpen(false)
        // Form will be reset when dialog is closed
        refetch() // Refresh the customer list
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const [updateCustomer, { loading: updateLoading }] = useMutation(
    UPDATE_CUSTOMER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Customer updated successfully')
        setOpen(false)
        // Form will be reset when dialog is closed
        setIsEditMode(false)
        setCurrentCustomer(null)
        refetch() // Refresh the customer list
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSubmit = (data: CustomerFormValues) => {
    if (isEditMode && currentCustomer) {
      updateCustomer({
        variables: {
          id: currentCustomer.id,
          input: data,
        },
      })
    } else {
      createCustomer({ variables: { input: data } })
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    setIsEditMode(true)
    setCurrentCustomer(customer)
    setOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setOpen(open)
    if (!open) {
      // Reset state when dialog is closed
      setIsEditMode(false)
      setCurrentCustomer(null)
    }
  }

  const handleViewRates = (customer: Customer) => {
    setSelectedCustomer(customer)
    setRatesDialogOpen(true)
  }

  const handleEditRate = (rate: Rate) => {
    setSelectedRate(rate)
    setRateFormDialogOpen(true)
  }

  const handleRateFormComplete = () => {
    setSelectedRate(null)
    // Keep the rates dialog open to show the updated rates
    setRateFormDialogOpen(false)
  }

  const loading = queryLoading || createLoading || updateLoading

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="text-lg font-medium">Your Customers</span>
        </div>
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              onClick={() => {
                setIsEditMode(false)
                setCurrentCustomer(null)
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? 'Edit the customer name below.'
                  : 'Add a new customer to your list. You can add rates for this customer later.'}
              </DialogDescription>
            </DialogHeader>
            <div className="rw-form-wrapper">
              <Form
                onSubmit={onSubmit}
                error={null}
                className="space-y-4"
                formMethods={formMethods}
              >
                <FormError
                  error={null}
                  wrapperClassName="rw-form-error-wrapper"
                  titleClassName="rw-form-error-title"
                  listClassName="rw-form-error-list"
                />
                <div className="space-y-2">
                  <Label
                    name="name"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Customer Name
                  </Label>
                  <TextField
                    name="name"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{ required: true }}
                    placeholder="Enter customer name"
                    defaultValue={currentCustomer?.name || ''}
                  />
                  <FieldError name="name" className="rw-field-error" />
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
                  <Submit disabled={loading} className="rw-button">
                    {loading
                      ? 'Saving...'
                      : isEditMode
                        ? 'Update Customer'
                        : 'Save Customer'}
                  </Submit>
                </DialogFooter>
              </Form>
            </div>
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
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRates(customer)}
                    >
                      View Rates
                    </Button>
                  </div>
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

      {/* Rates Dialog */}
      {selectedCustomer && (
        <Dialog
          open={ratesDialogOpen}
          onOpenChange={(open) => {
            setRatesDialogOpen(open)
            if (!open) {
              setSelectedCustomer(null)
              setSelectedRate(null)
              setRateFormDialogOpen(false)
            }
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Rates for {selectedCustomer.name}</DialogTitle>
              <DialogDescription>
                Manage rates for this customer. You can add, edit, or delete
                rates.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="mb-4 flex items-center justify-start">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedRate(null) // Ensure we're in create mode
                    setRateFormDialogOpen(true) // Open the rate form dialog
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Rate
                </Button>
              </div>

              <CustomerRatesCell
                customerId={selectedCustomer.id}
                onEdit={handleEditRate}
              />

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRatesDialogOpen(false)
                    setSelectedCustomer(null)
                    setSelectedRate(null)
                  }}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Rate Edit/Create Dialog */}
      {selectedCustomer && (
        <RatesDialog
          open={rateFormDialogOpen}
          onOpenChange={(open: boolean) => {
            setRateFormDialogOpen(open)
            if (!open) {
              setSelectedRate(null)
            }
          }}
          customerId={selectedCustomer.id}
          customerName={selectedCustomer.name}
          rate={selectedRate || undefined}
          onComplete={handleRateFormComplete}
        />
      )}
    </div>
  )
}

export default Customers

import { Form, Label, TextField, FieldError, Submit } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {
  QUERY as CUSTOMERS_QUERY,
  type Customer,
} from 'src/components/Profile/Customers/CustomersCell/CustomersCell'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'

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

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Set to edit an existing customer; omit to create */
  customer?: Customer | null
}

// Owns the create/update mutations; the form fields are rendered in the
// dialog content, which Radix only mounts while open, so defaults are fresh.
const CustomerDialog = ({ open, onOpenChange, customer }: Props) => {
  const isEditMode = !!customer

  const options = (verb: string) => ({
    onCompleted: () => {
      toast.success(`Customer ${verb} successfully`)
      onOpenChange(false)
    },
    onError: (error) => toast.error(error.message),
    refetchQueries: [{ query: CUSTOMERS_QUERY }],
  })
  const [createCustomer, { loading: creating }] = useMutation(
    CREATE_CUSTOMER_MUTATION,
    options('created')
  )
  const [updateCustomer, { loading: updating }] = useMutation(
    UPDATE_CUSTOMER_MUTATION,
    options('updated')
  )
  const loading = creating || updating

  const onSubmit = (input: { name: string }) =>
    customer
      ? updateCustomer({ variables: { id: customer.id, input } })
      : createCustomer({ variables: { input } })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Form onSubmit={onSubmit} className="space-y-4">
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
                defaultValue={customer?.name ?? ''}
              />
              <FieldError name="name" className="rw-field-error" />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
  )
}

export default CustomerDialog

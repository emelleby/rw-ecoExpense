import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {
  QUERY as RATES_QUERY,
  type Rate,
} from 'src/components/Profile/Customers/CustomerRatesCell/CustomerRatesCell'
import RateForm from 'src/components/Profile/Customers/RateForm'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'

const CREATE_RATE_MUTATION = gql`
  mutation CreateRateMutation($input: CreateRateInput!) {
    createRate(input: $input) {
      id
      rateType
      rateAmount
      description
    }
  }
`

const UPDATE_RATE_MUTATION = gql`
  mutation UpdateRateMutation($id: Int!, $input: UpdateRateInput!) {
    updateRate(id: $id, input: $input) {
      id
      rateType
      rateAmount
      description
    }
  }
`

type RatesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: number
  customerName: string
  rate?: Rate
  onComplete: () => void
}

// Owns the create/update mutations; RateForm is only the fields.
const RatesDialog = ({
  open,
  onOpenChange,
  customerId,
  customerName,
  rate,
  onComplete,
}: RatesDialogProps) => {
  const isEditMode = !!rate

  const options = (verb: string) => ({
    onCompleted: () => {
      toast.success(`Rate ${verb} successfully`)
      onOpenChange(false)
      onComplete()
    },
    onError: (error) => toast.error(error.message),
    refetchQueries: [{ query: RATES_QUERY, variables: { customerId } }],
  })
  const [createRate, { loading: creating }] = useMutation(
    CREATE_RATE_MUTATION,
    options('created')
  )
  const [updateRate, { loading: updating }] = useMutation(
    UPDATE_RATE_MUTATION,
    options('updated')
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Rate' : 'Add New Rate'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Edit rate for ${customerName}`
              : `Add a new rate for ${customerName}`}
          </DialogDescription>
        </DialogHeader>
        <div className="rw-form-wrapper">
          <RateForm
            rate={rate}
            loading={creating || updating}
            onCancel={() => onOpenChange(false)}
            onSave={(input) =>
              rate
                ? updateRate({ variables: { id: rate.id, input } })
                : createRate({
                    variables: { input: { ...input, customerId } },
                  })
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RatesDialog

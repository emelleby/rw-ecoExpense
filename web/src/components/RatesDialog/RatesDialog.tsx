import { useState } from 'react'

import {
  Controller,
  useForm,
  TextField,
  Form,
  Label,
  NumberField,
  FieldError,
  Submit,
  FormError,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY as RATES_QUERY } from 'src/components/CustomerRatesCell/CustomerRatesCell'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'

type Rate = {
  id: number
  customerId: number
  rateType: 'hourly' | 'daily'
  rateAmount: number
  description?: string
}

type RateFormValues = {
  rateType: 'hourly' | 'daily'
  rateAmount: number
  description: string
}

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

const RatesDialog = ({
  open,
  onOpenChange,
  customerId,
  customerName,
  rate,
  onComplete,
}: RatesDialogProps) => {
  const isEditMode = !!rate

  const formMethods = useForm<RateFormValues>({
    defaultValues: {
      rateType: rate?.rateType || 'hourly',
      rateAmount: rate?.rateAmount,
      description: rate?.description || '',
    },
  })

  const [createRate, { loading: createLoading }] = useMutation(
    CREATE_RATE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Rate created successfully')
        onOpenChange(false)
        formMethods.reset({
          rateType: 'hourly',
          rateAmount: 0,
          description: '',
        })
        onComplete()
      },
      onError: (error) => {
        toast.error(error.message)
      },
      refetchQueries: [{ query: RATES_QUERY, variables: { customerId } }],
    }
  )

  const [updateRate, { loading: updateLoading }] = useMutation(
    UPDATE_RATE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Rate updated successfully')
        onOpenChange(false)
        formMethods.reset({
          rateType: 'hourly',
          rateAmount: 0,
          description: '',
        })
        onComplete()
      },
      onError: (error) => {
        toast.error(error.message)
      },
      refetchQueries: [{ query: RATES_QUERY, variables: { customerId } }],
    }
  )

  const onSubmit = (data: RateFormValues) => {
    if (isEditMode && rate) {
      updateRate({
        variables: {
          id: rate.id,
          input: data,
        },
      })
    } else {
      createRate({
        variables: {
          input: {
            ...data,
            customerId,
          },
        },
      })
    }
  }

  const handleDialogClose = (open: boolean) => {
    onOpenChange(open)
    if (!open) {
      // Reset form when dialog is closed
      formMethods.reset({
        rateType: 'hourly',
        rateAmount: 0,
        description: '',
      })
    }
  }

  const loading = createLoading || updateLoading

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
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
          <Form formMethods={formMethods} onSubmit={onSubmit} error={null}>
            <FormError
              error={null}
              wrapperClassName="rw-form-error-wrapper"
              titleClassName="rw-form-error-title"
              listClassName="rw-form-error-list"
            />
            <Label
              name="rateType"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Rate Type *
            </Label>
            <Controller
              name="rateType"
              defaultValue={rate?.rateType || 'hourly'}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="hourly"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="rateType" className="rw-field-error" />

            <Label
              name="rateAmount"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Rate Amount *
            </Label>
            <NumberField
              name="rateAmount"
              className="rw-input"
              placeholder="Enter rate amount"
              step="0.01"
              validation={{
                valueAsNumber: true,
                required: true,
                min: 0,
              }}
              errorClassName="rw-input rw-input-error"
            />
            <FieldError name="rateAmount" className="rw-field-error" />

            <Label
              name="description"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Description *
            </Label>
            <TextField
              name="description"
              className="rw-input"
              placeholder="Enter description"
              validation={{ required: true }}
              errorClassName="rw-input rw-input-error"
            />
            <FieldError name="description" className="rw-field-error" />

            <div className="rw-button-group">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Submit disabled={loading} className="rw-button rw-button-blue">
                {loading
                  ? 'Saving...'
                  : isEditMode
                    ? 'Update Rate'
                    : 'Save Rate'}
              </Submit>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RatesDialog

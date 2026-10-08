import {
  Controller,
  Form,
  FieldError,
  Label,
  NumberField,
  Submit,
  TextField,
  useForm,
} from '@redwoodjs/forms'

import type {
  Rate,
  RateType,
} from 'src/components/Profile/Customers/CustomerRatesCell/CustomerRatesCell'
import { RATE_TYPE_LABELS } from 'src/components/Profile/Customers/CustomerRatesCell/CustomerRatesCell'

import { Button } from '@/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'

export type RateFormValues = {
  rateType: RateType
  rateAmount: number
  description: string
}

type Props = {
  rate?: Rate
  loading?: boolean
  onSave: (values: RateFormValues) => void
  onCancel: () => void
}

// Presentational only: no queries or mutations here.
const RateForm = ({ rate, loading, onSave, onCancel }: Props) => {
  const formMethods = useForm<RateFormValues>({
    defaultValues: {
      rateType: rate?.rateType ?? 'HOURLY',
      rateAmount: rate?.rateAmount,
      description: rate?.description ?? '',
    },
  })

  return (
    <Form formMethods={formMethods} onSubmit={onSave}>
      <Label
        name="rateType"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Rate Type *
      </Label>
      <Controller
        name="rateType"
        rules={{ required: true }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select rate type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(RATE_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
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
        validation={{ valueAsNumber: true, required: true, min: 0 }}
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
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Submit disabled={loading} className="rw-button">
          {loading ? 'Saving...' : rate ? 'Update Rate' : 'Save Rate'}
        </Submit>
      </div>
    </Form>
  )
}

export default RateForm

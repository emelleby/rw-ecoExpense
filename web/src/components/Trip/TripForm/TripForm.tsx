import type { EditTripById, UpdateTripInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  NumberField,
  RadioField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormTrip = NonNullable<EditTripById['trip']>

interface TripFormProps {
  trip?: EditTripById['trip']
  onSave: (data: UpdateTripInput, id?: FormTrip['id']) => void
  error: RWGqlError
  loading: boolean
}

const TripForm = (props: TripFormProps) => {
  const onSubmit = (data: FormTrip) => {
    props.onSave(data, props?.trip?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormTrip> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.trip?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="startDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start date
        </Label>

        <DatetimeLocalField
          name="startDate"
          defaultValue={formatDatetime(props.trip?.startDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="startDate" className="rw-field-error" />

        <Label
          name="endDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End date
        </Label>

        <DatetimeLocalField
          name="endDate"
          defaultValue={formatDatetime(props.trip?.endDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="endDate" className="rw-field-error" />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <NumberField
          name="userId"
          defaultValue={props.trip?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="approvedDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Approved date
        </Label>

        <DatetimeLocalField
          name="approvedDate"
          defaultValue={formatDatetime(props.trip?.approvedDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="approvedDate" className="rw-field-error" />

        <Label
          name="reimbursementStatus"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Reimbursement status
        </Label>

        <div className="rw-check-radio-items">
          <RadioField
            id="trip-reimbursementStatus-0"
            name="reimbursementStatus"
            defaultValue="NOT_REQUESTED"
            defaultChecked={props.trip?.reimbursementStatus?.includes(
              'NOT_REQUESTED'
            )}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Not Requested</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="trip-reimbursementStatus-1"
            name="reimbursementStatus"
            defaultValue="PENDING"
            defaultChecked={props.trip?.reimbursementStatus?.includes(
              'PENDING'
            )}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Pending</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="trip-reimbursementStatus-2"
            name="reimbursementStatus"
            defaultValue="REIMBURSED"
            defaultChecked={props.trip?.reimbursementStatus?.includes(
              'REIMBURSED'
            )}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Reimbursed</div>
        </div>

        <FieldError name="reimbursementStatus" className="rw-field-error" />

        <Label
          name="transactionId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Transaction id
        </Label>

        <TextField
          name="transactionId"
          defaultValue={props.trip?.transactionId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="transactionId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default TripForm

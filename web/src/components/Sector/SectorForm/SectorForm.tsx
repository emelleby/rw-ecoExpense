import type { EditSectorById, UpdateSectorInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormSector = NonNullable<EditSectorById['sector']>

interface SectorFormProps {
  sector?: EditSectorById['sector']
  onSave: (data: UpdateSectorInput, id?: FormSector['id']) => void
  error: RWGqlError
  loading: boolean
}

const SectorForm = (props: SectorFormProps) => {
  const onSubmit = (data: FormSector) => {
    props.onSave(data, props?.sector?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormSector> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.sector?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="factor"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Factor
        </Label>

        <TextField
          name="factor"
          defaultValue={props.sector?.factor}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="factor" className="rw-field-error" />

        <Label
          name="currency"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Currency
        </Label>

        <TextField
          name="currency"
          defaultValue={props.sector?.currency}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="currency" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default SectorForm

import type {
  EditOrganizationById,
  UpdateOrganizationInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormOrganization = NonNullable<EditOrganizationById['organization']>

interface OrganizationFormProps {
  organization?: EditOrganizationById['organization']
  onSave: (data: UpdateOrganizationInput, id?: FormOrganization['id']) => void
  error: RWGqlError
  loading: boolean
}

const OrganizationForm = (props: OrganizationFormProps) => {
  const onSubmit = (data: FormOrganization) => {
    props.onSave(data, props?.organization?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormOrganization> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <Label
          name="regnr"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Regnr
        </Label>

        <TextField
          name="regnr"
          defaultValue={props.organization?.regnr}
          className="rw-input text-slate-700"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        {/* <Label htmlFor="regnr">Registration Number</Label>
        <Input
          type="text"
          id="regnr"
          name="regnr"
          defaultValue={props.organization?.regnr}
          placeholder="9-digits"
          className="mt-2 bg-slate-700 text-base text-slate-100"
        /> */}

        <FieldError name="regnr" className="rw-field-error" />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.organization?.name}
          className="rw-input text-slate-700"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.organization?.description}
          className="rw-input text-slate-700"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default OrganizationForm

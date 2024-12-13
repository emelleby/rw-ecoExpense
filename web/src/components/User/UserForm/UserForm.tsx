import type { EditUserById, UpdateUserInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  RadioField,
  Submit,
} from '@redwoodjs/forms'

type FormUser = NonNullable<EditUserById['user']>

interface UserFormProps {
  user?: EditUserById['user']
  onSave: (data: UpdateUserInput, id?: FormUser['id']) => void
  error: RWGqlError
  loading: boolean
}

const UserForm = (props: UserFormProps) => {
  const onSubmit = (data: FormUser) => {
    props.onSave(data, props?.user?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormUser> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="clerkId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Clerk id
        </Label>

        <TextField
          name="clerkId"
          defaultValue={props.user?.clerkId}
          className="rw-input"
          disabled
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="clerkId" className="rw-field-error" />

        <Label
          name="username"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Username
        </Label>

        <TextField
          name="username"
          defaultValue={props.user?.username}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="username" className="rw-field-error" />

        <Label
          name="email"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Email
        </Label>

        <TextField
          name="email"
          defaultValue={props.user?.email}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="email" className="rw-field-error" />

        <Label
          name="firstName"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          First name
        </Label>

        <TextField
          name="firstName"
          defaultValue={props.user?.firstName}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="firstName" className="rw-field-error" />

        <Label
          name="lastName"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Last name
        </Label>

        <TextField
          name="lastName"
          defaultValue={props.user?.lastName}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="lastName" className="rw-field-error" />

        <Label
          name="bankAccount"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Bank account
        </Label>

        <TextField
          name="bankAccount"
          defaultValue={props.user?.bankAccount}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="bankAccount" className="rw-field-error" />

        <Label
          name="status"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Status
        </Label>

        <div className="rw-check-radio-items">
          <RadioField
            id="user-status-0"
            name="status"
            defaultValue="ACTIVE"
            defaultChecked={props.user?.status?.includes('ACTIVE')}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Active</div>
        </div>

        <div className="rw-check-radio-items">
          <RadioField
            id="user-status-1"
            name="status"
            defaultValue="INACTIVE"
            defaultChecked={props.user?.status?.includes('INACTIVE')}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <div>Inactive</div>
        </div>

        <FieldError name="status" className="rw-field-error" />

        <Label
          name="organizationId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Organization id
        </Label>

        <TextField
          name="organizationId"
          defaultValue={props.user?.organizationId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          disabled
          //validation={{ required: true }}
        />

        <FieldError name="organizationId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UserForm

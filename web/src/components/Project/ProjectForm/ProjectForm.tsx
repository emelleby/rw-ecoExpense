import type { EditProjectById, UpdateProjectInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Controller,
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

import { Checkbox } from '@/components/ui/Checkbox'
import { Switch } from '@/components/ui/Switch'

type FormProject = NonNullable<EditProjectById['project']>

interface ProjectFormProps {
  project?: EditProjectById['project']
  onSave: (data: UpdateProjectInput, id?: FormProject['id']) => void
  error: RWGqlError
  loading: boolean
}

const ProjectForm = (props: ProjectFormProps) => {
  const onSubmit = (data: FormProject) => {
    props.onSave(data, props?.project?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormProject> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.project?.name}
          className="rw-input"
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
          defaultValue={props.project?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="active"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Active
        </Label>

        {/* <Checkbox
          name="active"
          defaultChecked={props.project?.active}
          className=""
        /> */}
        <Controller
          name="active"
          defaultValue={props.project?.active}
          render={({ field: { onChange, value } }) => (
            <Switch
              checked={value} // Use checked instead of defaultValue
              onCheckedChange={onChange}
              className="mt-2"
            />
          )}
        />
        {/* <Label
          name="active"
          className="rw-label ml-3"
          errorClassName="rw-label rw-label-error"
        >
          Trailer
        </Label> */}

        {/* <Label
          name="organizationId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Organization id
        </Label>

        <NumberField
          name="organizationId"
          defaultValue={props.project?.organizationId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="organizationId" className="rw-field-error" />

        <Label
          name="createdById"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Created by id
        </Label>

        <NumberField
          name="createdById"
          defaultValue={props.project?.createdById}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="createdById" className="rw-field-error" /> */}

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ProjectForm

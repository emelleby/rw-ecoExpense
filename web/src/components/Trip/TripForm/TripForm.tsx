import { Check, ChevronsUpDown } from 'lucide-react'
import type { EditTripById, UpdateTripInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Controller,
  SelectField,
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  // DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

import DatetimeLocalField from 'src/components/Custom/DatePicker'

import { Button } from '@/components/ui/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/Command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover'
import cn from '@/lib/utils/cn'

type FormTrip = NonNullable<EditTripById['trip']>

interface Project {
  id: string
  name: string
}

interface TripFormProps {
  trip?: EditTripById['trip']
  onSave: (data: UpdateTripInput, id?: FormTrip['id']) => void
  error: RWGqlError
  loading: boolean
  p?: string
  projects: {
    id: number
    name: string
    description?: string
    active: boolean
  }[]
}

const TripForm = (props: TripFormProps) => {
  console.log('TripForm data:', props)

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
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>
        <TextAreaField
          name="description"
          defaultValue={props.trip?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="startDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start date
        </Label>

        <DatetimeLocalField
          name="startDate"
          defaultValue={props.trip?.startDate}
          className="rw-input-calendar"
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
          defaultValue={props.trip?.endDate}
          className="rw-input-calendar"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="endDate" className="rw-field-error" />

        <div>
          <Label
            name="projectId"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            {props.p}
          </Label>

          <SelectField
            name="projectId"
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{
              required: true,
              validate: {
                matchesInitialValue: (value) => {
                  return Number(value) !== 0 || 'Please select a project'
                },
              },
            }}
            defaultValue={props.trip?.projectId || 0}
          >
            <option value={0}>Select a project...</option>
            {props.projects?.map((project) => (
              <option key={project.id} value={Number(project.id)}>
                {project.name}
              </option>
            ))}
          </SelectField>

          {/* <Controller
            name="projectId"
            defaultValue={props.trip?.name || null}
            render={({ field }) => {
              console.log('Controller field:', field)
              console.log('Projects in render:', props.projects)
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? props.projects?.find(
                            (project) => project.id === field.value
                          )?.name
                        : 'Select project...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search project..." />
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {props.projects &&
                          props.projects?.map((project) => (
                            <CommandItem
                              key={project.id}
                              value={String(project.id)}
                              onSelect={() => {
                                console.log('Selected project ID:', project.id)
                                field.onChange(project.id)
                                console.log('New field value:', field.value)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === project.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {project.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )
            }}
          /> */}
          <FieldError name="projectId" className="rw-field-error" />
        </div>

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

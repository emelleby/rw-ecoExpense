import React from 'react'

import { Controller, FieldError, Label, TextField } from '@redwoodjs/forms'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/Select'

interface CommonFieldsProps {
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  tripId?: number
  projectId?: number
  description?: string
}

export const CommonFields: React.FC<CommonFieldsProps> = ({
  trips,
  projects,
  tripId,
  description,
  projectId,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />
      </div>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
        <div>
          <Label
            name="tripId"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            Trip
          </Label>

          <Controller
            name="tripId"
            defaultValue={tripId || trips[0].id}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a trip..." />
                </SelectTrigger>
                <SelectContent>
                  {trips?.map((trip) => (
                    <SelectItem key={trip.id} value={trip.id.toString()}>
                      {trip.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError name="tripId" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="projectId"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            Project
          </Label>

          <Controller
            name="projectId"
            defaultValue={Number(projectId) || null}
            rules={{ required: false }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError name="projectId" className="rw-field-error" />
        </div>
      </div>
    </>
  )
}

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
  tripId?: number
  description?: string
}

export const CommonFields: React.FC<CommonFieldsProps> = ({
  trips,
  tripId,
  description,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-x-4">
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
      <div>
        <Label
          name="tripId"
          htmlFor="tripId"
          className="rw-label mb-2"
          errorClassName="rw-label rw-label-error"
        >
          Trip
        </Label>
        <Controller
          name="tripId"
          defaultValue={tripId || trips[0].id}
          data-testid="trip-select"
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value?.toString()}
            >
              <SelectTrigger id="tripId" data-testid="trip-select">
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
    </>
  )
}

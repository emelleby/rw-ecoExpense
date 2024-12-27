import { FC, useEffect } from 'react'

import type { EditExpenseById, CreateExpenseInput } from 'types/graphql'

import {
  Controller,
  FieldError,
  Label,
  useFormContext,
  TextField,
  RWGqlError,
} from '@redwoodjs/forms'

import DatetimeLocalField from 'src/components/Custom/DatePicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from 'src/components/ui/Select'
import { cn } from 'src/utils/cn'

import { FUEL_TYPE_LIST } from './constants'

import { Switch } from '@/components/ui/Switch'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void
  expense?: FormExpense
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  error: RWGqlError
}

export const CarDistanceBased: FC<ExpenseFormProps> = ({ expense }) => {
  const {
    setValue,
    getValues,
    formState: { errors },
    unregister,
  } = useFormContext()

  const handleUpdateDistanceOrFactor = () => {
    const distance = getValues('distance')

    let factor = getValues('factor')

    const passengers = getValues('passengers')

    factor += passengers

    setValue('nokAmount', factor * distance)
  }

  useEffect(() => {
    // unregister fields when component unmounts

    return () => {
      ;[
        'distance',
        'feulType',
        'fuelConsumption',
        'factor',
        'passengers',
        'trailer',
        'nokAmount',
        'date',
      ].forEach((field) => {
        unregister(field)
      })
    }
  }, [unregister])

  return (
    <div className="rw-form-wrapper">
      <div className=" grid grid-cols-2 gap-4">
        <div>
          <Label
            name="kilometers"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Distance
          </Label>
          <div className="relative mt-1 flex items-center">
            <TextField
              name="kilometers"
              defaultValue={expense?.kilometers}
              className="rw-input flex-1 pr-16"
              validation={{
                valueAsNumber: true,
                required: true,
                min: 1,
                setValueAs: (value) => Number(value),
              }}
              onChange={(e) => {
                const value = e.target.value
                e.target.value = value
                setValue('kilometers', value ? parseInt(value) : '')

                handleUpdateDistanceOrFactor()
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-gray-500">
              Km
            </span>
          </div>
          <FieldError name="kilometers" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="fuelType"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            Fuel Type
          </Label>

          <Controller
            name="fuelType"
            defaultValue={expense?.fuelType}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  // setValue('economy', VEHICLE_ECONOMY[value])
                }}
                value={field.value?.toString()}
                defaultValue={FUEL_TYPE_LIST[0]}
              >
                <SelectTrigger
                  className={cn('w-full', errors?.feulType && 'border-red-500')}
                >
                  <SelectValue placeholder="Select fuel type..." />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPE_LIST.map((feul, index) => (
                    <SelectItem key={index + 100} value={feul}>
                      {feul}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError name="fuelType" className="rw-field-error" />
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div>
          <Label
            name="fuelConsumption"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Fuel Consumption
          </Label>
          <div className="relative mt-1 flex items-center">
            <TextField
              name="fuelConsumption"
              defaultValue={10}
              className="rw-input flex-1 pr-16"
              validation={{ valueAsNumber: true, required: true, min: 1 }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '')
                e.target.value = value
                setValue('fuelConsumption', value ? parseInt(value) : '')
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-gray-500">
              Liters or KWh per 100 Km
            </span>
          </div>
          <FieldError name="fuelConsumption" className="rw-field-error" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label
            name="factor"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Factor
          </Label>
          <div className="relative flex items-center">
            <TextField
              name="factor"
              defaultValue={3.5}
              className="rw-input flex-1 pr-16"
              errorClassName="flex-1 border-none bg-transparent text-sm text-red-600 focus:outline-none"
              placeholder="0"
              validation={{ valueAsNumber: true, min: 1 }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                e.target.value = value
                setValue('Factor', value ? parseInt(value) : '')
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-gray-500">
              Kr/Km
            </span>
          </div>
          <FieldError name="factor" className="rw-field-error" />
        </div>
        {/* DEBUG:  ADD Passangers in expnse backend */}
        <div>
          <Label
            name="passengers"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Passengers
          </Label>
          <TextField
            name="passengers"
            defaultValue={0}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{
              valueAsNumber: true,
              setValueAs: (value) => Number(value),
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '')
              e.target.value = value
              setValue('passengers', value ? parseInt(value) : '')
              if (Number(value) > 0) {
                handleUpdateDistanceOrFactor()
              }
            }}
          />
          <FieldError name="passengers" className="rw-field-error" />
        </div>

        <div className="mt-6 flex flex-row items-center justify-center">
          <Controller
            name="trailer"
            defaultValue={false}
            render={({ field }) => (
              <Switch
                className="mt-7"
                onCheckedChange={(value) => {
                  field.onChange(value)

                  // get factor value

                  const factor = getValues('factor')

                  // if checked add 1 to factor else subtract 1
                  if (value) {
                    setValue('factor', factor + 1)
                    handleUpdateDistanceOrFactor()
                  } else {
                    setValue('factor', factor - 1)
                    handleUpdateDistanceOrFactor()
                  }
                }}
              />
            )}
          />
          <Label
            name="trailer"
            className="rw-label ml-3"
            errorClassName="rw-label rw-label-error"
          >
            Trailer
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Label
            name="nokAmount"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            NOK Amount
          </Label>
          <TextField
            name="nokAmount"
            defaultValue={expense?.nokAmount || 0}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{
              valueAsNumber: true,
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '')
              e.target.value = value
              setValue('nokAmount', value ? parseInt(value) : '')
            }}
          />
          <FieldError name="nokAmount" className="rw-field-error" />
        </div>
        <div>
          <Label
            name="date"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Date
          </Label>

          <DatetimeLocalField
            name="date"
            defaultValue={new Date()}
            className="rw-input-calendar"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />

          <FieldError name="date" className="rw-field-error" />
        </div>
      </div>
    </div>
  )
}

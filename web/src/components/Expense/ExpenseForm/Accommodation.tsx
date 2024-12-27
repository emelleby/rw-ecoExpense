import { FC, useEffect, useState } from 'react'

//import { Upload } from 'lucide-react'
import type {
  EditExpenseById,
  // UpdateExpenseInput,
  CreateExpenseInput,
} from 'types/graphql'

import {
  Controller,
  FieldError,
  Label,
  NumberField,
  RWGqlError,
  TextField,
  useFormContext,
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

import {
  ACCOMODATIONTYPES,
  COUNTRY_NAMES,
  //CURRENCIES,
  //EXCHANGE_RATES,
} from './constants'
import { CurrencyField } from './CurrencyField'
import { getCurrencyConversionRate } from './service'
//import { getCurrencyConversionRate } from './service'
//import UploadReciepts from './UploadReciepts'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void // Accept CreateExpenseInput directly
  expense?: FormExpense
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  error: RWGqlError
}

export const Accommodation: FC<ExpenseFormProps> = (
  props: ExpenseFormProps
) => {
  const date = new Date()

  const formMethods = useFormContext()

  const [exchangeRate, setExchangeRate] = useState(
    props.expense?.exchangeRate || 1
  )

  const [selectedDate, setSelectedDate] = useState(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  )

  const onCurrencyChange = async (value: string) => {
    const exchangeRate = await getCurrencyConversionRate(value, selectedDate)
    setExchangeRate(exchangeRate)
    formMethods.setValue('exchangeRate', exchangeRate)
    const amount = formMethods.getValues('amount')

    if (amount) {
      const nokAmount = (amount * exchangeRate).toFixed(2)
      formMethods.setValue('nokAmount', parseInt(nokAmount))
    }
  }

  useEffect(() => {
    async function fetchExchangeRate() {
      const exchangeRate = await getCurrencyConversionRate(
        props.expense?.currency,
        selectedDate
      )
      formMethods.setValue('exchangeRate', exchangeRate)
      setExchangeRate(exchangeRate)
    }
    if (props.expense?.currency) {
      fetchExchangeRate()
    }
  }, [selectedDate])

  useEffect(() => {
    return () => {
      ;[
        'accommodationType',
        'country',
        'numberOfPeople',
        'nights',
        'nokAmount',
        'tripId',
        'merchant',
        'amount',
        'currency',
        'projectId',
      ].forEach((field) => {
        formMethods.unregister(field)
      })
      formMethods.setValue('nokAmount', 0)
    }
  }, [])

  return (
    <>
      <div className=" grid grid-cols-2 gap-4">
        <div>
          <Label
            name="accommodationType"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            Accommodation Type
          </Label>

          <Controller
            name="accommodationType"
            defaultValue={ACCOMODATIONTYPES[0]}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value?.toString()}
                defaultValue={ACCOMODATIONTYPES[0]}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    formMethods.formState.errors?.accommodationType &&
                      'border-red-500'
                  )}
                >
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMODATIONTYPES.map((accommodation, index) => (
                    <SelectItem key={index} value={accommodation}>
                      {accommodation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError name="accommodationType" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="country"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            Country
          </Label>

          <Controller
            name="country"
            defaultValue={COUNTRY_NAMES[0]}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  console.log(formMethods.getValues('amount'))
                }}
                value={field.value?.toString()}
                defaultValue={COUNTRY_NAMES[0]}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    formMethods.formState.errors?.country && 'border-red-500'
                  )}
                >
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_NAMES.map((country, index) => (
                    <SelectItem key={index + 100} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError name="country" className="rw-field-error" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Label
            name="numberOfPeople"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            # People
          </Label>
          <NumberField
            name="numberOfPeople"
            defaultValue={1}
            className="rw-input appearance-none"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true, min: 1 }}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (value < 1) {
                e.target.value = '1'
              }
            }}
          />
          <FieldError name="numberOfPeople" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="nights"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            # Nights
          </Label>
          <NumberField
            name="nights"
            defaultValue={1}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true, min: 1 }}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (value < 1) {
                e.target.value = '1'
              }
            }}
          />
          <FieldError name="nights" className="rw-field-error" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Label
            name="merchant"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Merchant
          </Label>
          <TextField
            name="merchant"
            defaultValue={''}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: false }}
          />
          <FieldError name="merchant" className="rw-field-error" />
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
            onChange={(date) => {
              setSelectedDate(
                `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
              )
            }}
            className="rw-input-calendar"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />

          <FieldError name="date" className="rw-field-error" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div>
          <Label
            name="amount"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Amount
          </Label>
          <TextField
            name="amount"
            defaultValue={props?.expense?.amount || 0}
            className="rw-input"
            onChange={(e) => {
              const value = Number(e.target.value.replace(/[^0-9.]/g, ''))
              if (value > 0) {
                const nokAmount = (value * exchangeRate).toFixed(2)
                formMethods.setValue('nokAmount', parseFloat(nokAmount))
              }
            }}
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />
          <FieldError name="amount" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="currency"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            Currency
          </Label>

          <Controller
            name="currency"
            defaultValue={props.expense?.currency}
            rules={{ required: true }}
            render={({ field }) => (
              <CurrencyField
                currency={props.expense?.currency}
                isActive={true}
                onCurrencyChange={(value) => {
                  field.onChange(value)
                  onCurrencyChange(value)
                }}
              />
            )}
          />
          <FieldError name="currency" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="exchangeRate"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Exchange rate
          </Label>
          <TextField
            name="exchangeRate"
            defaultValue={props.expense?.exchangeRate}
            validation={{
              valueAsNumber: true,
              setValueAs: (value) => Number(value),
            }}
            onChange={(event) => {
              const newExchangeRate = event.target.value.replace(/[^0-9.]/g, '')
              // if (isNaN(newExchangeRate)) return
              setExchangeRate(Number(newExchangeRate))
              formMethods.setValue('exchangeRate', newExchangeRate)

              const amount = formMethods.getValues('amount')
              if (amount) {
                const nokAmount = amount * Number(newExchangeRate)
                formMethods.setValue('nokAmount', nokAmount)
              }
            }}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
          <FieldError name="exchangeRate" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="nokAmount"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            NOK amount
          </Label>
          <TextField
            name="nokAmount"
            defaultValue={
              props.expense?.nokAmount ? Number(props.expense.nokAmount) : 0
            }
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />
          <FieldError name="nokAmount" className="rw-field-error" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            defaultValue={props.expense?.tripId || props.trips[0].id}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value?.toString()}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    formMethods.formState.errors?.tripId && 'border-red-500'
                  )}
                >
                  <SelectValue placeholder="Select a trip..." />
                </SelectTrigger>
                <SelectContent>
                  {props.trips?.map((trip) => (
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
            defaultValue={props.expense?.projectId || props.projects[0].id}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value?.toString()}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    formMethods.formState.errors?.projectId && 'border-red-500'
                  )}
                >
                  <SelectValue placeholder="Select a project..." />
                </SelectTrigger>
                <SelectContent>
                  {props.projects?.map((project) => (
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

import { FC, useEffect, useState } from 'react'

//import { Upload } from 'lucide-react'
import type {
  EditExpenseById,
  // UpdateExpenseInput,
  CreateExpenseInput,
} from 'types/graphql'

import {
  CheckboxField,
  Controller,
  FieldError,
  Form,
  Label,
  NumberField,
  RWGqlError,
  TextField,
  useForm,
} from '@redwoodjs/forms'

import DatetimeLocalField from 'src/components/Custom/DatePicker'
import { Button } from 'src/components/ui/Button'
import { Combobox } from 'src/components/ui/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from 'src/components/ui/Select'
import { cn } from 'src/utils/cn'

import AirportSelect from '../AirportSearch'
import { CommonFields } from '../CommonFields'
import { CURRENCIES_OF_COUTRIES, FLIGHT_CLASSES } from '../constants'
import { calculateEmissions, getCurrencyConversionRate } from '../service'
import UploadReciepts from '../UploadReciepts'

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

export const PastFlights: FC<ExpenseFormProps> = (props: ExpenseFormProps) => {
  const date = new Date()

  const formMethods = useForm()

  const [exchangeRate, setExchangeRate] = useState(
    props.expense?.exchangeRate || 0
  )

  const flightTypeOptions = [
    { value: 'return', label: 'Return' },
    { value: 'oneWay', label: 'One Way' },
  ]

  const [selectedDate, setSelectedDate] = useState(date)

  const [fileName, setFileName] = useState(
    props.expense?.receipt?.fileName || ''
  )

  const [fileType, setFileType] = useState(
    props.expense?.receipt?.fileType || ''
  )

  const [receiptUrl, setReceiptUrl] = useState(
    props.expense?.receipt?.url || ''
  )

  const [radiativeFactor, setRadiativeFactor] = useState(true)

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

  const getEmission = async (data) => {
    const { from, via, to, flightClass, flightType, date, passengers } = data

    const d = new Date(date)
    const route = [from]
    if (via != '') {
      route.push(via)
    }
    route.push(to)
    const payload = {
      route,
      return: flightType === 'return',
      class: flightClass,
      departureDate: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      ir_factor: radiativeFactor,
      travelers: passengers,
    }

    const result = await calculateEmissions(payload)
    return {
      scope1Co2Emissions: 0,
      scope2Co2Emissions: 0,
      scope3Co2Emissions: result.total_emissions,
    }
  }

  const onSubmit = async (data) => {
    // Construct the receipt object
    //console.log('Receipt data submitted:', { receiptUrl, fileName, fileType }

    const {
      date,
      projectId,
      tripId,
      amount,
      currency,
      nokAmount,
      exchangeRate,
      description,
    } = data

    const receipt = receiptUrl
      ? {
          url: receiptUrl,
          fileName: fileName!,
          fileType: fileType!,
        }
      : undefined

    const emission = await getEmission(data)

    const dataWithReceipt = {
      date,
      projectId,
      tripId,
      amount,
      currency,
      nokAmount,
      exchangeRate,
      categoryId: 4,
      fuelAmountLiters: 0.0,
      fuelType: '',
      kilometers: 0,
      kwh: 0,
      description,
      scope3CategoryId: 6,
      ...emission,
      receipt, // Add the nested receipt object
    }

    // format the data before sending it to the server

    //const formattedData = formatData(dataWithReceipt)
    props.onSave(dataWithReceipt, props?.expense?.id)

    //console.log(dataWithReceipt)
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
    } else {
      formMethods.setValue('exchangeRate', 0)
    }
  }, [selectedDate, formMethods, props.expense?.currency])

  return (
    <Form onSubmit={onSubmit} formMethods={formMethods}>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <div>
          <Label
            name="flightType"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Flight Type
          </Label>

          <Controller
            name="flightType"
            defaultValue={flightTypeOptions[0].value}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
                defaultValue={flightTypeOptions[0].value}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    formMethods.formState.errors?.flightType && 'border-red-500'
                  )}
                >
                  <SelectValue placeholder="Select a Flight Type..." />
                </SelectTrigger>
                <SelectContent>
                  {flightTypeOptions.map((option) => (
                    <SelectItem key={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError name="flightType" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="from"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            From
          </Label>

          <Controller
            name="from"
            defaultValue={''}
            rules={{ required: true }}
            render={({ field }) => (
              <AirportSelect
                label=""
                onChange={(value) => {
                  field.onChange(value)
                  console.log(value)
                }}
                placeholder="Select an Origin Airport..."
                value=""
              />
            )}
          />

          <FieldError name="from" className="rw-field-error" />
        </div>
      </div>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <div>
          <Label
            name="via"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Via
          </Label>

          <Controller
            name="via"
            defaultValue={''}
            rules={{ required: false }}
            render={({ field }) => (
              <AirportSelect
                label=""
                onChange={(value) => {
                  field.onChange(value)
                  console.log(value)
                }}
                placeholder="Select a Via Airport..."
                value=""
              />
            )}
          />

          <FieldError name="via" className="rw-field-error" />
        </div>

        <div>
          <Label
            name="to"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Destination
          </Label>

          <Controller
            name="to"
            defaultValue={''}
            rules={{ required: true }}
            render={({ field }) => (
              <AirportSelect
                label=""
                onChange={(value) => {
                  field.onChange(value)
                  console.log(value)
                }}
                placeholder="Select a Destination Airport..."
                value=""
              />
            )}
          />

          <FieldError name="to" className="rw-field-error" />
        </div>
      </div>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <div>
          <Label
            name="flightClass"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Flight Class
          </Label>

          <Controller
            name="flightClass"
            defaultValue={'economy'}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value?.toString()}
                defaultValue={'economy'}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    formMethods.formState.errors?.flightClass &&
                      'border-red-500'
                  )}
                >
                  <SelectValue placeholder="Select a Flight Class..." />
                </SelectTrigger>
                <SelectContent>
                  {FLIGHT_CLASSES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError name="flightClass" className="rw-field-error" />
        </div>
        <div>
          <Label
            name="passengers"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            # Travelers
          </Label>
          <NumberField
            name="passengers"
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
          <FieldError name="passengers" className="rw-field-error" />
        </div>
      </div>

      <div className="grid gap-x-4 sm:grid-cols-2">
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
              setSelectedDate(date)
            }}
            className="rw-input-calendar"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />

          <FieldError name="date" className="rw-field-error" />
        </div>
      </div>

      <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
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
            defaultValue={props?.expense?.amount}
            placeholder="amount"
            className="rw-input"
            onChange={(e) => {
              const rawValue = e.target.value
                .replace(/,/g, '.')
                .replace(/[^0-9.]/g, '')
              const value = Number(rawValue)
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
              <Combobox
                Data={CURRENCIES_OF_COUTRIES}
                defaultValue={props.expense?.currency}
                defaultText="Currency"
                isActive={true}
                onChangeHandle={(value) => {
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
            disabled
            defaultValue={
              props.expense?.nokAmount ? Number(props.expense.nokAmount) : 0
            }
            className="rw-input rw-input-disabled"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />
          <FieldError name="nokAmount" className="rw-field-error" />
        </div>
      </div>

      <CommonFields
        // projects={props.projects}
        trips={props.trips}
        tripId={props.expense?.tripId}
        description={props.expense?.description}
        formMethods={formMethods}
      />

      <div className="mt-6 grid grid-cols-1 gap-4">
        <UploadReciepts
          fileName={fileName}
          fileType={fileType}
          id={props.expense?.id}
          receiptUrl={receiptUrl}
          setFileName={setFileName}
          setFileType={setFileType}
          setReceiptUrl={setReceiptUrl}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-2">
          <CheckboxField
            className="mt-7"
            id="radiativeFactor"
            checked={radiativeFactor}
            onChange={(e) => setRadiativeFactor(e.target.checked)}
            name="radiativeFactor"
          />
          <Label name="radiativeFactor" className="rw-label">
            Include radiative forcing in calculation
          </Label>
        </div>
      </div>

      <div className="my-6 grid grid-cols-1">
        <Button type="submit" variant="default" className="w-full">
          Save
        </Button>
      </div>
    </Form>
  )
}

import { FC, useState } from 'react'

import type { EditExpenseById, CreateExpenseInput } from 'types/graphql'

import {
  Controller,
  FieldError,
  Label,
  TextField,
  NumberField,
  RWGqlError,
  Form,
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

import { CommonFields } from './CommonFields'
import {
  CURRENCIES_OF_COUTRIES,
  FUEL_TYPE_LIST,
  FUEL_FACTORS_DATA,
} from './constants'
import { getCurrencyConversionRate } from './service'
import UploadReciepts from './UploadReciepts'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface FuelExpenseFormValues {
  date: Date | string
  fuelType: string
  tripId: number
  amount: number
  fuelAmountLiters: number
  currency: string
  nokAmount: number
  exchangeRate: number
  description: string
  merchant: string
}

interface FuelExpenseProps {
  onSave: (data: CreateExpenseInput, id?: number) => void
  expense?: FormExpense
  trips: { id: number; name: string }[]
  error?: RWGqlError
}

export const FuelExpense: FC<FuelExpenseProps> = ({
  expense,
  trips,
  onSave,
}) => {
  const formMethods = useForm<FuelExpenseFormValues>({
    defaultValues: {
      fuelType: expense?.fuelType || FUEL_TYPE_LIST[0].value,
      fuelAmountLiters: expense?.fuelAmountLiters,
      amount: expense?.amount,
      currency: expense?.currency || 'NOK',
      exchangeRate: expense?.exchangeRate || 1,
      nokAmount: expense?.nokAmount || 0,
      merchant: expense?.merchant || '',
      date: expense?.date ? new Date(expense.date) : new Date(),
      tripId: expense?.tripId || (trips.length > 0 ? trips[0].id : 0),
      description: expense?.description || '',
    },
  })

  const date = new Date()

  const [exchangeRate, setExchangeRate] = useState(expense?.exchangeRate || 1)

  const [selectedDate, setSelectedDate] = useState(date)

  const [fileName, setFileName] = useState(expense?.receipt?.fileName || '')

  const [fileType, setFileType] = useState(expense?.receipt?.fileType || '')

  const [receiptUrl, setReceiptUrl] = useState(expense?.receipt?.url || '')

  const onCurrencyChange = async (value: string) => {
    const newExchangeRate = await getCurrencyConversionRate(value, selectedDate)
    const currentAmount = formMethods.getValues('amount')

    // Batch the form updates
    formMethods.setValue('currency', value)
    formMethods.setValue('exchangeRate', newExchangeRate)

    if (currentAmount) {
      const nokAmount = currentAmount * newExchangeRate
      formMethods.setValue('nokAmount', parseFloat(nokAmount.toFixed(2)))
    }

    // Update local state if needed for UI purposes
    setExchangeRate(newExchangeRate)
  }

  const getEmission = async (data: {
    fuelType: string
    fuelAmountLiters: number
  }) => {
    console.log(data)

    const emissionFactor = FUEL_FACTORS_DATA[data.fuelType]
    console.log(emissionFactor)
    const scope1Co2Emissions = emissionFactor.scope1 * data.fuelAmountLiters
    const scope3Co2Emissions = emissionFactor.scope3 * data.fuelAmountLiters
    const kwh = emissionFactor.kwh * data.fuelAmountLiters

    return {
      scope1Co2Emissions,
      scope2Co2Emissions: 0,
      scope3Co2Emissions,
      kwh,
    }
  }

  const onSubmit = async (data: FuelExpenseFormValues) => {
    const {
      date,
      fuelType,
      tripId,
      amount,
      fuelAmountLiters,
      currency,
      nokAmount,
      exchangeRate,
      description,
      merchant,
    } = data

    // Ensure we have a valid date string
    const formattedDate =
      date instanceof Date ? date.toISOString() : new Date(date).toISOString()

    const receipt = receiptUrl
      ? {
          url: receiptUrl,
          fileName: fileName!,
          fileType: fileType!,
        }
      : undefined

    const emission = await getEmission(data)

    const dataWithReceipt: CreateExpenseInput = {
      date: formattedDate,
      tripId: Number(tripId),
      amount,
      currency,
      nokAmount,
      exchangeRate,
      categoryId: 3,
      fuelAmountLiters,
      fuelType,
      kilometers: 0.0,
      kwh: 0,
      description,
      merchant,
      scope3CategoryId: 6,
      ...emission,
      receipt,
    }

    onSave(dataWithReceipt, expense?.id)
  }
  return (
    <Form<FuelExpenseFormValues> formMethods={formMethods} onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 sm:gap-x-4">
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
                  // formMethods.setValue('economy', VEHICLE_ECONOMY[value])
                }}
                value={field.value?.toString()}
                defaultValue={FUEL_TYPE_LIST[0].value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type ..." />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPE_LIST.map((fuel, index) => (
                    <SelectItem key={index + 100} value={fuel.value}>
                      {fuel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError name="fuelType" className="rw-field-error" />
        </div>
        <div>
          <Label
            name="fuelAmountLiters"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Liters
          </Label>
          <div className="relative flex items-center">
            <NumberField
              name="fuelAmountLiters"
              className="rw-input flex-1"
              placeholder="Liters"
              step="0.01"
              validation={{
                valueAsNumber: true,
                required: true,
              }}
              onChange={(e) => {
                const value = Number(e.target.value)
                formMethods.setValue('fuelAmountLiters', value)
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-muted-foreground">
              Liters
            </span>
          </div>
          <FieldError name="fuelAmountLiters" className="rw-field-error" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 lg:grid-cols-4">
        <div>
          <Label
            name="amount"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Amount
          </Label>
          <NumberField
            name="amount"
            placeholder="0.00"
            className="rw-input"
            step="0.01"
            onChange={(e) => {
              const value = Number(e.target.value)
              formMethods.setValue('amount', value)

              if (value > 0) {
                const nokAmount = (value * exchangeRate).toFixed(2)
                formMethods.setValue('nokAmount', parseFloat(nokAmount))
              }
            }}
            errorClassName="rw-input rw-input-error"
            validation={{
              valueAsNumber: true,
              required: true,
            }}
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
            // defaultValue={expense?.currency}
            rules={{ required: true }}
            render={({ field }) => (
              <Combobox
                Data={CURRENCIES_OF_COUTRIES}
                defaultValue={expense?.currency}
                defaultText="Norwegian Krone"
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
            defaultValue={expense?.exchangeRate}
            validation={{
              valueAsNumber: true,
            }}
            onChange={(event) => {
              // First replace commas with periods for decimal handling
              let value = event.target.value.replace(',', '.')
              // Then remove any non-numeric characters except the decimal point
              value = value.replace(/[^0-9.]/g, '')

              // Ensure we don't have multiple decimal points
              const parts = value.split('.')
              if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('')
              }

              // Update the input field with the cleaned value
              event.target.value = value

              // Convert to number only if we have a valid value
              const numericRate = value ? parseFloat(value) : 0

              setExchangeRate(numericRate)
              formMethods.setValue('exchangeRate', numericRate)

              const amount = formMethods.getValues('amount')
              if (amount && numericRate) {
                const nokAmount = amount * numericRate
                formMethods.setValue(
                  'nokAmount',
                  parseFloat(nokAmount.toFixed(2))
                )
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
            // defaultValue={expense?.nokAmount ? Number(expense.nokAmount) : 0}
            className="rw-input rw-input-disabled"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />
          <FieldError name="nokAmount" className="rw-field-error" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-2">
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
            //defaultValue={expense?.supplier}
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
            defaultValue={formMethods.getValues('date')}
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

      <CommonFields<FuelExpenseFormValues>
        trips={trips}
        tripId={expense?.tripId}
        description={expense?.description}
        formMethods={formMethods}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UploadReciepts
          fileName={fileName}
          fileType={fileType}
          id={expense?.id}
          receiptUrl={receiptUrl}
          setFileName={setFileName}
          setFileType={setFileType}
          setReceiptUrl={setReceiptUrl}
        />
        <Button type="submit" variant="default" className="w-full">
          Save
        </Button>
      </div>
    </Form>
  )
}

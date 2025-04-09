import { FC, useState } from 'react'

import type { EditExpenseById, CreateExpenseInput } from 'types/graphql'

import {
  Controller,
  FieldError,
  Label,
  TextField,
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
import { CURRENCIES_OF_COUTRIES, FUEL_TYPE_LIST, FUEL_FACTORS_DATA } from './constants'
import { getCurrencyConversionRate } from './service'
import UploadReciepts from './UploadReciepts'

type FormExpense = NonNullable<EditExpenseById['expense']>

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
  const formMethods = useForm({
    defaultValues: {
      fuelType: expense?.fuelType || FUEL_TYPE_LIST[0].value,
      fuelAmountLiters: expense?.fuelAmountLiters || 0,
      amount: expense?.amount || 0,
      currency: expense?.currency || 'NOK',
      exchangeRate: expense?.exchangeRate || 1,
      nokAmount: expense?.nokAmount || 0,
      // ... other form fields ...
    }
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
      const nokAmount = (currentAmount * newExchangeRate)
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

    let emissionFactor = FUEL_FACTORS_DATA[data.fuelType]
    console.log(emissionFactor)
    let scope1Co2Emissions = emissionFactor.scope1 * data.fuelAmountLiters
    let scope3Co2Emissions = emissionFactor.scope3 * data.fuelAmountLiters
    let kwh = emissionFactor.kwh * data.fuelAmountLiters

    return {
      scope1Co2Emissions,
      scope2Co2Emissions: 0,
      scope3Co2Emissions,
      kwh
    }
  }

  const onSubmit = async (data: {
    date: Date
    fuelType: string
    tripId: number
    amount: number
    fuelAmountLiters: number
    currency: string
    nokAmount: number
    exchangeRate: number
    description: string
  }) => {
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
    } = data

    const receipt = receiptUrl
      ? {
          url: receiptUrl,
          fileName: fileName!,
          fileType: fileType!,
        }
      : undefined

    const emission = await getEmission(data)

    const dataWithReceipt: CreateExpenseInput = {
      date: date.toISOString(),
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
      scope3CategoryId: 6,
      ...emission,
      receipt,
    }

    // format the data before sending it to the server

    //const formattedData = formatData(dataWithReceipt)

    onSave(dataWithReceipt, expense?.id)

    //console.log(dataWithReceipt)
  }
  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      <div className=" grid grid-cols-2 gap-3 sm:gap-4">
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
            <TextField
              name="fuelAmountLiters"
              defaultValue={expense?.fuelAmountLiters ? expense.fuelAmountLiters : 0}
              className="rw-input flex-1"
              validation={{
                valueAsNumber: true,
                required: true,
                //min: 1,
              }}
              onChange={(e) => {
                // First replace commas with periods for decimal handling
                let value = e.target.value.replace(',', '.')
                // Then remove any non-numeric characters except the decimal point
                value = value.replace(/[^0-9.]/g, '')

                // Ensure we don't have multiple decimal points
                const parts = value.split('.')
                if (parts.length > 2) {
                  value = parts[0] + '.' + parts.slice(1).join('')
                }

                // Update the input field with the cleaned value
                e.target.value = value

                // Convert to number only if we have a valid value
                formMethods.setValue('fuelAmountLiters', value ? parseFloat(value) : 0)
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-muted-foreground">
              Liters
            </span>
          </div>
          <FieldError name="fuelAmountLiters" className="rw-field-error" />
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
            defaultValue={expense?.amount || 0}
            className="rw-input"
            onChange={(e) => {
              // First replace commas with periods for decimal handling
              let value = e.target.value.replace(',', '.')
              // Then remove any non-numeric characters except the decimal point
              value = value.replace(/[^0-9.]/g, '')

              // Ensure we don't have multiple decimal points
              const parts = value.split('.')
              if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('')
              }

              // Update the input field with the cleaned value
              e.target.value = value

              // Convert to number only if we have a valid value
              const numericValue = value ? parseFloat(value) : 0

              // Update the form value
              formMethods.setValue('amount', numericValue)

              // Calculate NOK amount if we have a valid number
              if (numericValue > 0) {
                const nokAmount = (numericValue * exchangeRate).toFixed(2)
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
            defaultValue={expense?.currency}
            rules={{ required: true }}
            render={({ field }) => (
              <Combobox
                Data={CURRENCIES_OF_COUTRIES}
                defaultValue={expense?.currency}
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
                formMethods.setValue('nokAmount', parseFloat(nokAmount.toFixed(2)))
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
            defaultValue={expense?.nokAmount ? Number(expense.nokAmount) : 0}
            className="rw-input rw-input-disabled"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />
          <FieldError name="nokAmount" className="rw-field-error" />
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
              setSelectedDate(date)
            }}
            className="rw-input-calendar"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />

          <FieldError name="date" className="rw-field-error" />
        </div>
      </div>

      <CommonFields
        trips={trips}
        tripId={expense?.tripId}
        description={expense?.description}
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

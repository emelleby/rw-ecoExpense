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
import { CURRENCIES_OF_COUTRIES, FUEL_TYPE_LIST } from './constants'
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
  const formMethods = useForm()

  const date = new Date()

  const [exchangeRate, setExchangeRate] = useState(expense?.exchangeRate || 1)

  const [selectedDate, setSelectedDate] = useState(date)

  const [fileName, setFileName] = useState(expense?.receipt?.fileName || '')

  const [fileType, setFileType] = useState(expense?.receipt?.fileType || '')

  const [receiptUrl, setReceiptUrl] = useState(expense?.receipt?.url || '')

  const onCurrencyChange = async (value: string) => {
    const exchangeRate = await getCurrencyConversionRate(value, selectedDate)
    setExchangeRate(exchangeRate)
    formMethods.setValue('exchangeRate', exchangeRate)
    const amount = formMethods.getValues('amount')

    if (amount) {
      const nokAmount = (amount * exchangeRate).toFixed(2)
      formMethods.setValue('nokAmount', parseFloat(nokAmount))
    }
  }

  const getEmission = async (_data: {
    fuelType: string
    kilometers: number
  }) => {
    // Since we're not using the parameters yet, prefix with underscore
    // to indicate it's intentionally unused
    return {
      scope1Co2Emissions: 0,
      scope2Co2Emissions: 0,
      scope3Co2Emissions: 0,
    }
  }

  const onSubmit = async (data: {
    date: Date
    fuelType: string
    tripId: number
    amount: number
    kilometers: number
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
      kilometers,
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
      date: date.toISOString(), // Convert Date to ISO string
      tripId,
      amount,
      currency,
      nokAmount,
      exchangeRate,
      categoryId: 3,
      fuelAmountLiters: 0.0,
      fuelType,
      kilometers,
      kwh: 0,
      description,
      scope3CategoryId: 6,
      ...emission,
      receipt, // Changed from 'receipt' to 'Receipt'
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
                  {FUEL_TYPE_LIST.map((feul, index) => (
                    <SelectItem key={index + 100} value={feul.value}>
                      {feul.label}
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
            name="kilometers"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Distance
          </Label>
          <div className="relative flex items-center">
            <TextField
              name="kilometers"
              defaultValue={expense?.kilometers ? expense.kilometers : 0}
              className="rw-input flex-1"
              validation={{
                valueAsNumber: true,
                required: true,
                //min: 1,
              }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '')
                e.target.value = value
                formMethods.setValue('kilometers', value ? parseInt(value) : '')
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-muted-foreground">
              KM
            </span>
          </div>
          <FieldError name="kilometers" className="rw-field-error" />
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

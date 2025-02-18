import { useEffect, useState } from 'react'

import type { EditExpenseById, CreateExpenseInput } from 'types/graphql'

import {
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

import { CommonFields } from './CommonFields'
import {
  ACCOMODATIONTYPES,
  COUNTRY_EMISSIONS,
  COUNTRY_NAMES,
  CURRENCIES_OF_COUTRIES,
} from './constants'
import { getCurrencyConversionRate } from './service'
import UploadReciepts from './UploadReciepts'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface AccommodationProps {
  trips: { id: number; name: string }[]
  expense?: FormExpense
  error?: RWGqlError
  loading?: boolean
  onSave: (data: CreateExpenseInput, id?: number) => void
}

export const Accommodation = ({
  trips,
  expense,
  onSave,
}: AccommodationProps) => {
  const date = new Date()
  const formMethods = useForm()

  const [exchangeRate, setExchangeRate] = useState(expense?.exchangeRate || 1)

  const [fileName, setFileName] = useState(expense?.receipt?.fileName || '')

  const [fileType, setFileType] = useState(expense?.receipt?.fileType || '')

  const [receiptUrl, setReceiptUrl] = useState(expense?.receipt?.url || '')

  const [selectedDate, setSelectedDate] = useState(date)

  const onCurrencyChange = async (value: string) => {
    const newExchangeRate = await getCurrencyConversionRate(value, selectedDate)
    setExchangeRate(newExchangeRate)
    formMethods.setValue('exchangeRate', newExchangeRate)
    const amount = formMethods.getValues('amount')

    if (amount) {
      const nokAmount = (amount * newExchangeRate).toFixed(2)
      formMethods.setValue('nokAmount', parseFloat(nokAmount))
    }
  }

  const getEmission = async (data: {
    nights: number
    numberOfPeople: number
    country: string
  }) => {
    const { nights, numberOfPeople, country } = data

    return {
      scope1Co2Emissions: 0,
      scope2Co2Emissions: 0,
      scope3Co2Emissions: nights * numberOfPeople * COUNTRY_EMISSIONS[country],
    }
  }

  const onSubmit = async (data) => {
    // Construct the receipt object
    //console.log('Receipt data submitted:', { receiptUrl, fileName, fileType }

    const {
      date,
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
      tripId: Number(tripId),
      amount,
      currency,
      nokAmount,
      exchangeRate,
      categoryId: 1,
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
    onSave(dataWithReceipt, expense?.id)

    //console.log(dataWithReceipt)
  }

  useEffect(() => {
    async function fetchExchangeRate() {
      const newExchangeRate = await getCurrencyConversionRate(
        expense?.currency,
        selectedDate
      )
      formMethods.setValue('exchangeRate', newExchangeRate)
      setExchangeRate(newExchangeRate)
    }
    if (expense?.currency) {
      fetchExchangeRate()
    } else {
      formMethods.setValue('exchangeRate', 0)
    }
  }, [selectedDate, expense?.currency, formMethods])

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
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

      <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-2">
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
            defaultValue={''}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            // validation={{ valueAsNumber: false }}
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
      <div className="grid grid-cols-2 gap-x-4 lg:grid-cols-4">
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

      <CommonFields
        trips={trips}
        tripId={expense?.tripId}
        description={expense?.description}
      />

      <div className="mt-6 grid grid-cols-1 gap-4">
        <UploadReciepts
          fileName={fileName}
          fileType={fileType}
          id={expense?.id}
          receiptUrl={receiptUrl}
          setFileName={setFileName}
          setFileType={setFileType}
          setReceiptUrl={setReceiptUrl}
        />
      </div>

      <div className="my-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Button type="submit" variant="default" className="w-full">
          Save
        </Button>
      </div>
    </Form>
  )
}

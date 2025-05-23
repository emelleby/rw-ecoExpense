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
// import { cn } from 'src/utils/cn'

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
  const formMethods = useForm({
    defaultValues: {
      merchant: expense?.merchant || '',
      date: expense?.date ? new Date(expense.date) : new Date(),
      amount: expense?.amount || undefined,
      currency: expense?.currency || 'NOK',
      exchangeRate: expense?.exchangeRate || 1,
      nokAmount: expense?.nokAmount || 0,
    },
  })

  const [exchangeRate, setExchangeRate] = useState(expense?.exchangeRate || 1)
  const [fileName, setFileName] = useState(expense?.receipt?.fileName || '')
  const [fileType, setFileType] = useState(expense?.receipt?.fileType || '')
  const [receiptUrl, setReceiptUrl] = useState(expense?.receipt?.url || '')
  const [selectedDate, setSelectedDate] = useState(
    formMethods.getValues('date')
  )

  const onCurrencyChange = async (value: string) => {
    try {
      const exchangeRate = await getCurrencyConversionRate(value, selectedDate)
      if (exchangeRate === 0) {
        formMethods.setError('exchangeRate', {
          type: 'manual',
          message: 'Failed to fetch exchange rate. Please enter manually.',
        })
      } else {
        formMethods.clearErrors('exchangeRate')
        setExchangeRate(exchangeRate)
        formMethods.setValue('exchangeRate', exchangeRate)
        const amount = formMethods.getValues('amount')

        if (amount) {
          const nokAmount = (amount * exchangeRate).toFixed(2)
          formMethods.setValue('nokAmount', parseFloat(nokAmount))
        }
      }
    } catch (error) {
      formMethods.setError('exchangeRate', {
        type: 'manual',
        message: `Failed to fetch exchange rate: ${error.message}. Please enter manually.`,
      })
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
    const {
      date,
      tripId,
      amount,
      currency,
      nokAmount,
      exchangeRate,
      description,
      merchant,
      nights,
      numberOfPeople,
      country,
    } = data

    // Ensure proper date formatting
    const formattedDate =
      date instanceof Date ? date.toISOString() : new Date(date).toISOString()

    const receipt = receiptUrl
      ? {
          url: receiptUrl,
          fileName: fileName!,
          fileType: fileType!,
        }
      : undefined

    const emission = await getEmission({ nights, numberOfPeople, country })

    const dataWithReceipt = {
      date: formattedDate,
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
      merchant,
      scope3CategoryId: 6,
      ...emission,
      receipt,
    }

    onSave(dataWithReceipt, expense?.id)
  }

  useEffect(() => {
    async function fetchExchangeRate() {
      const currency = formMethods.getValues('currency')
      if (currency) {
        const newExchangeRate = await getCurrencyConversionRate(
          currency,
          selectedDate
        )
        formMethods.setValue('exchangeRate', newExchangeRate)
        setExchangeRate(newExchangeRate)
      }
    }
    fetchExchangeRate()
  }, [selectedDate, formMethods])

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
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={ACCOMODATIONTYPES[0]}
              >
                <SelectTrigger data-testid="accommodation-type-trigger">
                  <SelectValue placeholder="Select accommodation type..." />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMODATIONTYPES.map((accommodation, index) => (
                    <SelectItem
                      key={index}
                      value={accommodation}
                      data-testid={`accommodation-option-${accommodation}`}
                    >
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
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={COUNTRY_NAMES[0]}
              >
                <SelectTrigger data-testid="country-trigger">
                  <SelectValue placeholder="Select country..." />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_NAMES.map((country, index) => (
                    <SelectItem
                      key={index}
                      value={country}
                      data-testid={`country-option-${country}`}
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError name="country" className="rw-field-error" />
        </div>

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
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
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
            data-testid="amount-input"
            placeholder="0"
            defaultValue={expense?.amount || undefined}
            className="rw-input"
            step="1.00"
            onChange={(e) => {
              const value = Number(e.target.value)
              const nokAmount = (value * exchangeRate).toFixed(2)
              formMethods.setValue('nokAmount', parseFloat(nokAmount))
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
                data-testid="currency-select"
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
          <NumberField
            name="exchangeRate"
            data-testid="exchange-rate-input"
            placeholder="0"
            defaultValue={expense?.exchangeRate || undefined}
            className="rw-input"
            step="0.0001"
            onChange={(e) => {
              const value = Number(e.target.value)
              setExchangeRate(value)
              formMethods.setValue('exchangeRate', value)
              formMethods.clearErrors('exchangeRate')

              const amount = formMethods.getValues('amount')
              if (amount) {
                const nokAmount = amount * value
                formMethods.setValue(
                  'nokAmount',
                  parseFloat(nokAmount.toFixed(2))
                )
              }
            }}
            errorClassName="rw-input rw-input-error"
            validation={{
              valueAsNumber: true,
              required: true,
              validate: (value) =>
                value > 0 || 'Exchange rate must be greater than 0',
            }}
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
            data-testid="nok-amount-input"
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

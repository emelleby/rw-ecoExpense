import { FC, useEffect, useState } from 'react'

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
import { Combobox } from 'src/components/ui/combobox'

import { CommonFields } from './CommonFields'
import {
  CURRENCIES_OF_COUTRIES,
  decimalField,
  parseDecimal,
  TRAVEL_DISTANCE_FACTORS,
} from './constants'
import SaveButton from './SaveButton'
import { getCurrencyConversionRate } from './service'
import UploadReciepts from './UploadReciepts'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void
  expense?: FormExpense
  trips: { id: number; name: string }[]
  error: RWGqlError
  loading?: boolean
  categoryId: number
  name: string
}

export const PublicTransport: FC<ExpenseFormProps> = (
  props: ExpenseFormProps
) => {
  const date = new Date()

  const formMethods = useForm({
    defaultValues: {
      currency: props.expense?.currency || 'NOK',
      exchangeRate: props.expense?.exchangeRate || 1,
    },
  })

  const [fileName, setFileName] = useState(
    props.expense?.receipt?.fileName || ''
  )
  const [fileType, setFileType] = useState(
    props.expense?.receipt?.fileType || ''
  )
  const [receiptUrl, setReceiptUrl] = useState(
    props.expense?.receipt?.url || ''
  )
  const [exchangeRate, setExchangeRate] = useState(
    props.expense?.exchangeRate || 1
  )
  const [selectedDate, setSelectedDate] = useState(date)

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
    } catch {
      formMethods.setError('exchangeRate', {
        type: 'manual',
        message: 'Failed to fetch exchange rate. Please enter manually.',
      })
    }
  }

  const getEmission = async (data) => {
    const { kilometers } = data
    const factor = TRAVEL_DISTANCE_FACTORS[props.name] || 0
    const emission = factor * Number(kilometers || 0)

    return {
      scope1Co2Emissions: 0,
      scope2Co2Emissions: 0,
      scope3Co2Emissions: Number(emission.toFixed(2)),
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
      kilometers,
    } = data

    const receipt = receiptUrl
      ? { url: receiptUrl, fileName: fileName!, fileType: fileType! }
      : undefined

    const emission = await getEmission(data)

    const dataWithReceipt = {
      date,
      tripId: Number(tripId),
      amount,
      currency,
      nokAmount,
      exchangeRate,
      categoryId: props.categoryId,
      fuelAmountLiters: 0.0,
      fuelType: '',
      kilometers: Number(kilometers || 0),
      kwh: 0,
      description,
      merchant,
      scope3CategoryId: 6,
      ...emission,
      receipt,
    }

    props.onSave(dataWithReceipt, props?.expense?.id)
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
      // ponytail: no expense = new form, defaults to NOK which is 1:1 to NOK
      formMethods.setValue('exchangeRate', 1)
    }
  }, [selectedDate, formMethods, props.expense?.currency])

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-x-4">
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
            onChange={(date) => setSelectedDate(date)}
            className="rw-input-calendar"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />

          <FieldError name="date" className="rw-field-error" />
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
            <NumberField
              name="kilometers"
              defaultValue={props.expense?.kilometers || undefined}
              placeholder="0"
              className="rw-input flex-1 pr-16"
              validation={{ required: true, min: 0 }}
            />
            <span className="absolute right-2 mt-1 text-sm text-muted-foreground">
              Km
            </span>
          </div>
          <FieldError name="kilometers" className="rw-field-error" />
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
            placeholder="0"
            inputMode="decimal"
            defaultValue={props?.expense?.amount || undefined}
            className="rw-input"
            onChange={(e) => {
              const value = parseDecimal(e.target.value)
              const nokAmount = ((value ?? 0) * exchangeRate).toFixed(2)
              formMethods.setValue('nokAmount', parseFloat(nokAmount))
            }}
            errorClassName="rw-input rw-input-error"
            validation={{ required: true, ...decimalField }}
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
                defaultValue={props.expense?.currency || 'NOK'}
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
            validation={{ valueAsNumber: true }}
            onChange={(event) => {
              const newExchangeRate = event.target.value.replace(/[^0-9.]/g, '')
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

      <div className="grid grid-cols-1">
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
            defaultValue={props.expense?.merchant || ''}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: false }}
          />
          <FieldError name="merchant" className="rw-field-error" />
        </div>
      </div>

      <CommonFields
        trips={props.trips}
        tripId={props.expense?.tripId}
        description={props.expense?.description}
        formMethods={formMethods}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UploadReciepts
          fileName={fileName}
          fileType={fileType}
          id={props.expense?.id}
          receiptUrl={receiptUrl}
          setFileName={setFileName}
          setFileType={setFileType}
          setReceiptUrl={setReceiptUrl}
        />
        <SaveButton
          saving={props.loading || formMethods.formState.isSubmitting}
        />
      </div>
    </Form>
  )
}

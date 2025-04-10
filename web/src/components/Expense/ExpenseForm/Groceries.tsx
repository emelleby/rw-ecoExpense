import { FC, useEffect, useState } from 'react'

import type { EditExpenseById, CreateExpenseInput } from 'types/graphql'

import {
  Controller,
  FieldError,
  NumberField,
  Form,
  Label,
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
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/Select'

import { CommonFields } from './CommonFields'
import { BUCKET_TYPES, CURRENCIES_OF_COUTRIES } from './constants'
import { getCurrencyConversionRate } from './service'
import UploadReciepts from './UploadReciepts'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void // Accept CreateExpenseInput directly
  expense?: FormExpense
  trips: { id: number; name: string }[]
  error: RWGqlError
}

export const Groceries: FC<ExpenseFormProps> = (props: ExpenseFormProps) => {
  const date = new Date()

  const formMethods = useForm()

  //const { showLoader, hideLoader } = useLoader()

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
    } catch (error) {
      formMethods.setError('exchangeRate', {
        type: 'manual',
        message: `Failed to fetch exchange rate: ${error.message}. Please enter manually.`,
      })
    }
  }

  const getEmission = async (data) => {
    const { nokAmount, bucketFactor } = data

    const emission = Number(bucketFactor) * (nokAmount / 1000)

    return {
      scope1Co2Emissions: 0,
      scope2Co2Emissions: 0,
      scope3Co2Emissions: Number(emission.toFixed(2)),
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
      categoryId: 5,
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
      const currency =
        formMethods.getValues('currency') || props.expense?.currency
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
  }, [selectedDate, formMethods, props.expense?.currency])

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      <div className=" grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <div>
          <Label
            name="bucketFactor"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            Basket Type
          </Label>

          <Controller
            name="bucketFactor"
            defaultValue={BUCKET_TYPES[0].value.toString()}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  // formMethods.setValue('economy', VEHICLE_ECONOMY[value])
                }}
                value={field.value}
                defaultValue={BUCKET_TYPES[0].value.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type ..." />
                </SelectTrigger>
                <SelectContent>
                  {BUCKET_TYPES.map((bucket) => (
                    <SelectItem
                      key={bucket.value}
                      value={bucket.value.toString()}
                    >
                      {bucket.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError name="purchaceType" className="rw-field-error" />
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
            validation={{ valueAsNumber: false }}
          />
          <FieldError name="merchant" className="rw-field-error" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 xl:grid-cols-4">
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
            placeholder="0"
            defaultValue={props?.expense?.amount || undefined}
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
          <NumberField
            name="exchangeRate"
            placeholder="0"
            defaultValue={props.expense?.exchangeRate || undefined}
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
        <Button type="submit" variant="default" className="w-full">
          Save
        </Button>
      </div>
    </Form>
  )
}

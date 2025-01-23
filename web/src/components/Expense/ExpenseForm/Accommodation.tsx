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
  Form,
  Label,
  NumberField,
  RWGqlError,
  TextField,
  useForm,
} from '@redwoodjs/forms'

import DatetimeLocalField from 'src/components/Custom/DatePicker'
import { Button } from 'src/components/ui/button'
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
  //CURRENCIES,
  //EXCHANGE_RATES,
} from './constants'
import { getCurrencyConversionRate } from './service'
import UploadReciepts from './UploadReciepts'

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

  const formMethods = useForm()

  const [exchangeRate, setExchangeRate] = useState(
    props.expense?.exchangeRate || 1
  )

  const [fileName, setFileName] = useState(
    props.expense?.receipt?.fileName || ''
  )

  const [fileType, setFileType] = useState(
    props.expense?.receipt?.fileType || ''
  )

  const [receiptUrl, setReceiptUrl] = useState(
    props.expense?.receipt?.url || ''
  )

  const [selectedDate, setSelectedDate] = useState(date)

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
  }, [selectedDate])

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
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
              setSelectedDate(date)
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
            className="rw-input disabled:bg-slate-100"
            errorClassName="rw-input rw-input-error"
            validation={{ valueAsNumber: true, required: true }}
          />
          <FieldError name="nokAmount" className="rw-field-error" />
        </div>
      </div>

      <CommonFields
        projects={props.projects}
        trips={props.trips}
        tripId={props.expense?.tripId}
        description={props.expense?.description}
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

      <div className="my-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Button type="submit" variant="default" className="w-full">
          Save
        </Button>
      </div>
    </Form>
  )
}

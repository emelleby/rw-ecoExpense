import { FC, useEffect, useState } from 'react'

import type {
  EditExpenseById,
  CreateExpenseInput,
  FindSectors,
  FindSectorsVariables,
} from 'types/graphql'

import {
  Controller,
  FieldError,
  Form,
  Label,
  RWGqlError,
  TextField,
  NumberField,
  useForm,
} from '@redwoodjs/forms'
import { TypedDocumentNode, useQuery } from '@redwoodjs/web'

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

import { Loading } from '../EditExpenseCell'

import { CommonFields } from './CommonFields'
import { CURRENCIES_OF_COUTRIES } from './constants'
import { getCurrencyConversionRate } from './service'
import UploadReciepts from './UploadReciepts'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void // Accept CreateExpenseInput directly
  expense?: FormExpense
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  error: RWGqlError
}

const QUERY: TypedDocumentNode<FindSectors, FindSectorsVariables> = gql`
  query FindSectors {
    sectors {
      id
      name
      factor
      currency
    }
  }
`

export const Miscellaneous: FC<ExpenseFormProps> = (
  props: ExpenseFormProps
) => {
  const date = new Date()

  const formMethods = useForm()

  const { data: Sectors, loading } = useQuery(QUERY)

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
          formMethods.setValue('nokAmount', parseInt(nokAmount))
        }
      }
    } catch (error) {
      formMethods.setError('exchangeRate', {
        type: 'manual',
        message: 'Failed to fetch exchange rate. Please enter manually.',
      })
    }
  }

  const getSectorFactor = (sectorId: string): number => {
    const sector = Sectors?.sectors.find(
      (sector) => sector.id === Number(sectorId)
    )
    return sector?.factor || 0
  }

  const getEmission = async (data) => {
    const { amount, currency, nokAmount, sectorId } = data

    if (currency === 'EUR') {
      const emission = getSectorFactor(sectorId) * Number(amount)

      return {
        scope1Co2Emissions: 0,
        scope2Co2Emissions: 0,
        scope3Co2Emissions: Number(emission.toFixed(2)),
      }
    }

    const exchangeRate = await getCurrencyConversionRate('EUR', selectedDate)

    const emission =
      (getSectorFactor(sectorId) * Number(nokAmount)) / exchangeRate

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
      categoryId: 6,
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

  if (loading) return <Loading />

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      <div className=" grid grid-cols-1 gap-4">
        <div>
          <Label
            name="sectorId"
            className="rw-label mb-2"
            errorClassName="rw-label rw-label-error"
          >
            Purchace Type
          </Label>

          <Controller
            name="sectorId"
            defaultValue={Sectors.sectors[0].id}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  // formMethods.setValue('economy', VEHICLE_ECONOMY[value])
                }}
                value={field.value?.toString()}
                defaultValue={Sectors.sectors[0].id.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type ..." />
                </SelectTrigger>
                <SelectContent>
                  {Sectors.sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id.toString()}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError name="purchaceType" className="rw-field-error" />
        </div>
      </div>

      <div className="gap-x-7-4 grid grid-cols-1 lg:grid-cols-2">
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
        trips={props.trips}
        tripId={props.expense?.tripId}
        description={props.expense?.description}
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

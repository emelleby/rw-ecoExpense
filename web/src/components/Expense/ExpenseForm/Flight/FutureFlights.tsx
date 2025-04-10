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
import { useMutation } from '@redwoodjs/web'

import DatetimeLocalField from 'src/components/Custom/DatePicker'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/components/ui/Accordion'
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
import { AIRLINES, CURRENCIES_OF_COUTRIES, FLIGHT_CLASSES } from '../constants'
import { FlightEmissionResult, getCurrencyConversionRate } from '../service'
import UploadReciepts from '../UploadReciepts'

import FlightsTable from './FlightsTable'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void
  expense?: FormExpense
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  error: RWGqlError
}

const SUBMIT_FLIGHTS_MUTATION = gql`
  mutation SubmitFlightsMutation($input: [Flights]!) {
    submitFutureFlights(input: $input) {
      flight {
        origin
        destination
        operatingCarrierCode
        flightNumber
        class
        departureDate {
          year
          month
          day
        }
      }
      emissionsGramsPerPax {
        economy
        business
        first
        premiumEconomy
      }
    }
  }
`

export const FutureFlights: FC<ExpenseFormProps> = (
  props: ExpenseFormProps
) => {
  const [submitFlights] = useMutation(SUBMIT_FLIGHTS_MUTATION, {
    onCompleted: () => {
      //toast.success('Flight emissions calculated successfully')
    },
    onError: (error) => {
      console.log(error)
      // toast.error(error.message)
    },
  })

  const date = new Date()

  const formMethods = useForm()

  const [exchangeRate, setExchangeRate] = useState(
    props.expense?.exchangeRate || 0
  )

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

  const [flights, setFlights] = useState([])

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

  const getEmissionInKgs = (data: FlightEmissionResult[]): number => {
    const classes = flights.map((flight) => {
      return flight.class
    })

    classes.push(formMethods.getValues('flightClass'))

    const emission = data.reduce((acc, flight, i) => {
      const { emissionsGramsPerPax } = flight
      return acc + emissionsGramsPerPax[classes[i]]
    }, 0)

    return emission / 1000
  }

  const getEmission = async (data) => {
    const { to, from, airline, flightNumber, flightClass } = data

    const payload = {
      origin: from,
      destination: to,
      operatingCarrierCode: airline,
      flightNumber: flightNumber.toString(),
      class: flightClass || 'economy', // Ensure we always have a class value
      departureDate: selectedDate.toISOString().split('T')[0],
    }

    const dataToSend = [...flights, payload]

    const result = await submitFlights({
      variables: {
        input: [...dataToSend],
      },
    })

    if (result.data.submitFutureFlights) {
      const emission = getEmissionInKgs(result.data.submitFutureFlights)
      return {
        scope1Co2Emissions: 0,
        scope2Co2Emissions: 0,
        scope3Co2Emissions: emission,
      }
    }
    return {
      scope1Co2Emissions: 0,
      scope2Co2Emissions: 0,
      scope3Co2Emissions: 0,
    }
  }

  const onSubmit = async (data) => {
    const {
      date,
      projectId,
      tripId,
      amount,
      currency,
      nokAmount,
      exchangeRate,
      description,
      flightClass,
    } = data

    const receipt = receiptUrl
      ? {
          url: receiptUrl,
          fileName: fileName!,
          fileType: fileType!,
        }
      : undefined

    const emission = await getEmission({ ...data, flightClass })

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
      receipt,
    }

    props.onSave(dataWithReceipt, props?.expense?.id)
  }

  const handleDeleteFlight = (index: number) => {
    const newFlights = flights.filter((_, i) => i !== index)
    setFlights(newFlights)
  }

  const addAnotherFlight = () => {
    const from = formMethods.getValues('from')
    const to = formMethods.getValues('to')
    const airline = formMethods.getValues('airline')
    const flightNumber = formMethods.getValues('flightNumber')
    const flightClass = formMethods.getValues('flightClass')
    const dateStr = formMethods.getValues('date')

    if (!from || !to || !airline || !flightNumber || !flightClass || !dateStr) {
      formMethods.trigger([
        'from',
        'to',
        'airline',
        'flightNumber',
        'flightClass',
        'date',
      ])
      return
    }

    setFlights([
      ...flights,
      {
        origin: from,
        destination: to,
        operatingCarrierCode: airline,
        flightNumber: flightNumber.toString(),
        class: flightClass || 'economy', // Ensure we always have a class value
        departureDate: dateStr.split('T')[0], // Convert ISO string to YYYY-MM-DD
      },
    ])
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
    <>
      {flights.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="1">
            <AccordionTrigger>Flights</AccordionTrigger>
            <AccordionContent>
              <FlightsTable data={flights} handleDelete={handleDeleteFlight} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      <Form onSubmit={onSubmit} formMethods={formMethods}>
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
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
                  }}
                  placeholder="Departure Airport.."
                  value=""
                />
              )}
            />

            <FieldError name="from" className="rw-field-error" />
          </div>

          <div>
            <Label
              name="to"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              To
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
                  }}
                  placeholder="Select destination Airport..."
                  value=""
                />
              )}
            />

            <FieldError name="to" className="rw-field-error" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
          <div>
            <Label
              name="airline"
              className="rw-label mb-2"
              errorClassName="rw-label rw-label-error"
            >
              Airline
            </Label>

            <Controller
              name="airline"
              defaultValue={''}
              rules={{ required: true }}
              render={({ field }) => (
                <Combobox
                  Data={AIRLINES}
                  defaultValue={''}
                  defaultText="Select an Airline..."
                  isActive={true}
                  onChangeHandle={(value) => field.onChange(value)}
                />
              )}
            />

            <FieldError name="airline" className="rw-field-error" />
          </div>

          <div>
            <Label
              name="flightNumber"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Flight Number
            </Label>
            <TextField
              name="flightNumber"
              defaultValue={''}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
            />
            <FieldError name="flightNumber" className="rw-field-error" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
          <div>
            <Label
              name="flightClass"
              className="rw-label mb-2"
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

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
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

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-x-4">
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
                const newExchangeRate = event.target.value.replace(
                  /[^0-9.]/g,
                  ''
                )
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

          <Button
            variant="link"
            onClick={addAnotherFlight}
            className="font-normal underline"
          >
            Add another flight
          </Button>
        </div>

        <div className="my-6 grid grid-cols-1">
          <Button type="submit" variant="default" className="w-full">
            Save
          </Button>
        </div>
      </Form>
    </>
  )
}

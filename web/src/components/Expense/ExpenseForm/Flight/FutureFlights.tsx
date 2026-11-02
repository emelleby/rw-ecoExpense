import { FC, useEffect, useRef, useState } from 'react'

import { parse } from 'date-fns'
import { PlaneTakeoff, PlusIcon } from 'lucide-react'
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
import { toast } from '@redwoodjs/web/toast'

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

import AirportSelect from '../AirportSearch'
import { CommonFields } from '../CommonFields'
import {
  AIRLINES,
  CURRENCIES_OF_COUTRIES,
  decimalField,
  FLIGHT_CLASSES,
  parseDecimal,
} from '../constants'
import SaveButton from '../SaveButton'
import { FlightEmissionResult, getCurrencyConversionRate } from '../service'
import UploadReciepts from '../UploadReciepts'

import FlightsTable, { FlightSegment } from './FlightsTable'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void
  expense?: FormExpense
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  error: RWGqlError
  loading?: boolean
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

type FutureSegment = FlightSegment

const SEGMENT_FIELDS = ['from', 'to', 'airline', 'flightNumber'] as const

const SEGMENT_FIELD_MESSAGES: Record<(typeof SEGMENT_FIELDS)[number], string> =
  {
    from: 'Departure airport is required',
    to: 'Destination airport is required',
    airline: 'Airline is required',
    flightNumber: 'Flight number is required',
  }

interface FutureFlightDetails {
  mode: 'future'
  // Every segment, in order. On edit they all go back into the itinerary
  // list and the segment fields start empty.
  segments: FutureSegment[]
  passengers?: number
}

// Local calendar date as YYYY-MM-DD. toISOString() converts to UTC, which
// moves local-midnight dates (what the date picker yields) to the previous day.
const toLocalYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`

const ymdToIso = (day: string) =>
  parse(day, 'yyyy-MM-dd', new Date()).toISOString()

export const FutureFlights: FC<ExpenseFormProps> = (
  props: ExpenseFormProps
) => {
  // Only restore when the expense was saved as a future flight; a past-flight
  // expense (or a legacy one with no flightDetails) starts blank here.
  const stored = props.expense?.flightDetails as
    | { mode?: string }
    | null
    | undefined
  const saved: FutureFlightDetails | undefined =
    stored?.mode === 'future' ? (stored as FutureFlightDetails) : undefined
  const lastSegment = saved?.segments?.[saved.segments.length - 1]

  const initialDate = props.expense?.date
    ? new Date(props.expense.date)
    : new Date()

  const [submitFlights] = useMutation(SUBMIT_FLIGHTS_MUTATION, {
    onCompleted: (data) => {
      if (data?.submitFutureFlights?.length > 0) {
        toast.success('Flight emissions calculated successfully')
      }
    },
    onError: (error) => {
      console.error('Flight emission calculation error:', error)
      const errorMessage = error.message?.toLowerCase() || ''

      if (errorMessage.includes('api key')) {
        toast.error('System configuration error. Please contact support.')
      } else if (errorMessage.includes('no flight emissions data')) {
        toast.error(
          'Could not find this flight. Please check the flight number and date.'
        )
      } else if (errorMessage.includes('invalid input')) {
        toast.error('Please check your flight details and try again.')
      } else {
        toast.error(
          'Failed to calculate flight emissions. Please try again later.'
        )
      }
    },
  })

  const formMethods = useForm({
    defaultValues: {
      currency: props.expense?.currency || 'NOK',
      exchangeRate: props.expense?.exchangeRate || 1,
    },
  })

  const [exchangeRate, setExchangeRate] = useState(
    props.expense?.exchangeRate || 0
  )

  const [selectedDate, setSelectedDate] = useState(initialDate)

  const [fileName, setFileName] = useState(
    props.expense?.receipt?.fileName || ''
  )

  const [fileType, setFileType] = useState(
    props.expense?.receipt?.fileType || ''
  )

  const [receiptUrl, setReceiptUrl] = useState(
    props.expense?.receipt?.url || ''
  )

  const [flights, setFlights] = useState<FutureSegment[]>(saved?.segments ?? [])
  // Validation callbacks read the latest segments through this ref
  const flightsRef = useRef<FutureSegment[]>(flights)
  flightsRef.current = flights

  /** The user has typed something for a new segment beyond the pre-filled origin */
  const segmentStarted = () => {
    const { to, airline, flightNumber } = formMethods.getValues()
    return Boolean(to || airline || flightNumber)
  }

  /**
   * Segment fields are only required when no segments have been added yet,
   * or when the user has started filling in another one.
   */
  const segmentFieldRule =
    (field: (typeof SEGMENT_FIELDS)[number]) => (value: unknown) =>
      Boolean(value) ||
      (flightsRef.current.length > 0 && !segmentStarted()) ||
      SEGMENT_FIELD_MESSAGES[field]

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

  const buildSegment = (data): FutureSegment => ({
    origin: data.from,
    destination: data.to,
    operatingCarrierCode: data.airline,
    flightNumber: data.flightNumber.toString().trim(),
    class: data.flightClass || 'economy',
    departureDate: toLocalYMD(selectedDate),
  })

  // Returns the emissions, or null if they could not be calculated (an error
  // toast has been shown). Callers must NOT save in that case.
  const getEmission = async (segments: FutureSegment[], passengers: number) => {
    if (passengers < 1) {
      toast.error('Number of passengers must be at least 1')
      return null
    }

    // Compare calendar days: a flight today is still a valid "future" flight.
    const today = toLocalYMD(new Date())
    if (segments.some((s) => s.departureDate < today)) {
      toast.error(
        'This flight has already departed. Use the Past Flight tab instead.'
      )
      return null
    }

    try {
      const result = await submitFlights({ variables: { input: segments } })

      // On failure the mutation's onError has already shown a toast
      const results: FlightEmissionResult[] | undefined =
        result?.data?.submitFutureFlights
      if (!results?.length) return null

      let grams = 0
      for (let i = 0; i < segments.length; i++) {
        const g = results[i]?.emissionsGramsPerPax?.[segments[i].class]
        if (typeof g !== 'number') {
          toast.error('No emissions data available for this flight combination')
          return null
        }
        grams += g
      }

      return {
        scope1Co2Emissions: 0,
        scope2Co2Emissions: 0,
        // grams -> kg, per traveller
        scope3Co2Emissions: (grams / 1000) * passengers,
      }
    } catch (error) {
      console.error('Error calculating emissions:', error)
      toast.error('Failed to calculate flight emissions. Please try again.')
      return null
    }
  }

  const onSubmit = async (data) => {
    const {
      projectId,
      tripId,
      amount,
      currency,
      nokAmount,
      exchangeRate,
      description,
      merchant,
    } = data

    const receipt = receiptUrl
      ? {
          url: receiptUrl,
          fileName: fileName!,
          fileType: fileType!,
        }
      : undefined

    // Every added segment, plus the one in the form if the user filled it in
    const segments =
      flights.length === 0 || segmentStarted()
        ? [...flights, buildSegment(data)]
        : [...flights]
    const passengers = data.passengers || 1

    // Editing: if the flights and travellers are unchanged, keep the stored
    // emissions. Recalculating after the flight date would fail (the API only
    // has data for upcoming flights) and could change the recorded figure.
    const unchanged =
      props.expense &&
      saved &&
      JSON.stringify(saved.segments) === JSON.stringify(segments) &&
      (saved.passengers || 1) === passengers

    const emission = unchanged
      ? {
          scope1Co2Emissions: props.expense.scope1Co2Emissions,
          scope2Co2Emissions: props.expense.scope2Co2Emissions,
          scope3Co2Emissions: props.expense.scope3Co2Emissions,
        }
      : await getEmission(segments, passengers)

    // Could not calculate: stay on the form rather than saving zero emissions
    if (!emission) return

    const dataWithReceipt = {
      // The expense is dated by the first departure of the itinerary
      date: ymdToIso(segments[0].departureDate),
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
      merchant,
      scope3CategoryId: 6,
      ...emission,
      receipt,
      flightDetails: {
        mode: 'future',
        segments,
        passengers: data.passengers,
      } satisfies FutureFlightDetails,
    }

    props.onSave(dataWithReceipt, props?.expense?.id)
  }

  const handleDeleteFlight = (index: number) => {
    setFlights(flights.filter((_, i) => i !== index))
  }

  const addAnotherFlight = () => {
    const values = formMethods.getValues()
    const missing = SEGMENT_FIELDS.filter((field) => !values[field])

    if (missing.length > 0 || !values.date) {
      missing.forEach((field) =>
        formMethods.setError(field, {
          type: 'required',
          message: SEGMENT_FIELD_MESSAGES[field],
        })
      )
      if (!values.date) {
        formMethods.setError('date', {
          type: 'required',
          message: 'Departure date is required',
        })
      }
      toast.error('Fill in this flight before adding another segment')
      return
    }

    const segment = buildSegment(values)
    if (segment.departureDate < toLocalYMD(new Date())) {
      formMethods.setError('date', {
        type: 'validate',
        message: 'Departure date cannot be in the past',
      })
      return
    }

    setFlights([...flights, segment])

    // Clear what changes per segment. The next flight usually departs from
    // where this one lands; class and date are kept as a starting point.
    formMethods.setValue('from', segment.destination)
    formMethods.setValue('to', '')
    formMethods.setValue('airline', '')
    formMethods.setValue('flightNumber', '')
    formMethods.clearErrors([...SEGMENT_FIELDS, 'date'])

    toast.success(
      `Segment ${flights.length + 1} added: ${segment.origin} → ${segment.destination}`
    )
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
  }, [selectedDate])

  const segmentNumber = flights.length + 1

  // Live view of the segment card so the UI can say what Save will include
  const [draftFrom, draftTo, draftAirline, draftFlightNumber] =
    formMethods.watch(['from', 'to', 'airline', 'flightNumber'])
  const draftStarted = Boolean(draftTo || draftAirline || draftFlightNumber)
  // With no added segments the card is the flight; otherwise only if started
  const draftIncluded = flights.length === 0 || draftStarted
  const flightsOnSave = flights.length + (draftIncluded ? 1 : 0)
  const showDraftInList = flights.length > 0 && draftStarted

  return (
    <Form onSubmit={onSubmit} formMethods={formMethods}>
      {flights.length > 0 && (
        <section className="mb-4" aria-labelledby="itinerary-heading">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 id="itinerary-heading" className="text-base font-semibold">
              Your itinerary
            </h3>
            <span className="text-sm text-muted-foreground">
              {flights.length} added
              {showDraftInList && ' · 1 in progress'}
            </span>
          </div>
          <FlightsTable
            data={flights}
            handleDelete={handleDeleteFlight}
            draft={
              showDraftInList
                ? { origin: draftFrom, destination: draftTo }
                : null
            }
          />
        </section>
      )}

      <fieldset className="rounded-lg border-2 border-primary/40 p-4">
        <legend className="flex items-center gap-2 px-2 text-base font-semibold">
          <PlaneTakeoff className="h-4 w-4" />
          {flights.length === 0 ? 'Flight' : `Segment ${segmentNumber}`}
        </legend>

        {flights.length > 0 && !draftStarted && (
          <p className="mb-2 rounded-md bg-muted p-2 text-sm">
            <strong>Itinerary complete?</strong> Just save. This empty card is
            ignored. Otherwise fill in your next flight.
          </p>
        )}
        {draftStarted && (
          <p className="mb-2 rounded-md bg-muted p-2 text-sm">
            This flight is saved as <strong>segment {segmentNumber}</strong>{' '}
            when you press Save. Only press &ldquo;Add&rdquo; below if there is
            another flight after it.
          </p>
        )}

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
              defaultValue={flights[flights.length - 1]?.destination || ''}
              rules={{ validate: segmentFieldRule('from') }}
              render={({ field }) => (
                <AirportSelect
                  label=""
                  onChange={(value) => {
                    field.onChange(value)
                  }}
                  placeholder="Departure Airport.."
                  value={field.value}
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
              rules={{ validate: segmentFieldRule('to') }}
              render={({ field }) => (
                <AirportSelect
                  label=""
                  onChange={(value) => {
                    field.onChange(value)
                  }}
                  placeholder="Select destination Airport..."
                  value={field.value}
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
              rules={{ validate: segmentFieldRule('airline') }}
              render={({ field }) => (
                <Combobox
                  Data={AIRLINES}
                  defaultValue={''}
                  value={field.value}
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
              validation={{ validate: segmentFieldRule('flightNumber') }}
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
              defaultValue={lastSegment?.class || 'economy'}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value?.toString()}
                  defaultValue={lastSegment?.class || 'economy'}
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
              name="date"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Departure date
            </Label>

            <DatetimeLocalField
              name="date"
              defaultValue={initialDate}
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

        <Button
          variant="outline"
          onClick={addAnotherFlight}
          type="button"
          className="mt-4 w-full border-2 border-dashed border-primary font-semibold text-primary hover:bg-primary/10 hover:text-primary"
        >
          <PlusIcon className="h-4 w-4" />
          Add segment {segmentNumber} and enter another flight
        </Button>
      </fieldset>

      <section className="mt-6" aria-labelledby="expense-details-heading">
        <h3
          id="expense-details-heading"
          className="mb-1 text-base font-semibold"
        >
          Expense details
        </h3>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
          <div>
            <Label
              name="passengers"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              # Travelers (all segments)
            </Label>
            <NumberField
              name="passengers"
              defaultValue={saved?.passengers || 1}
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
              defaultValue={props?.expense?.amount}
              placeholder="amount"
              inputMode="decimal"
              className="rw-input"
              onChange={(e) => {
                const value = parseDecimal(e.target.value)
                if (value > 0) {
                  const nokAmount = (value * exchangeRate).toFixed(2)
                  formMethods.setValue('nokAmount', parseFloat(nokAmount))
                }
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

        <div className="mt-6">
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
      </section>

      <div className="my-6 grid grid-cols-1">
        <SaveButton
          saving={props.loading || formMethods.formState.isSubmitting}
          label={`Save expense (${flightsOnSave} flight${flightsOnSave === 1 ? '' : 's'})`}
        />
      </div>
    </Form>
  )
}

import { FC, useState } from 'react'

import type { EditExpenseById, CreateExpenseInput } from 'types/graphql'

import {
  Controller,
  FieldError,
  Label,
  //useFormContext,
  TextField,
  RWGqlError,
  useForm,
  Form,
} from '@redwoodjs/forms'

import DatetimeLocalField from 'src/components/Custom/DatePicker'
import { Button } from 'src/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from 'src/components/ui/Select'
//import { cn } from 'src/utils/cn'

import { CommonFields } from './CommonFields'
import { FUEL_FACTORS_DATA, FUEL_TYPE_LIST } from './constants'
import UploadReciepts from './UploadReciepts'

import { Switch } from '@/components/ui/Switch'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void
  expense?: FormExpense
  trips: { id: number; name: string }[]

  error: RWGqlError
}

export const CarDistanceBased: FC<ExpenseFormProps> = ({
  expense,
  trips,

  onSave,
}) => {
  // Set up form with all default values in one place
  interface CarDistanceFormValues {
    kilometers: number;
    fuelType: string;
    fuelConsumption: number;
    passengers: number;
    factor: number;
    nokAmount: number;
    trailer: boolean;
    date: Date;
    tripId: number;
    description: string;
  }

  const formMethods = useForm<CarDistanceFormValues>({
      defaultValues: {
        kilometers: expense?.kilometers || 0,
        fuelType: expense?.fuelType || FUEL_TYPE_LIST[0].value,
        fuelConsumption: expense?.fuelAmountLiters || 10,
        passengers: 0,
        factor: 3.5,
        nokAmount: expense?.nokAmount || 0,
        trailer: false,
        date: expense?.date ? new Date(expense.date) : new Date(),
        tripId: expense?.tripId,
        description: expense?.description || '',
      }
    });

  // Receipt state
  const [fileName, setFileName] = useState(expense?.receipt?.fileName || '');
  const [fileType, setFileType] = useState(expense?.receipt?.fileType || '');
  const [receiptUrl, setReceiptUrl] = useState(expense?.receipt?.url || '');

  // Create a helper function to access form values
  const getFormValue = (name: keyof CarDistanceFormValues) => formMethods.getValues(name);

  const handleUpdateDistanceOrFactor = () => {
    const distance = getFormValue('kilometers');
    let factor: number = Number(getFormValue('factor'));
    const passengers = getFormValue('passengers');

    // Add passenger adjustment to factor
    factor = Number(factor) + Number(passengers);

    if (distance && factor && Number(distance) > 0 && Number(factor) > 0) {
      const amount = Number(distance) * Number(factor);
      formMethods.setValue('nokAmount', parseFloat(amount.toFixed(2)));
    }
  };

  const getEmission = async (data: {
    kilometers: number;
    fuelType: string;
    fuelConsumption: number;
  }) => {
    const { kilometers, fuelType, fuelConsumption } = data

    const fuelConsumed = kilometers * fuelConsumption / 100

    let totalfactor = 0

    const scope1 = FUEL_FACTORS_DATA[fuelType].scope1
    const scope2 = FUEL_FACTORS_DATA[fuelType].scope2
    const scope3 = FUEL_FACTORS_DATA[fuelType].scope3

    const kwh = FUEL_FACTORS_DATA[fuelType].kwh * fuelConsumed
    // Sum the factors since it is all scope 3 emissions when it's a private car.
    totalfactor = (scope1 || 0) + (scope2 || 0) + (scope3 || 0)

    const scope3Co2Emissions = totalfactor * fuelConsumed

    return {
      scope1Co2Emissions: 0,
      scope2Co2Emissions: 0,
      scope3Co2Emissions: scope3Co2Emissions,
      kwh,
    }
  }

  const onSubmit = async (data: CarDistanceFormValues) => {
    // Construct the receipt object
    //console.log('Receipt data submitted:', { receiptUrl, fileName, fileType }

    const {
      date,
      kilometers,
      fuelType,
      fuelConsumption,
      tripId,
      nokAmount,
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
      date: date.toISOString(),
      tripId: Number(tripId),
      amount: nokAmount,
      currency: 'NOK',
      nokAmount,
      exchangeRate: 1,
      categoryId: 2,
      fuelAmountLiters: fuelConsumption,
      fuelType,
      kilometers,
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

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      <div className=" grid grid-cols-2 gap-4">
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
              defaultValue={expense?.kilometers ? expense?.kilometers : 0}
              className="rw-input flex-1 pr-16"
              validation={{
                valueAsNumber: true,
                required: true,
              }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '')
                e.target.value = value
                formMethods.setValue('kilometers', value ? parseInt(value) : 0)
                handleUpdateDistanceOrFactor()
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-muted-foreground">
              Km
            </span>
          </div>
          <FieldError name="kilometers" className="rw-field-error" />
        </div>

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
            defaultValue={expense?.fuelType || FUEL_TYPE_LIST[0].value}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  // setValue('economy', VEHICLE_ECONOMY[value])
                }}
                value={field.value?.toString()}
                defaultValue={FUEL_TYPE_LIST[0].value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type..." />
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
      </div>

      <div className="grid grid-cols-1">
        <div>
          <Label
            name="fuelConsumption"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Fuel Consumption
          </Label>
          <div className="relative mt-1 flex items-center">
            <TextField
              name="fuelConsumption"
              defaultValue={10}
              className="rw-input flex-1 pr-16"
              validation={{ valueAsNumber: true, required: true, min: 1 }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '')
                e.target.value = value
                formMethods.setValue(
                  'fuelConsumption',
                  value ? parseInt(value) : 0
                )
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-gray-500">
              Liters or KWh per 100 Km
            </span>
          </div>
          <FieldError name="fuelConsumption" className="rw-field-error" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* DEBUG:  ADD Passangers in expnse backend */}
        <div>
          <Label
            name="passengers"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Passengers
          </Label>
          <TextField
            name="passengers"
            defaultValue={0}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{
              valueAsNumber: true,
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '')
              e.target.value = value
              formMethods.setValue('passengers', value ? parseInt(value) : 0)
              if (Number(value) > 0) {
                handleUpdateDistanceOrFactor()
              }
            }}
          />
          <FieldError name="passengers" className="rw-field-error" />
        </div>

        <div className="mt-6 flex flex-row items-center justify-center">
          <Controller
            name="trailer"
            defaultValue={false}
            render={({ field }) => (
              <Switch
                className="mt-7"
                onCheckedChange={(value) => {
                  field.onChange(value)

                  // get factor value

                  const factor = formMethods.getValues('factor')

                  // if checked add 1 to factor else subtract 1
                  if (value) {
                    formMethods.setValue('factor', factor + 1)
                    handleUpdateDistanceOrFactor()
                  } else {
                    formMethods.setValue('factor', factor - 1)
                    handleUpdateDistanceOrFactor()
                  }
                }}
              />
            )}
          />
          <Label
            name="trailer"
            className="rw-label ml-3"
            errorClassName="rw-label rw-label-error"
          >
            Trailer
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
        <div>
          <Label
            name="factor"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Factor
          </Label>
          <div className="relative flex items-baseline justify-between">
            <TextField
              name="factor"
              defaultValue={3.5}
              className="rw-input flex-1"
              errorClassName="flex-1 border-none bg-transparent text-sm text-red-600 focus:outline-none"
              placeholder="0"
              validation={{ valueAsNumber: true, min: 0 }}
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

                // Convert to number if it's a complete number (no trailing decimal)
                if (value === '' || value === '.') {
                  formMethods.setValue('factor', 0)
                } else if (value.endsWith('.')) {
                  // For trailing decimal, store the numeric part and handle display separately
                  const numericPart = parseFloat(value.slice(0, -1)) || 0
                  formMethods.setValue('factor', numericPart)
                  // We keep the display value with the decimal for UX purposes
                } else {
                  // Otherwise convert to number
                  formMethods.setValue('factor', parseFloat(value))
                }
              }}
              onBlur={(e) => {
                // On blur, ensure the value is always a number
                let value = e.target.value
                if (value === '' || value === '.') {
                  value = '0'
                } else if (value.endsWith('.')) {
                  value = value.slice(0, -1) // Remove trailing decimal
                }
                e.target.value = value
                formMethods.setValue('factor', parseFloat(value) || 0)
              }}
            />
            <span className="px-2 text-sm text-muted-foreground">Kr/ Km</span>
          </div>
          <FieldError name="factor" className="rw-field-error" />
        </div>
        <div>
          <Label
            name="nokAmount"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            NOK Amount
          </Label>
          <TextField
            name="nokAmount"
            disabled
            defaultValue={expense?.nokAmount || 0}
            className="rw-input rw-input-disabled"
            errorClassName="rw-input rw-input-error"
            validation={{
              valueAsNumber: true,
            }}
            onChange={(e) => {
              // First replace commas with periods for decimal handling
              let value = e.target.value.replace(',', '.')
              // Then remove any non-numeric characters except the decimal point
              value = value.replace(/[^0-9.]/g, '')

              // Update the input field with the cleaned value
              e.target.value = value

              // Convert to number or use 0 if empty
              formMethods.setValue('nokAmount', value ? parseInt(value) : 0)
            }}
          />
          <FieldError name="nokAmount" className="rw-field-error" />
        </div>
      </div>
      <div className="grid grid-cols-1">
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
          className="rw-input-calendar"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="date" className="rw-field-error" />
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

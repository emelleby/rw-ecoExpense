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
import { FEUL_FACTORS_DATA, FUEL_TYPE_LIST } from './constants'
import UploadReciepts from './UploadReciepts'

import { Switch } from '@/components/ui/Switch'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void
  expense?: FormExpense
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  error: RWGqlError
}

export const CarDistanceBased: FC<ExpenseFormProps> = ({
  expense,
  trips,
  projects,
  onSave,
}) => {
  const formMethods = useForm()

  const [fileName, setFileName] = useState(expense?.receipt?.fileName || '')

  const [fileType, setFileType] = useState(expense?.receipt?.fileType || '')

  const [receiptUrl, setReceiptUrl] = useState(expense?.receipt?.url || '')

  const handleUpdateDistanceOrFactor = () => {
    const distance = formMethods.getValues('kilometers')

    let factor = formMethods.getValues('factor')

    const passengers = formMethods.getValues('passengers')

    factor += passengers

    if (distance && factor && distance > 0 && factor > 0) {
      formMethods.setValue('nokAmount', factor * distance)
    }
  }

  const getEmission = async (data) => {
    const { kilometers, fuelType, fuelConsumption } = data

    const feulConsumed = kilometers / fuelConsumption

    let factor = 0

    const scope3 = FEUL_FACTORS_DATA[fuelType].scope3

    const scope1 = FEUL_FACTORS_DATA[fuelType].scope1

    const scope2 = FEUL_FACTORS_DATA[fuelType].scope2

    const kwh = FEUL_FACTORS_DATA[fuelType].kwh * feulConsumed

    factor = (scope1 || 0) + (scope2 || 0) + (scope3 || 0)

    const scope3Co2Emissions = factor * feulConsumed

    return {
      scope1Co2Emissions: 0,
      scope2Co2Emissions: 0,
      scope3Co2Emissions: scope3Co2Emissions,
      kwh,
    }
  }

  const onSubmit = async (data) => {
    // Construct the receipt object
    //console.log('Receipt data submitted:', { receiptUrl, fileName, fileType }

    const {
      date,
      kilometers,
      fuelType,
      fuelConsumption,
      projectId,
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
      date,
      projectId: Number(projectId),
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
          <div className="relative mt-1 flex items-center">
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
                formMethods.setValue('kilometers', value ? parseInt(value) : '')
                handleUpdateDistanceOrFactor()
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-gray-500">
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
                  value ? parseInt(value) : ''
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label
            name="factor"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Factor
          </Label>
          <div className="relative flex items-center">
            <TextField
              name="factor"
              defaultValue={3.5}
              className="rw-input flex-1 pr-16"
              errorClassName="flex-1 border-none bg-transparent text-sm text-red-600 focus:outline-none"
              placeholder="0"
              validation={{ valueAsNumber: true, min: 1 }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                e.target.value = value
                formMethods.setValue('Factor', value ? parseInt(value) : '')
              }}
            />
            <span className="absolute right-2 mt-1 text-sm text-gray-500">
              Kr/Km
            </span>
          </div>
          <FieldError name="factor" className="rw-field-error" />
        </div>
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
              formMethods.setValue('passengers', value ? parseInt(value) : '')
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            className="rw-input disabled:bg-slate-100"
            errorClassName="rw-input rw-input-error"
            validation={{
              valueAsNumber: true,
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '')
              e.target.value = value
              formMethods.setValue('nokAmount', value ? parseInt(value) : '')
            }}
          />
          <FieldError name="nokAmount" className="rw-field-error" />
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
            className="rw-input-calendar"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />

          <FieldError name="date" className="rw-field-error" />
        </div>
      </div>

      <CommonFields
        projects={projects}
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

import { useState } from 'react'

import type { EditExpenseById, CreateExpenseInput } from 'types/graphql'

import {
  Controller,
  FieldError,
  Form,
  Label,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { type RWGqlError } from '@redwoodjs/forms'

import { Button } from 'src/components/ui/button'
import useLoader from 'src/hooks/useLoader'
import cn from 'src/lib/utils/cn'

import { Accommodation } from './Accommodation'
import { CarDistanceBased } from './CarDistanceBased'
import { COUNTRY_EMISSIONS } from './constants'
import { FeulExpense } from './FeulExpenses'
import UploadReciepts from './UploadReciepts'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'

type FormExpense = NonNullable<EditExpenseById['expense']> & {
  receipt?: {
    url: string
    fileName: string
    fileType: string
  }
}

interface ExpenseFormProps {
  onSave: (data: CreateExpenseInput, id?: number) => void
  expense?: FormExpense
  error: RWGqlError
  loading: boolean
  trips: { id: number; name: string }[]
  projects: { id: number; name: string }[]
  categories: {
    id: number
    name: string
  }[]
}

const Fields = ({ type, ...props }: { type: string } & ExpenseFormProps) => {
  switch (type) {
    case '2':
      return <CarDistanceBased {...props} />
    case '3':
      return <FeulExpense {...props} />
    default:
      return <Accommodation trips={props.trips} {...props} />
  }
}

const ExpenseForm = (props: ExpenseFormProps) => {
  const formMethods = useForm<FormExpense>()

  const { Loader, showLoader, hideLoader } = useLoader()

  //const { unregister } = formMethods

  const [fileName, setFileName] = useState(
    props.expense?.receipt?.fileName || ''
  )

  const [fileType, setFileType] = useState(
    props.expense?.receipt?.fileType || ''
  )

  const [receiptUrl, setReceiptUrl] = useState(
    props.expense?.receipt?.url || ''
  )

  const [catagory, setCatagory] = useState(
    props.expense?.categoryId?.toString() || '1'
  )

  const getEmission = (data) => {
    if (catagory === '1') {
      const { nights, numberOfPeople, country } = data

      return {
        scope1Co2Emissions: 0,
        scope2Co2Emissions: 0,
        scope3Co2Emissions:
          nights * numberOfPeople * COUNTRY_EMISSIONS[country],
      }
    }

    if (catagory === '2') {
      return {
        scope1Co2Emissions: 0,
        scope2Co2Emissions: 0,
        scope3Co2Emissions: 0,
      }
    }

    if (catagory === '3') {
      return {
        scope1Co2Emissions: 0,
        scope2Co2Emissions: 0,
        scope3Co2Emissions: 0,
      }
    }
  }

  // this function will be used to format the data before sending it to the server
  // it will delete the fields that are not needed
  // only those fields will be sent that are in FormExpense

  const formatData = (data) => {
    const formattedData = { ...data }

    formattedData.categoryId = parseInt(catagory)

    formattedData['kilometers'] = formattedData['kilometers'] || 0

    formattedData['fuelType'] = formattedData['fuelType'] || ''

    formattedData['fuelAmountLiters'] = 0.0

    formattedData['kwh'] = 0.0

    formattedData['scope3CategoryId'] = 6

    formattedData['fuelAmountLiters'] = 0.0

    formattedData['amount'] = formattedData['amount'] || 0

    formattedData['exchangeRate'] = formattedData['exchangeRate'] || 0

    formattedData['tripId'] = formattedData['tripId'] || 1

    formattedData['currency'] = formattedData['currency'] || 'NOK'

    delete formattedData?.accommodationType

    delete formattedData?.nights

    delete formattedData?.numberOfPeople

    //delete formattedData?.fuelAmountLiters

    delete formattedData?.merchant

    delete formattedData?.trailer

    delete formattedData?.country

    delete formattedData?.factor

    delete formattedData?.passengers

    delete formattedData?.fuelConsumption

    //delete formattedData.receipt
    //delete formattedData.categoryId
    return formattedData
  }

  const onSubmit = async (data: FormExpense) => {
    // Construct the receipt object
    //console.log('Receipt data submitted:', { receiptUrl, fileName, fileType })
    const receipt = receiptUrl
      ? {
          url: receiptUrl,
          fileName: fileName!,
          fileType: fileType!,
        }
      : undefined

    const emission = getEmission(data)

    const dataWithReceipt = {
      ...data,
      ...emission,
      receipt, // Add the nested receipt object
    }

    // format the data before sending it to the server

    const formattedData = formatData(dataWithReceipt)
    showLoader()
    await props.onSave(formattedData, props?.expense?.id)

    hideLoader()
  }

  return (
    <div className="rw-form-wrapper space-y-1 pt-5">
      <Form formMethods={formMethods} onSubmit={onSubmit}>
        <Controller
          name="categoryId"
          defaultValue={catagory}
          render={({ field }) => (
            <Select
              name="categoryId"
              onValueChange={(value) => {
                setCatagory(value.toString())
                field.onChange(value)
              }}
              value={props.expense?.categoryId.toString()}
              defaultValue={catagory}
            >
              <SelectTrigger className={cn('w-full')}>
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {props.categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <Fields type={catagory} {...props} />

        <div className="grid grid-cols-1 gap-4">
          <Label
            name="description"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Description
          </Label>

          <TextField
            name="description"
            defaultValue={props.expense?.description}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />

          <FieldError name="description" className="rw-field-error" />
        </div>

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

      <Loader />
    </div>
  )
}

export default ExpenseForm

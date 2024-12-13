import { useState } from 'react'

import { PickerInline } from 'filestack-react'
import type {
  EditExpenseById,
  UpdateExpenseInput,
  CreateExpenseInput,
} from 'types/graphql'
import type {
  DeleteReceiptMutation,
  DeleteReceiptMutationVariables,
  FindReceipt,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  Controller,
  Submit,
  useForm,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import DatetimeLocalField from 'src/components/Custom/DatePicker'
import FileUpload from 'src/components/Custom/FileUpload'
import { Button } from 'src/components/ui/Button'
import cn from 'src/lib/utils/cn'

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
  onSave: (data: CreateExpenseInput, id?: number) => void // Accept CreateExpenseInput directly
  expense?: FormExpense
  error: RWGqlError
  loading: boolean
  categories: {
    id: number
    name: string
  }[]
}

const DELETE_RECEIPT_MUTATION: TypedDocumentNode<
  DeleteReceiptMutation,
  DeleteReceiptMutationVariables
> = gql`
  mutation DeleteReceiptMutation($id: Int!) {
    deleteReceipt(id: $id) {
      id
    }
  }
`

const ExpenseForm = (props: ExpenseFormProps) => {
  const [receiptUrl, setReceiptUrl] = useState(props?.expense?.receipt?.url)
  const [fileName, setFileName] = useState(props?.expense?.receipt?.fileName)
  const [fileType, setFileType] = useState(props?.expense?.receipt?.fileType)
  console.log('Receipt data:', { receiptUrl, fileName, fileType })

  const formMethods = useForm()
  const thumbnail = (url, width = 2 * 384) => {
    const parts = url.split('/')
    parts.splice(3, 0, `resize=width:${width}`)
    return parts.join('/')
  }
  const [deleteReceipt] = useMutation(DELETE_RECEIPT_MUTATION, {
    onCompleted: () => {
      toast.success('Receipt deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onReplaceClick = () => {
    deleteReceipt({ variables: { id: props?.expense?.receipt?.id } })
    setReceiptUrl(null)
    setFileName(null)
    setFileType(null)
  }

  const onSubmit = (data: FormExpense) => {
    // Construct the receipt object
    console.log('Receipt data submitted:', { receiptUrl, fileName, fileType })
    const receipt = receiptUrl
      ? {
          url: receiptUrl,
          fileName: fileName!,
          fileType: fileType!,
        }
      : undefined

    const dataWithReceipt = {
      ...data,
      receipt, // Add the nested receipt object
    }
    console.log('Data being sent to onSave:', dataWithReceipt)

    props.onSave(dataWithReceipt, props?.expense?.id)
  }

  const onFileUpload = (response) => {
    const file = response.filesUploaded[0]
    setReceiptUrl(file.url)
    setFileName(file.filename)
    setFileType(file.mimetype)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormExpense> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="categoryId"
          className="rw-label mb-2"
          errorClassName="rw-label rw-label-error"
        >
          Category
        </Label>

        <Controller
          name="categoryId"
          defaultValue={props.expense?.categoryId}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              value={field.value?.toString()}
              defaultValue={props.expense?.categoryId?.toString()}
            >
              <SelectTrigger
                className={cn(
                  'w-full',
                  formMethods.formState.errors?.categoryId && 'border-red-500'
                )}
              >
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

        <FieldError name="categoryId" className="rw-field-error" />

        <Label
          name="date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Date
        </Label>

        <DatetimeLocalField
          name="date"
          defaultValue={props.expense?.date}
          className="rw-input-calendar"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="date" className="rw-field-error" />

        <div className="grid grid-cols-2 gap-4">
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
              defaultValue={props.expense?.amount}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ valueAsNumber: true, required: true }}
            />
            <FieldError name="amount" className="rw-field-error" />
          </div>

          <div>
            <Label
              name="currency"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Currency
            </Label>
            <TextField
              name="currency"
              defaultValue={props.expense?.currency}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
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
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ valueAsNumber: true, required: true }}
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
              defaultValue={props.expense?.nokAmount}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ valueAsNumber: true, required: true }}
            />
            <FieldError name="nokAmount" className="rw-field-error" />
          </div>
        </div>
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

        <Label
          name="kilometers"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Kilometers
        </Label>

        <TextField
          name="kilometers"
          defaultValue={props.expense?.kilometers}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="kilometers" className="rw-field-error" />

        <Label
          name="fuelType"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Fuel type
        </Label>

        <TextField
          name="fuelType"
          defaultValue={props.expense?.fuelType}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="fuelType" className="rw-field-error" />

        <Label
          name="fuelAmountLiters"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Fuel amount liters
        </Label>

        <TextField
          name="fuelAmountLiters"
          defaultValue={props.expense?.fuelAmountLiters}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="fuelAmountLiters" className="rw-field-error" />

        <Label
          name="sectorId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Sector id
        </Label>

        <NumberField
          name="sectorId"
          defaultValue={props.expense?.sectorId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="sectorId" className="rw-field-error" />

        <Label
          name="supplierId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Supplier id
        </Label>

        <NumberField
          name="supplierId"
          defaultValue={props.expense?.supplierId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="supplierId" className="rw-field-error" />

        <Label
          name="tripId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Trip id
        </Label>

        <NumberField
          name="tripId"
          defaultValue={props.expense?.tripId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="tripId" className="rw-field-error" />

        <Label
          name="projectId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Project id
        </Label>

        <NumberField
          name="projectId"
          defaultValue={props.expense?.projectId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="projectId" className="rw-field-error" />

        {/* <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <NumberField
          name="userId"
          defaultValue={props.expense?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="userId" className="rw-field-error" /> */}

        <Label
          name="scope1Co2Emissions"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Scope 1 co2 emissions
        </Label>

        <TextField
          name="scope1Co2Emissions"
          defaultValue={props.expense?.scope1Co2Emissions}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="scope1Co2Emissions" className="rw-field-error" />

        <Label
          name="scope2Co2Emissions"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Scope 2 co2 emissions
        </Label>

        <TextField
          name="scope2Co2Emissions"
          defaultValue={props.expense?.scope2Co2Emissions}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="scope2Co2Emissions" className="rw-field-error" />

        <Label
          name="scope3Co2Emissions"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Scope 3 co2 emissions
        </Label>

        <TextField
          name="scope3Co2Emissions"
          defaultValue={props.expense?.scope3Co2Emissions}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="scope3Co2Emissions" className="rw-field-error" />

        <Label
          name="kwh"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Kwh
        </Label>

        <TextField
          name="kwh"
          defaultValue={props.expense?.kwh}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="kwh" className="rw-field-error" />

        <Label
          name="scope3CategoryId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Scope3 category id
        </Label>

        <NumberField
          name="scope3CategoryId"
          defaultValue={props.expense?.scope3CategoryId}
          className="rw-input mb-4"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="scope3CategoryId" className="rw-field-error" />
        {!receiptUrl && (
          <PickerInline
            apikey={process.env.REDWOOD_ENV_FILESTACK_API_KEY}
            onSuccess={onFileUpload}
          />
        )}
        {receiptUrl && (
          <div className="mt-4">
            <h3 className="rw-label">Receipt Preview</h3>
            <div className="mx-auto w-full max-w-sm">
              <img
                src={thumbnail(receiptUrl)}
                alt="Receipt preview"
                className="h-auto w-full rounded-lg object-contain shadow-md"
              />
              <Button
                onClick={() => onReplaceClick()}
                className="mt-2 w-full"
                variant="outline"
                type="button"
              >
                Replace Image
              </Button>
            </div>
          </div>
        )}
        {/* <FileUpload
          onUpload={handleFileUploaded}
          expenseId={props.expense?.id}
        /> */}

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ExpenseForm

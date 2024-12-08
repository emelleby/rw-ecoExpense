import type { EditExpenseById, UpdateExpenseInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  NumberField,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import FileUpload from 'src/components/Custom/FileUpload'

type FormExpense = NonNullable<EditExpenseById['expense']>

interface ExpenseFormProps {
  expense?: EditExpenseById['expense']
  onSave: (data: UpdateExpenseInput, id?: FormExpense['id']) => void
  error: RWGqlError
  loading: boolean
}

const ExpenseForm = (props: ExpenseFormProps) => {
  const onSubmit = (data: FormExpense) => {
    props.onSave(data, props?.expense?.id)
  }

  const handleFileUploaded = (fileUrl: string) => {
    // Handle the uploaded file URL
    console.log('File uploaded:', fileUrl)
    // Store the URL in both receiptPath and receiptFilename fields
    const filename = fileUrl.split('/').pop()

    onSubmit({
      ...props.expense,
      receiptPath: fileUrl,
      receiptFilename: filename,
    })
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
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Category id
        </Label>

        <NumberField
          name="categoryId"
          defaultValue={props.expense?.categoryId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="categoryId" className="rw-field-error" />

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

        <Label
          name="nokAmount"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Nok amount
        </Label>

        <TextField
          name="nokAmount"
          defaultValue={props.expense?.nokAmount}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsNumber: true, required: true }}
        />

        <FieldError name="nokAmount" className="rw-field-error" />

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

        <Label
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

        <FieldError name="userId" className="rw-field-error" />

        <Label
          name="receiptFilename"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Receipt filename
        </Label>

        <TextField
          name="receiptFilename"
          defaultValue={props.expense?.receiptFilename}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="receiptFilename" className="rw-field-error" />

        <Label
          name="receiptPath"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Receipt path
        </Label>

        <TextField
          name="receiptPath"
          defaultValue={props.expense?.receiptPath}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="receiptPath" className="rw-field-error" />

        <Label
          name="scope1Co2Emissions"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Scope1 co2 emissions
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
          Scope2 co2 emissions
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
          Scope3 co2 emissions
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
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="scope3CategoryId" className="rw-field-error" />

        <FileUpload
          onUpload={handleFileUploaded}
          expenseId={props.expense?.id}
        />

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

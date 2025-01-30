import { useState } from 'react'

import type { EditExpenseById, CreateExpenseInput } from 'types/graphql'

import { Controller, RWGqlError } from '@redwoodjs/forms'

import cn from 'src/lib/utils/cn'

import { Accommodation } from './Accommodation'
import { CarDistanceBased } from './CarDistanceBased'
import { Flight } from './Flight'
import { FuelExpense } from './FuelExpenses'
import { Groceries } from './Groceries'
import { Miscellaneous } from './Miscellaneous'

import { Label } from '@/components/ui/Label'
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
      return <FuelExpense {...props} />
    case '4':
      return <Flight {...props} />
    case '6':
      return <Miscellaneous {...props} />
    case '5':
      return <Groceries {...props} />
    default:
      return <Accommodation trips={props.trips} {...props} />
  }
}

const ExpenseForm = (props: ExpenseFormProps) => {
  //const { unregister } = formMethods

  const [catagory, setCategory] = useState(
    props.expense?.categoryId?.toString() || '1'
  )

  return (
    <div className="rw-form-wrapper pt-5">
      <Label htmlFor="categoryId" className="text-base font-semibold">
        Expense Type
      </Label>

      {/* <Label
        name="expenseType"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Expense Type
      </Label> */}
      <Select
        name="categoryId"
        onValueChange={(value) => {
          setCategory(value.toString())
          //field.onChange(value)
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

      <Fields type={catagory} {...props} />
    </div>
  )
}

export default ExpenseForm

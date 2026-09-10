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
import { PublicTransport } from './PublicTransport'
import { TravelSpend } from './TravelSpend'

import { Label } from '@/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  categories: {
    id: number
    name: string
    group?: string
  }[]
}

// Which form each category renders is keyed by name, not id: ids are
// assigned by seed order, so an id-based switch would silently break
// (falling through to Accommodation) if categories are ever reseeded.
const Fields = ({ type, ...props }: { type: string } & ExpenseFormProps) => {
  const category = props.categories?.find((c) => c.id === Number(type))

  switch (category?.name) {
    case 'Car - distance-based':
      return <CarDistanceBased {...props} />
    case 'Fuel Expenses':
      return <FuelExpense {...props} />
    case 'Flights':
      return <Flight {...props} />
    case 'Other miscellaneous':
      return <Miscellaneous {...props} />
    case 'Groceries':
      return <Groceries {...props} />
    case 'Bus':
    case 'Train':
    case 'Ferry':
      return (
        <PublicTransport
          categoryId={category.id}
          name={category.name}
          {...props}
        />
      )
    case 'Road toll':
    case 'Rental car':
    case 'Parking':
      return (
        <TravelSpend categoryId={category.id} name={category.name} {...props} />
      )
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
          {props.categories
            ?.filter((category) => !category.group)
            .map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          {Array.from(
            new Set(
              props.categories?.filter((c) => c.group).map((c) => c.group)
            )
          ).map((group) => (
            <SelectGroup key={group}>
              <SelectLabel>{group}</SelectLabel>
              {props.categories
                ?.filter((category) => category.group === group)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <Fields type={catagory} {...props} />
    </div>
  )
}

export default ExpenseForm

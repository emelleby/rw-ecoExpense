import { useState } from 'react'

import { format } from 'date-fns'
import { Calendar } from 'lucide-react'

import { useController } from '@redwoodjs/forms'

import { Button } from '@/components/ui/Button'
import { Calendar as CalendarComponent } from '@/components/ui/Calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover'

type ValidationRules = {
  required?: boolean
}

type DatetimeLocalFieldProps = {
  name: string
  className?: string
  errorClassName?: string
  defaultValue?: string | Date
  onChange?: (date: Date) => void
  validation?: ValidationRules
}

const DatetimeLocalField = ({
  name,
  defaultValue,
  onChange,
  validation,
  className,
  errorClassName,
}: DatetimeLocalFieldProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    rules: validation,
    defaultValue,
  })

  const [open, setOpen] = useState(false)

  // Convert string or Date to Date object
  const initialDate = defaultValue
    ? typeof defaultValue === 'string'
      ? new Date(defaultValue)
      : defaultValue
    : undefined

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  )

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    field.onChange(date?.toISOString())
    onChange?.(date)
    setOpen(false)
  }

  return (
    <div>
      <input
        type="hidden"
        name={name}
        data-testid="date-input"
        value={selectedDate?.toISOString() || ''}
        {...validation}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${error ? errorClassName : className} justify-start`}
          >
            <Calendar className="mr-2 h-4 w-4 dark:text-white" />
            {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatetimeLocalField

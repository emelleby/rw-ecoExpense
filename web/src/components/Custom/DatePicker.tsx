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
  //console.log(`DatePicker ${name} defaultValue:`, defaultValue)
  // Convert ISO string to Date object if needed
  const initialDate =
    typeof defaultValue === 'string' ? new Date(defaultValue) : defaultValue
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  )

  const handleSelect = (date: Date | undefined) => {
    //console.log(`DatePicker ${name} selected:`, date)
    //console.log(`DatePicker ${name} ISO string:`, date?.toISOString())
    setSelectedDate(date)

    // Always store and transmit full ISO string for DB compatibility
    field.onChange(date?.toISOString())
    onChange?.(date)
    setOpen(false)
  }

  return (
    <div>
      <input
        type="hidden"
        name={name}
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

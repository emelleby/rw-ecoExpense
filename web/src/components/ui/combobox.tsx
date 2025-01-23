'use client'

import * as React from 'react'

import { Check, ChevronDown } from 'lucide-react'

import { cn } from 'src/utils/cn'

import { Button } from '@/components/ui/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover'

interface CurrencyFieldProps {
  defaultValue: string
  isActive: boolean
  Data: Array<{ label: string; value: string | number }>
  onChangeHandle?: (value: string) => void
  defaultText: string
}

export function Combobox({
  defaultValue,
  isActive,
  onChangeHandle,
  Data,
  defaultText,
}: CurrencyFieldProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={!isActive}
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value
            ? Data.find((d) => d.value === value)?.label
            : `Select ${defaultText}...`}
          <ChevronDown className="ml-4 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            onValueChange={(value) => {
              console.log(value)
            }}
            placeholder={`Search ${defaultText}...`}
          />
          <CommandList>
            <CommandEmpty>No Currency found.</CommandEmpty>
            <CommandGroup>
              {Data.map((d) => (
                <CommandItem
                  key={d.value}
                  value={d.value.toString()}
                  onSelect={(currentValue) => {
                    console.log('currentValue', currentValue)

                    setValue(currentValue === value ? '' : currentValue)
                    onChangeHandle(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === d.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {d.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

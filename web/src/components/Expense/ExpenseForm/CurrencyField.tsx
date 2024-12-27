'use client'

import * as React from 'react'

import { Check, ChevronDown } from 'lucide-react'

import { cn } from 'src/utils/cn'

import { CURRENCIES_OF_COUTRIES } from './constants'

import { Button } from '@/components/ui/button'
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
  currency: string
  isActive: boolean
  onCurrencyChange: (value: string) => void
}

export function CurrencyField({
  currency,
  isActive,
  onCurrencyChange,
}: CurrencyFieldProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(currency)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={!isActive}
          aria-expanded={open}
          className="w-full justify-between p-5"
        >
          {value
            ? CURRENCIES_OF_COUTRIES.find(
                (currency) => currency.value === value
              )?.label
            : 'Select Currency...'}
          <ChevronDown className="ml-4 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No Currency found.</CommandEmpty>
            <CommandGroup>
              {CURRENCIES_OF_COUTRIES.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    onCurrencyChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === currency.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {currency.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

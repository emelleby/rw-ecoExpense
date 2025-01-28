import React, { useState, useCallback } from 'react'

import { Airport } from 'types/expense/airport'

import { searchAirports } from './service'

interface AirportSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
}

export default function AirportSelect({
  value,
  onChange,
  placeholder,
  label,
}: AirportSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || '')
  const [options, setOptions] = useState<Airport[]>([])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      console.log(newValue)
      setInputValue(newValue)

      if (newValue.trim()) {
        const results = searchAirports(newValue)
        setOptions(results)
        setIsOpen(true)
      } else {
        setOptions([])
        setIsOpen(false)
      }
    },
    []
  )

  const handleOptionSelect = useCallback(
    (airport: Airport) => {
      setInputValue(airport.airport_code)
      onChange(airport.airport_code)
      setOptions([])
      setIsOpen(false)
    },
    [onChange]
  )

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }, [])

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="rw-input"
        />
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isOpen && options.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border  bg-background shadow-lg">
            {options.map((airport) => (
              <li
                key={airport.airport_code}
                onClick={() => handleOptionSelect(airport)}
                className="border-b-1 cursor-pointer border px-4 py-2 hover:bg-sky-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">
                    {airport.airport_code}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {airport.airport_name}
                  </span>
                </div>
                <div className="text text-sm">
                  {airport.town}, {airport.country}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

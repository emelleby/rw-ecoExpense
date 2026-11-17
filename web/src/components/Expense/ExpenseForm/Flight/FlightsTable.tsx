import React from 'react'

import { format, parse } from 'date-fns'
import { ArrowRight, PlaneTakeoff, Trash2Icon } from 'lucide-react'

import { Button } from 'src/components/ui/Button'

import { FLIGHT_CLASSES } from '../constants'

export interface FlightSegment {
  origin: string
  destination: string
  operatingCarrierCode: string
  flightNumber: string
  class: string
  /** yyyy-MM-dd */
  departureDate: string
}

interface FlightsTableProps {
  data: FlightSegment[]
  handleDelete: (index: number) => void
  /** The segment currently being typed in the form, not yet added */
  draft?: Partial<FlightSegment> | null
}

const formatDate = (value: string) => {
  const date = parse(value, 'yyyy-MM-dd', new Date())
  return isNaN(date.getTime()) ? value : format(date, 'd MMM yyyy')
}

const className = (value: string) =>
  FLIGHT_CLASSES.find((c) => c.value === value)?.name || value

export default function FlightsTable({
  data,
  handleDelete,
  draft,
}: FlightsTableProps) {
  return (
    <ol className="space-y-2" aria-label="Added flight segments">
      {data.map((flight, index) => (
        <li
          key={`${index}-${flight.origin}-${flight.flightNumber}`}
          className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <PlaneTakeoff className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{flight.origin}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{flight.destination}</span>
            </div>
            <div className="truncate text-sm text-muted-foreground">
              {flight.operatingCarrierCode} {flight.flightNumber} ·{' '}
              {className(flight.class)} · {formatDate(flight.departureDate)}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(index)}
            aria-label={`Remove segment ${index + 1}: ${flight.origin} to ${flight.destination}`}
            className="shrink-0 text-red-600 hover:text-red-700"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </li>
      ))}
      {draft && (
        <li
          className="flex items-center gap-3 rounded-lg border-2 border-dashed border-primary/50 p-3"
          aria-label={`Segment ${data.length + 1}, not added yet`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-primary text-xs font-semibold text-primary">
            {data.length + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <PlaneTakeoff className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{draft.origin || '…'}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{draft.destination || '…'}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Not added yet. Included when you save.
            </div>
          </div>
        </li>
      )}
    </ol>
  )
}

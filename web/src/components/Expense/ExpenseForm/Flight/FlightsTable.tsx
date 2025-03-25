import React from 'react'

import { Trash2Icon } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/Table'

interface FlightsTableProps {
  data: Array<{
    origin: string
    destination: string
    operatingCarrierCode: string
    flightNumber: string
    class: string
    departureDate: Date
  }>
  handleDelete: (index: number) => void
}

export default function FlightsTable({
  data,
  handleDelete,
}: FlightsTableProps) {
  return (
    <Table>
      <TableCaption>List of Flights</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Airline</TableHead>
          <TableHead>Flight Class</TableHead>
          <TableHead>Departure Date</TableHead>
          <TableHead className="self-end">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((flight, index) => (
          <TableRow key={flight.origin}>
            <TableCell className="font-medium">{flight.origin}</TableCell>
            <TableCell>{flight.destination}</TableCell>
            <TableCell>
              {flight.operatingCarrierCode}-{flight.flightNumber}
            </TableCell>
            <TableCell>{flight.class}</TableCell>
            <TableCell>{`${flight.departureDate}`}</TableCell>
            <TableCell className="text-right">
              <Trash2Icon
                className="cursor-pointer"
                onClick={() => handleDelete(index)}
                color="red"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

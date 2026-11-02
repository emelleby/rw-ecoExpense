import type { Flights } from 'types/graphql'

import { submitFutureFlights as submitToTravelAPI } from './flight'

export const submitFutureFlights = async ({ input }: { input: Flights[] }) => {
  // Transform input to match the Travel API format
  const formattedInput = input.map((flight) => ({
    origin: flight.origin.toUpperCase(), // API expects uppercase airport codes
    destination: flight.destination.toUpperCase(),
    operatingCarrierCode: flight.operatingCarrierCode.toUpperCase(),
    flightNumber: flight.flightNumber,
    departureDate: flight.departureDate, // YYYY-MM-DD, parsed in flight.ts
  }))

  // Errors propagate to the client. We deliberately do NOT fall back to
  // placeholder numbers: they would be saved as real emissions.
  const apiResults = await submitToTravelAPI({ input: formattedInput })

  // Map results back to our schema format, ensuring class is included
  return apiResults.map((result, index) => ({
    flight: {
      ...result.flight,
      class: input[index].class || 'economy', // Keep the class from our input
    },
    emissionsGramsPerPax: result.emissionsGramsPerPax,
  }))
}

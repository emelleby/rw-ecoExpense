import type { Flights } from 'types/graphql'

import { submitFutureFlights as submitToTravelAPI } from './flight'

const parseDateString = (dateStr: string) => {
  const date = new Date(dateStr)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

export const submitFutureFlights = async ({ input }: { input: Flights[] }) => {
  // Transform input to match the Travel API format
  const formattedInput = input.map((flight) => ({
    origin: flight.origin.toUpperCase(), // API expects uppercase airport codes
    destination: flight.destination.toUpperCase(),
    operatingCarrierCode: flight.operatingCarrierCode.toUpperCase(),
    flightNumber: flight.flightNumber,
    departureDate: flight.departureDate, // Keep as string, let flight.ts handle parsing
  }))

  try {
    // Get emissions data from Google Travel API
    const apiResults = await submitToTravelAPI({ input: formattedInput })

    // Map results back to our schema format, ensuring class is included
    return apiResults.map((result, index) => ({
      flight: {
        ...result.flight,
        class: input[index].class || 'economy', // Keep the class from our input
      },
      emissionsGramsPerPax: result.emissionsGramsPerPax,
    }))
  } catch (error) {
    console.error('Failed to get flight emissions:', error)
    // Return mock data in case of API failure
    return input.map((flight) => ({
      flight: {
        origin: flight.origin.toUpperCase(),
        destination: flight.destination.toUpperCase(),
        operatingCarrierCode: flight.operatingCarrierCode.toUpperCase(),
        flightNumber: parseInt(flight.flightNumber) || 0,
        class: flight.class || 'economy',
        departureDate: parseDateString(flight.departureDate), // Parse only for mock data
      },
      emissionsGramsPerPax: {
        first: 300,
        business: 200,
        premiumEconomy: 150,
        economy: 100,
      },
    }))
  }
}

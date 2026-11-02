import { fetch } from '@whatwg-node/fetch'

const TRAVEL_API_URL =
  'https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions'

interface DateComponents {
  year: number
  month: number
  day: number
}

interface FlightRequest {
  origin: string
  destination: string
  operatingCarrierCode: string
  flightNumber: number
  departureDate: DateComponents
}

interface TravelAPIRequest {
  flights: FlightRequest[]
}

interface FlightDetails {
  origin: string
  destination: string
  operatingCarrierCode: string
  flightNumber: number
  departureDate: DateComponents
}

interface EmissionsPerClass {
  first: number
  business: number
  premiumEconomy: number
  economy: number
}

interface FlightEmissionResult {
  flight: FlightDetails
  emissionsGramsPerPax: EmissionsPerClass
}

interface TravelAPIResponse {
  flightEmissions: FlightEmissionResult[]
  emissionsGramsPerPax: EmissionsPerClass
  modelVersion: {
    major: number
    minor: number
    patch: number
    dated: string
  }
}

const formatDate = (
  flightData: Array<{
    origin: string
    destination: string
    operatingCarrierCode: string
    flightNumber: string
    departureDate: string
  }>
) => {
  return flightData.map((flight) => {
    // departureDate is a calendar date (YYYY-MM-DD). Read the parts directly:
    // going through `new Date()` + getDate() shifts the day with server TZ.
    const [year, month, day] = flight.departureDate
      .slice(0, 10)
      .split('-')
      .map(Number)

    return {
      origin: flight.origin.toUpperCase(),
      destination: flight.destination.toUpperCase(),
      operatingCarrierCode: flight.operatingCarrierCode.toUpperCase(),
      flightNumber: parseInt(flight.flightNumber, 10),
      departureDate: { year, month, day },
    }
  })
}

export const submitFutureFlights = async ({
  input,
}: {
  input: Array<{
    origin: string
    destination: string
    operatingCarrierCode: string
    flightNumber: string
    departureDate: string
  }>
}): Promise<FlightEmissionResult[]> => {
  const TRAVEL_API_KEY = process.env.GOOGLE_TRAVEL_API_KEY

  if (!TRAVEL_API_KEY) {
    throw new Error(
      'Google Travel API key is not configured. Please set GOOGLE_TRAVEL_API_KEY in your environment variables.'
    )
  }

  try {
    const formattedData = formatDate(input)
    const requestData: TravelAPIRequest = {
      flights: formattedData,
    }

    const response = await fetch(`${TRAVEL_API_URL}?key=${TRAVEL_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error?.message || 'Failed to get flight emissions data'
      )
    }

    const data: TravelAPIResponse = await response.json()

    // The API answers 200 with the flight echoed back but no emissions when it
    // has no data (e.g. flights too far in the past, or an unknown flight).
    if (
      !data.flightEmissions?.length ||
      data.flightEmissions.some((f) => !f.emissionsGramsPerPax)
    ) {
      throw new Error(
        'No flight emissions data returned from the API. Please check your inputs.'
      )
    }

    return data.flightEmissions
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

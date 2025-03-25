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
    const date = new Date(flight.departureDate)

    const data = {
      origin: flight.origin.toUpperCase(),
      destination: flight.destination.toUpperCase(),
      operatingCarrierCode: flight.operatingCarrierCode.toUpperCase(),
      flightNumber: parseInt(flight.flightNumber, 10),
      departureDate: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
    }

    console.log('\n\nData:', data, '\n\n')

    return data
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
  const TRAVEL_API_KEY = 'AIzaSyA2V3FOVoNzJxDQdZ_IxbQdrTRx_AFOoiM'

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

    if (data.flightEmissions.length === 0) {
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

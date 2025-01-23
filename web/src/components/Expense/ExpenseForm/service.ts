import axios from 'axios'

import {
  Airport,
  EmissionsRequest,
  EmissionsResponse,
} from 'src/components/types/expense/airport'
import airportsData from 'src/static/airports.json'

interface AirportsData {
  airports: Airport[]
}

const getAirports = (): Airport[] => {
  try {
    const data = airportsData as AirportsData
    return data.airports || []
  } catch (error) {
    console.error('Error loading airports:', error)
    return []
  }
}

export const searchAirports = (query: string): Airport[] => {
  if (!query?.trim()) return []

  try {
    const searchTerm = query.toLowerCase().trim()
    const airports = getAirports()

    return airports
      .filter(
        (airport) =>
          airport.airport_code.toLowerCase().includes(searchTerm) ||
          airport.airport_name.toLowerCase().includes(searchTerm) ||
          airport.town.toLowerCase().includes(searchTerm) ||
          airport.country.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10) // Limit to 10 results for performance
  } catch (error) {
    console.error('Error searching airports:', error)
    return []
  }
}

export async function getCurrencyConversionRate(
  base: string,
  date: Date
): Promise<number> {
  try {
    const currentDate = new Date().toISOString().split('T')[0]
    const selectedDate = new Date(date).toISOString().split('T')[0]

    const apiUrl =
      currentDate <= selectedDate
        ? `https://api.frankfurter.dev/v1/latest?base=${base}&symbols=NOK`
        : `https://api.frankfurter.dev/v1/${selectedDate}?base=${base}&symbols=NOK`

    const response = await axios.get(apiUrl)
    return response.data.rates.NOK || 0
  } catch (error) {
    console.error('Error fetching conversion rate:', error)
    return 0
  }
}

export const calculateEmissions = async (
  data: EmissionsRequest
): Promise<EmissionsResponse> => {
  try {
    // Filter out empty strings from route array
    const cleanedData = {
      ...data,
      route: data.route.filter(Boolean),
    }

    const response = await axios.post(
      `https://flights-by-scope321.replit.app/api/v1/calculate-emissions`,
      cleanedData,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.message,
      })
      throw new Error(
        error.response?.data?.message ||
          'Failed to calculate emissions. Please check your input and try again.'
      )
    }
    throw error
  }
}

interface DateComponents {
  year: number
  month: number
  day: number
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

export interface FlightEmissionResult {
  flight: FlightDetails
  emissionsGramsPerPax: EmissionsPerClass
}

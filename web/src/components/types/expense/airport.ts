export interface Airport {
  airport: string
  id: number
  eu_busiest_rank: string
  airport_code: string
  airport_name: string
  town: string
  country: string
}

export interface FlightEmissions {
  economy: number
  premium_economy: number
  business: number
  first: number
}

export interface RouteDetail {
  origin: string
  destination: string
  operatingCarrierCode: string
  flightNumber: number
  departureDate: {
    year: number
    month: number
    day: number
  }
  travelers: number
  date: string
  found: boolean
  emissions: FlightEmissions
}

export interface EmissionsRequest {
  class: string
  departureDate: string
  ir_factor: boolean
  return: boolean
  route: string[]
  travelers: number
}

export interface EmissionsResponse {
  total_emissions: number
  total_distance: number
  per_passenger: number
  without_ir: number
  route_details: RouteDetail[]
}

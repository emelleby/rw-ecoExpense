export const schema = gql`
  type DateComponents {
    year: Int!
    month: Int!
    day: Int!
  }

  type EmissionsPerClass {
    first: Float!
    business: Float!
    premiumEconomy: Float!
    economy: Float!
  }

  type FlightDetails {
    origin: String!
    destination: String!
    operatingCarrierCode: String!
    flightNumber: Int!
    class: String!
    departureDate: DateComponents!
  }

  type FlightEmissionResult {
    flight: FlightDetails!
    emissionsGramsPerPax: EmissionsPerClass!
  }

  input DateComponentsInput {
    year: Int!
    month: Int!
    day: Int!
  }

  input Flights {
    origin: String!
    destination: String!
    operatingCarrierCode: String!
    flightNumber: String!
    departureDate: String!
  }

  type Mutation {
    submitFutureFlights(input: [Flights]!): [FlightEmissionResult]! @skipAuth
  }
`

export const schema = gql`
  type Rate {
    id: Int!
    customer: Customer!
    customerId: Int!
    rateType: RateType!
    rateAmount: Float!
    description: String
    workEntries: [WorkEntry!]!
  }

  enum RateType {
    hourly
    daily
  }

  type Query {
    rates: [Rate!]! @requireAuth
    rate(id: Int!): Rate @requireAuth
    ratesByCustomer(customerId: Int!): [Rate!]! @requireAuth
  }

  input CreateRateInput {
    customerId: Int!
    rateType: RateType!
    rateAmount: Float!
    description: String
  }

  input UpdateRateInput {
    customerId: Int
    rateType: RateType
    rateAmount: Float
    description: String
  }

  type Mutation {
    createRate(input: CreateRateInput!): Rate! @requireAuth
    updateRate(id: Int!, input: UpdateRateInput!): Rate! @requireAuth
    deleteRate(id: Int!): Rate! @requireAuth
  }
`

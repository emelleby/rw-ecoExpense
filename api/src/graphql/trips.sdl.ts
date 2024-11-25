export const schema = gql`
  type Trip {
    id: Int!
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    userId: Int!
    user: User!
    expenses: [Expense]!
    approvedDate: DateTime
    reimbursementStatus: ReimbursementStatus!
    transactionId: String
  }

  enum ReimbursementStatus {
    NOT_REQUESTED
    PENDING
    REIMBURSED
  }

  type Query {
    trips: [Trip!]! @requireAuth
    trip(id: Int!): Trip @requireAuth
  }

  input CreateTripInput {
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    userId: Int!
    approvedDate: DateTime
    reimbursementStatus: ReimbursementStatus = NOT_REQUESTED
    transactionId: String
  }

  input UpdateTripInput {
    name: String
    startDate: DateTime
    endDate: DateTime
    userId: Int
    approvedDate: DateTime
    reimbursementStatus: ReimbursementStatus
    transactionId: String
  }

  type Mutation {
    createTrip(input: CreateTripInput!): Trip! @skipAuth
    updateTrip(id: Int!, input: UpdateTripInput!): Trip! @skipAuth
    deleteTrip(id: Int!): Trip! @skipAuth
  }
`

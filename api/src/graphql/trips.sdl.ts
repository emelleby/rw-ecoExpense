export const schema = gql`
  type Trip {
    id: Int!
    name: String!
    description: String
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
    tripsByUser(take: Int): [Trip!]! @requireAuth
    topTripsByUser: [Trip!]! @requireAuth
  }

  input CreateTripInput {
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    userId: Int!
    description: String
    reimbursementStatus: ReimbursementStatus = NOT_REQUESTED
  }

  input UpdateTripInput {
    name: String
    description: String
    startDate: DateTime
    endDate: DateTime
    userId: Int
    approvedDate: DateTime
    reimbursementStatus: ReimbursementStatus
    transactionId: String
  }

  input UpdateReimbursementStatusInput {
    reimbursementStatus: ReimbursementStatus!
  }

  type Mutation {
    createTrip(input: CreateTripInput!): Trip! @skipAuth
    updateTrip(id: Int!, input: UpdateTripInput!): Trip! @skipAuth
    deleteTrip(id: Int!): Trip! @skipAuth
    updateReimbursementStatus(
      reimbursementStatus: ReimbursementStatus!
      id: Int!
    ): Boolean! @requireAuth
  }
`

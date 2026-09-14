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
    projectId: Int
    project: Project
    secondaryCurrency: String
    isPrivate: Boolean!
    shareToken: String
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
    sharedTripReport(token: String!): Trip @skipAuth
  }

  input CreateTripInput {
    name: String!
    startDate: DateTime!
    endDate: DateTime!
    userId: Int!
    description: String
    reimbursementStatus: ReimbursementStatus = NOT_REQUESTED
    projectId: Int! # Remove the optional type here
    secondaryCurrency: String
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
    projectId: Int
    secondaryCurrency: String
    isPrivate: Boolean
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
    createShareLink(tripId: Int!): Trip! @requireAuth
    revokeShareLink(tripId: Int!): Trip! @requireAuth
  }
`

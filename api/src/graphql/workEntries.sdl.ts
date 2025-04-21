export const schema = gql`
  type WorkEntry {
    id: Int!
    user: User!
    userId: Int!
    date: DateTime!
    startTime: DateTime
    endTime: DateTime
    duration: Float!
    rate: Rate!
    rateId: Int!
  }

  type Query {
    workEntries: [WorkEntry!]! @requireAuth
    workEntry(id: Int!): WorkEntry @requireAuth
    workEntriesByUser: [WorkEntry!]! @requireAuth
  }

  input CreateWorkEntryInput {
    date: DateTime!
    startTime: DateTime
    endTime: DateTime
    duration: Float!
    rateId: Int!
  }

  input UpdateWorkEntryInput {
    date: DateTime
    startTime: DateTime
    endTime: DateTime
    duration: Float
    rateId: Int
  }

  type Mutation {
    createWorkEntry(input: CreateWorkEntryInput!): WorkEntry! @requireAuth
    updateWorkEntry(id: Int!, input: UpdateWorkEntryInput!): WorkEntry! @requireAuth
    deleteWorkEntry(id: Int!): WorkEntry! @requireAuth
  }
`

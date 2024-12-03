export const schema = gql`
  type Sector {
    id: Int!
    name: String!
    factor: Float!
    currency: String!
    expenses: [Expense]!
  }

  type Query {
    sectors: [Sector!]! @requireAuth
    sector(id: Int!): Sector @requireAuth
  }

  input CreateSectorInput {
    name: String!
    factor: Float!
    currency: String!
  }

  input UpdateSectorInput {
    name: String
    factor: Float
    currency: String
  }

  type Mutation {
    createSector(input: CreateSectorInput!): Sector! @requireAuth
    updateSector(id: Int!, input: UpdateSectorInput!): Sector! @requireAuth
    deleteSector(id: Int!): Sector! @requireAuth
  }
`

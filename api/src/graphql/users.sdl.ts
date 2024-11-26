export const schema = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    firstName: String
    lastName: String
    isAdmin: Boolean!
    organizationId: Int!
    organization: Organization!
    expenses: [Expense]!
    trips: [Trip]!
    projects: [Project]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    username: String!
    email: String!
    firstName: String
    lastName: String
    bankAccount: String
    organizationId: Int!
    roleId: Int!
  }

  input UpdateUserInput {
    username: String
    email: String
    firstName: String
    lastName: String
    bankAccount: String
    organizationId: Int
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`

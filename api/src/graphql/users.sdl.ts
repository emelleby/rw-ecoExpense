export const schema = gql`
  type User {
    id: Int!
    clerkId: String
    username: String!
    email: String!
    firstName: String
    lastName: String
    bankAccount: String
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
    clerkId: String
    username: String!
    email: String!
    firstName: String
    lastName: String
    bankAccount: String
    organizationId: Int!
  }

  input UpdateUserInput {
    clerkId: String
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
    updateUserRole(id: String!, role: String!, organizationId: Int!): User!
      @skipAuth
  }
`

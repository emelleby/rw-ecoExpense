export const schema = gql`
  enum USER_STATUS {
    ACTIVE
    INACTIVE
  }

  type User {
    id: Int!
    clerkId: String
    username: String!
    email: String!
    firstName: String
    lastName: String
    status: USER_STATUS!
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
    # This line has been added to support updating user roles
    updateUserRole(id: String!, role: String!, organizationId: Int!): User!
      @skipAuth
  }
`

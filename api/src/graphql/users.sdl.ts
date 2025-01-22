export const schema = gql`
  type User {
    id: Int!
    clerkId: String
    username: String!
    email: String!
    firstName: String
    lastName: String
    bankAccount: String
    status: USER_STATUS!
    organizationId: Int!
    organization: Organization!
    expenses: [Expense]!
    trips: [Trip]!
    projects: [Project]!
  }

  enum USER_STATUS {
    ACTIVE
    INACTIVE
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
    usersByOrganization(organizationId: Int!): [User!]! @requireAuth
  }

  input CreateUserInput {
    clerkId: String
    username: String!
    email: String!
    firstName: String
    lastName: String
    bankAccount: String
    status: USER_STATUS!
    organizationId: Int!
  }

  input UpdateUserInput {
    clerkId: String
    username: String
    email: String
    firstName: String
    lastName: String
    bankAccount: String
    status: USER_STATUS
    organizationId: Int
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
    updateUserStatus(id: Int): User! @requireAuth
    updateUserRole(id: String!, role: String!, organizationId: Int!): User!
      @skipAuth
  }
`

export const schema = gql`
  type Task {
    id: Int!
    title: String!
    description: String!
    details: String!
    testStrategy: String!
    priority: String!
    dependencies: [Int!]!
    status: String!
    subtasks: [String!]!
    isFromFallback: Boolean
  }

  type Query {
    tasks: [Task!]! @requireAuth(roles: ["superuser"])
  }
`

export const schema = gql`
  type Project {
    id: Int!
    name: String!
    description: String
    active: Boolean!
    organizationId: Int
    organization: Organization
    createdById: Int
    createdBy: User
    expenses: [Expense]!
    trips: [Trip]!
    createdAt: DateTime!
  }

  type Query {
    projects(take: Int): [Project!]! @requireAuth
    project(id: Int!): Project @requireAuth
  }

  input CreateProjectInput {
    name: String!
    description: String
    active: Boolean!
    organizationId: Int
    createdById: Int
  }

  input UpdateProjectInput {
    name: String
    description: String
    active: Boolean
    organizationId: Int
    createdById: Int
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project! @requireAuth
    updateProject(id: Int!, input: UpdateProjectInput!): Project! @requireAuth
    deleteProject(id: Int!): Project! @requireAuth
  }
`

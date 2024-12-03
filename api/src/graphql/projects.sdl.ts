export const schema = gql`
  type Project {
    id: Int!
    name: String!
    description: String
    userId: Int!
    user: User!
    expenses: [Expense]!
  }

  type Query {
    projects: [Project!]! @requireAuth
    project(id: Int!): Project @requireAuth
    projectsByUser: [Project!]! @requireAuth
  }

  input CreateProjectInput {
    name: String!
    description: String
    userId: Int!
  }

  input UpdateProjectInput {
    name: String
    description: String
    userId: Int
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project! @requireAuth
    updateProject(id: Int!, input: UpdateProjectInput!): Project! @requireAuth
    deleteProject(id: Int!): Project! @requireAuth
  }
`

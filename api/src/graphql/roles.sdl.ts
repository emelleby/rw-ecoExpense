export const schema = gql`
  type Role {
    id: Int!
    name: String!
    organizationId: Int!
    organization: Organization!
    users: [User]!
  }

  type Query {
    roles: [Role!]! @requireAuth
    role(id: Int!): Role @requireAuth
  }

  input CreateRoleInput {
    name: String!
    organizationId: Int!
  }

  input UpdateRoleInput {
    name: String
    organizationId: Int
  }

  type Mutation {
    createRole(input: CreateRoleInput!): Role! @requireAuth
    updateRole(id: Int!, input: UpdateRoleInput!): Role! @requireAuth
    deleteRole(id: Int!): Role! @requireAuth
  }
`

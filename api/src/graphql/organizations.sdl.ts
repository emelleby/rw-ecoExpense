export const schema = gql`
  type Organization {
    id: Int!
    regnr: String!
    name: String!
    description: String
    createdAt: DateTime!
    users: [User]!
    roles: [Role]!
    suppliers: [Supplier]!
  }

  type Query {
    organizations: [Organization!]! @requireAuth
    organization(id: Int!): Organization @requireAuth
  }

  input CreateOrganizationInput {
    regnr: String!
    name: String!
    description: String
  }

  input UpdateOrganizationInput {
    regnr: String
    name: String
    description: String
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization!
      @requireAuth
    updateOrganization(
      id: Int!
      input: UpdateOrganizationInput!
    ): Organization! @requireAuth
    deleteOrganization(id: Int!): Organization! @requireAuth
  }
`

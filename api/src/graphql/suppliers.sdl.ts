export const schema = gql`
  type Supplier {
    id: Int!
    name: String!
    contact: String
    organizationId: Int!
    organization: Organization!
    expenses: [Expense]!
  }

  type Query {
    suppliers: [Supplier!]! @requireAuth
    supplier(id: Int!): Supplier @requireAuth
  }

  input CreateSupplierInput {
    name: String!
    contact: String
    organizationId: Int!
  }

  input UpdateSupplierInput {
    name: String
    contact: String
    organizationId: Int
  }

  type Mutation {
    createSupplier(input: CreateSupplierInput!): Supplier! @requireAuth
    updateSupplier(id: Int!, input: UpdateSupplierInput!): Supplier!
      @requireAuth
    deleteSupplier(id: Int!): Supplier! @requireAuth
  }
`

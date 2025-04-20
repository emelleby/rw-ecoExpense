export const schema = gql`
  type Customer {
    id: Int!
    user: User!
    userId: Int!
    name: String!
    rates: [Rate!]!
  }

  type Query {
    customers: [Customer!]! @requireAuth
    customer(id: Int!): Customer @requireAuth
    customersByUser: [Customer!]! @requireAuth
  }

  input CreateCustomerInput {
    name: String!
  }

  input UpdateCustomerInput {
    name: String
  }

  type Mutation {
    createCustomer(input: CreateCustomerInput!): Customer! @requireAuth
    updateCustomer(id: Int!, input: UpdateCustomerInput!): Customer! @requireAuth
    deleteCustomer(id: Int!): Customer! @requireAuth
  }
`

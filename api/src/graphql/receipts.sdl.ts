export const schema = gql`
  type Receipt {
    id: Int!
    url: String!
    fileName: String!
    fileType: String!
    expenseId: Int!
    expense: Expense!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    receipts: [Receipt!]! @requireAuth
    receipt(id: Int!): Receipt @requireAuth
  }

  input CreateReceiptInput {
    url: String!
    fileName: String!
    fileType: String!
    expenseId: Int!
  }

  input UpdateReceiptInput {
    url: String
    fileName: String
    fileType: String
    expenseId: Int
  }

  type Mutation {
    createReceipt(input: CreateReceiptInput!): Receipt! @requireAuth
    updateReceipt(id: Int!, input: UpdateReceiptInput!): Receipt! @requireAuth
    deleteReceipt(id: Int!): Receipt! @requireAuth
  }
`

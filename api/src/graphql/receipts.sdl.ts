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
    receipts: [Receipt!]! @skipAuth
    receipt(id: Int!): Receipt @skipAuth
  }
  type DeleteReceiptResult {
    id: Int
    success: Boolean
  }

  type UploadUrlResult {
    uploadUrl: String!
    fileUrl: String!
    fileName: String!
  }

  input ReceiptInput {
    url: String!
    fileName: String!
    fileType: String!
  }

  type Mutation {
    createReceipt(input: ReceiptInput!): Receipt! @requireAuth
    updateReceipt(id: Int!, input: ReceiptInput!): Receipt! @requireAuth
    deleteReceipt(id: Int!, url: String!): DeleteReceiptResult! @requireAuth
    createUploadUrl(contentType: String!): UploadUrlResult! @requireAuth
  }
`

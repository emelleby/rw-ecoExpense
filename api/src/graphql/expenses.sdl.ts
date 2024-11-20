export const schema = gql`
  type Expense {
    id: Int!
    amount: Float!
    currency: String!
    exchangeRate: Float!
    nokAmount: Float!
    date: DateTime!
    description: String
    supplierId: Int!
    supplier: Supplier!
    tripId: Int
    trip: Trip
    projectId: Int
    project: Project
    categoryId: Int!
    category: ExpenseCategory!
    userId: Int!
    user: User!
    receiptFilename: String
    receiptPath: String
    receiptUploadedAt: DateTime
    kilometers: Float!
    fuelType: String!
    fuelAmountLiters: Float!
    scope1Co2Emissions: Float!
    scope3Co2Emissions: Float!
    kwh: Float!
  }

  type Query {
    expenses: [Expense!]! @requireAuth
    expense(id: Int!): Expense @requireAuth
  }

  input CreateExpenseInput {
    amount: Float!
    currency: String!
    exchangeRate: Float!
    nokAmount: Float!
    date: DateTime!
    description: String
    supplierId: Int!
    tripId: Int
    projectId: Int
    categoryId: Int!
    userId: Int!
    receiptFilename: String
    receiptPath: String
    receiptUploadedAt: DateTime
    kilometers: Float!
    fuelType: String!
    fuelAmountLiters: Float!
    scope1Co2Emissions: Float!
    scope3Co2Emissions: Float!
    kwh: Float!
  }

  input UpdateExpenseInput {
    amount: Float
    currency: String
    exchangeRate: Float
    nokAmount: Float
    date: DateTime
    description: String
    supplierId: Int
    tripId: Int
    projectId: Int
    categoryId: Int
    userId: Int
    receiptFilename: String
    receiptPath: String
    receiptUploadedAt: DateTime
    kilometers: Float
    fuelType: String
    fuelAmountLiters: Float
    scope1Co2Emissions: Float
    scope3Co2Emissions: Float
    kwh: Float
  }

  type Mutation {
    createExpense(input: CreateExpenseInput!): Expense! @requireAuth
    updateExpense(id: Int!, input: UpdateExpenseInput!): Expense! @requireAuth
    deleteExpense(id: Int!): Expense! @requireAuth
  }
`

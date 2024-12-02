export const schema = gql`
  type Expense {
    id: Int!
    categoryId: Int!
    category: ExpenseCategory!
    amount: Float!
    currency: String!
    exchangeRate: Float!
    nokAmount: Float!
    date: DateTime!
    description: String
    kilometers: Float!
    fuelType: String!
    fuelAmountLiters: Float!
    sectorId: Int
    Sector: Sector
    supplierId: Int
    supplier: Supplier
    tripId: Int!
    trip: Trip!
    projectId: Int
    project: Project
    userId: Int!
    user: User!
    receiptFilename: String
    receiptPath: String
    receiptUploadedAt: DateTime
    scope1Co2Emissions: Float!
    scope2Co2Emissions: Float!
    scope3Co2Emissions: Float!
    kwh: Float!
    scope3CategoryId: Int!
  }

  type Query {
    expenses: [Expense!]! @requireAuth
    expense(id: Int!): Expense @requireAuth
  }

  input CreateExpenseInput {
    categoryId: Int!
    amount: Float!
    currency: String!
    exchangeRate: Float!
    nokAmount: Float!
    date: DateTime!
    description: String
    kilometers: Float!
    fuelType: String!
    fuelAmountLiters: Float!
    sectorId: Int
    supplierId: Int
    tripId: Int!
    projectId: Int
    userId: Int!
    receiptFilename: String
    receiptPath: String
    receiptUploadedAt: DateTime
    scope1Co2Emissions: Float!
    scope2Co2Emissions: Float!
    scope3Co2Emissions: Float!
    kwh: Float!
    scope3CategoryId: Int!
  }

  input UpdateExpenseInput {
    categoryId: Int
    amount: Float
    currency: String
    exchangeRate: Float
    nokAmount: Float
    date: DateTime
    description: String
    kilometers: Float
    fuelType: String
    fuelAmountLiters: Float
    sectorId: Int
    supplierId: Int
    tripId: Int
    projectId: Int
    userId: Int
    receiptFilename: String
    receiptPath: String
    receiptUploadedAt: DateTime
    scope1Co2Emissions: Float
    scope2Co2Emissions: Float
    scope3Co2Emissions: Float
    kwh: Float
    scope3CategoryId: Int
  }

  type Mutation {
    createExpense(input: CreateExpenseInput!): Expense! @requireAuth
    updateExpense(id: Int!, input: UpdateExpenseInput!): Expense! @requireAuth
    deleteExpense(id: Int!): Expense! @requireAuth
  }
`

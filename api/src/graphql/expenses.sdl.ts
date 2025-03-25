export const schema = gql`
  type ExpenseValidationError {
    message: String!
  }

  union ExpenseResult = Expense | ExpenseValidationError

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
    scope1Co2Emissions: Float!
    scope2Co2Emissions: Float!
    scope3Co2Emissions: Float!
    kwh: Float!
    scope3CategoryId: Int!
    receipt: Receipt
  }

  type Query {
    expenses: [Expense!]! @skipAuth
    expense(id: Int!): Expense @skipAuth
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
    scope1Co2Emissions: Float!
    scope2Co2Emissions: Float!
    scope3Co2Emissions: Float!
    kwh: Float!
    scope3CategoryId: Int!
    receipt: ReceiptInput
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
    scope1Co2Emissions: Float
    scope2Co2Emissions: Float
    scope3Co2Emissions: Float
    kwh: Float
    scope3CategoryId: Int
    receipt: ReceiptInput
  }

  type Mutation {
    createExpense(input: CreateExpenseInput!): Expense! @skipAuth
    updateExpense(id: Int!, input: UpdateExpenseInput!): ExpenseResult!
      @requireAuth
    deleteExpense(id: Int!): ExpenseResult! @requireAuth
  }
`

export const schema = gql`
  type ExpenseCategory {
    id: Int!
    name: String!
    expenses: [Expense]!
  }

  type Query {
    expenseCategories: [ExpenseCategory!]! @requireAuth
    expenseCategory(id: Int!): ExpenseCategory @requireAuth
  }

  input CreateExpenseCategoryInput {
    name: String!
  }

  input UpdateExpenseCategoryInput {
    name: String
  }

  type Mutation {
    createExpenseCategory(input: CreateExpenseCategoryInput!): ExpenseCategory!
      @requireAuth
    updateExpenseCategory(
      id: Int!
      input: UpdateExpenseCategoryInput!
    ): ExpenseCategory! @requireAuth
    deleteExpenseCategory(id: Int!): ExpenseCategory! @requireAuth
  }
`

export const schema = gql`
  type DashboardExpensePending {
    amount: Float!
    count: Int!
  }

  type DashboardRecentExpense {
    id: Int!
    type: String!
    project: String
    trip: String
    amount: Float!
    status: String!
  }

  type DashboardExpenses {
    total: Float!
    percentageChange: Float!
    pending: DashboardExpensePending!
    recent: [DashboardRecentExpense!]!
  }

  type CarbonCategory {
    category: String!
    amount: Float!
    unit: String!
  }

  type CarbonFootprint {
    total: Float!
    percentageChange: Float!
    byCategory: [CarbonCategory!]!
  }

  type DashboardData {
    expenses: DashboardExpenses!
    carbonFootprint: CarbonFootprint!
  }

  type Query {
    dashboard: DashboardData! @requireAuth
  }
`

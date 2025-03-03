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
    percentageChange: Float
    pending: DashboardExpensePending!
  }

  type CarbonCategory {
    category: String!
    amount: Float!
    unit: String!
  }

  type CarbonFootprint {
    total: Float!
    percentageChange: Float
    byCategory: [CarbonCategory!]!
  }

  type RecentTrip {
    id: Int!
    name: String!
    description: String!
    project: String
    reimbursementStatus: String!
    expenseCount: Int!
    expenseAmount: Float!
  }

  type DashboardData {
    expenses: DashboardExpenses!
    trips: [RecentTrip!]!
    carbonFootprint: CarbonFootprint!
  }

  type Query {
    dashboard: DashboardData! @requireAuth
  }
`

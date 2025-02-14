interface DashboardData {
  dashboard: {
    expenses: {
      total: number
      percentageChange: number
      pending: {
        amount: number
        count: number
      }
      recent: Array<{
        id: number
        type: string
        project?: string
        trip?: string
        amount: number
        status: string
      }>
    }
    carbonFootprint: {
      total: number
      percentageChange: number
      byCategory: Array<{
        category: string
        amount: number
        unit: string
      }>
    }
  }
}

export const standard = (): DashboardData => ({
  dashboard: {
    expenses: {
      total: 4280.5,
      percentageChange: 12.5,
      pending: {
        amount: 1850.0,
        count: 8,
      },
      recent: [
        {
          id: 1,
          type: 'Business Lunch',
          project: 'Marketing Campaign',
          amount: 85.0,
          status: 'REIMBURSED',
        },
        {
          id: 2,
          type: 'Train Ticket',
          trip: 'Client Meeting - Berlin',
          amount: 125.5,
          status: 'PENDING',
        },
        {
          id: 3,
          type: 'Hotel Stay',
          trip: 'Sales Conference',
          amount: 420.0,
          status: 'REJECTED',
        },
      ],
    },
    carbonFootprint: {
      total: 245,
      percentageChange: 8.3,
      byCategory: [
        {
          category: 'Transportation',
          amount: 156,
          unit: 'kg CO2',
        },
        {
          category: 'Accommodation',
          amount: 52,
          unit: 'kg CO2',
        },
        {
          category: 'Meals',
          amount: 37,
          unit: 'kg CO2',
        },
      ],
    },
  },
})

export const empty = () => ({
  dashboard: {
    expenses: {
      total: 0,
      percentageChange: 0,
      pending: {
        amount: 0,
        count: 0,
      },
      recent: [],
    },
    carbonFootprint: {
      total: 0,
      percentageChange: 0,
      byCategory: [],
    },
  },
})

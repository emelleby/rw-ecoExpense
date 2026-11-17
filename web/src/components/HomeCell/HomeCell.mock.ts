interface DashboardData {
  dashboard: {
    expenses: {
      total: number
      percentageChange: number | null
      pending: {
        amount: number
        count: number
      }
    }
    trips: Array<{
      id: number
      name: string
      description: string
      project?: string
      reimbursementStatus: string
      expenseCount: number
      expenseAmount: number
      emissions: number
      startDate: string
      endDate: string
    }>
    carbonFootprint: {
      total: number
      percentageChange: number | null
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
    },
    trips: [
      {
        id: 1,
        name: 'Client Meeting - Berlin',
        description: 'Quarterly review with the Berlin team',
        project: 'Marketing Campaign',
        reimbursementStatus: 'PENDING',
        expenseCount: 4,
        expenseAmount: 3200,
        emissions: 156,
        startDate: '2026-03-01T00:00:00.000Z',
        endDate: '2026-03-03T00:00:00.000Z',
      },
      {
        id: 2,
        name: 'Sales Conference',
        description: '',
        reimbursementStatus: 'REIMBURSED',
        expenseCount: 2,
        expenseAmount: 1080.5,
        emissions: 89,
        startDate: '2026-02-10T00:00:00.000Z',
        endDate: '2026-02-12T00:00:00.000Z',
      },
    ],
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

export const empty = (): DashboardData => ({
  dashboard: {
    expenses: {
      total: 0,
      percentageChange: 0,
      pending: {
        amount: 0,
        count: 0,
      },
    },
    trips: [],
    carbonFootprint: {
      total: 0,
      percentageChange: 0,
      byCategory: [],
    },
  },
})

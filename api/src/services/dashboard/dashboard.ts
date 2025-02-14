import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const dashboard: QueryResolvers['dashboard'] = async () => {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
  const startOfLastMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1
  )

  // Get total expenses and calculate percentage change
  const currentMonthExpenses = await db.expense.aggregate({
    _sum: {
      nokAmount: true,
    },
    where: {
      date: {
        gte: startOfMonth,
      },
    },
  })

  const lastMonthExpenses = await db.expense.aggregate({
    _sum: {
      nokAmount: true,
    },
    where: {
      date: {
        gte: startOfLastMonth,
        lt: startOfMonth,
      },
    },
  })

  const total = Number(currentMonthExpenses._sum.nokAmount || 0)
  const lastMonthTotal = Number(lastMonthExpenses._sum.nokAmount || 0)
  const percentageChange = lastMonthTotal
    ? ((total - lastMonthTotal) / lastMonthTotal) * 100
    : 0

  // Get pending expenses from trips
  const pendingTrips = await db.trip.findMany({
    where: {
      reimbursementStatus: 'PENDING',
    },
    include: {
      Expense: {
        select: {
          nokAmount: true,
        },
      },
    },
  })

  const pendingTotal = pendingTrips.reduce(
    (sum, trip) =>
      sum +
      trip.Expense.reduce((expSum, exp) => expSum + Number(exp.nokAmount), 0),
    0
  )

  // Get recent expenses
  const recentExpenses = await db.expense.findMany({
    take: 5,
    orderBy: {
      date: 'desc',
    },
    include: {
      category: true,
      Project: true,
      Trip: true,
    },
  })

  // Calculate carbon footprint
  const carbonData = await db.expense.groupBy({
    by: ['scope3CategoryId'],
    _sum: {
      scope1Co2Emissions: true,
      scope2Co2Emissions: true,
      scope3Co2Emissions: true,
    },
  })

  const totalCarbon = carbonData.reduce(
    (sum, data) =>
      sum +
      (data._sum.scope1Co2Emissions || 0) +
      (data._sum.scope2Co2Emissions || 0) +
      (data._sum.scope3Co2Emissions || 0),
    0
  )

  // Mock carbon percentage change for now
  const carbonPercentageChange = 8.3

  return {
    expenses: {
      total,
      percentageChange,
      pending: {
        amount: pendingTotal,
        count: pendingTrips.length,
      },
      recent: recentExpenses.map((expense) => ({
        id: expense.id,
        type: expense.category.name,
        project: expense.Project?.name,
        trip: expense.Trip?.description,
        amount: Number(expense.nokAmount),
        status: expense.Trip?.reimbursementStatus || 'NOT_REQUESTED',
      })),
    },
    carbonFootprint: {
      total: Math.round(totalCarbon),
      percentageChange: carbonPercentageChange,
      byCategory: [
        {
          category: 'Transportation',
          amount: Math.round(totalCarbon * 0.6), // 60% of total for demo
          unit: 'kg CO2',
        },
        {
          category: 'Accommodation',
          amount: Math.round(totalCarbon * 0.25), // 25% of total for demo
          unit: 'kg CO2',
        },
        {
          category: 'Meals',
          amount: Math.round(totalCarbon * 0.15), // 15% of total for demo
          unit: 'kg CO2',
        },
      ],
    },
  }
}

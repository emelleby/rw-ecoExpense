import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const dashboard: QueryResolvers['dashboard'] = async () => {
  if (!context.currentUser?.dbUserId) {
    throw new Error('User not authenticated')
  }

  const startOfYear = new Date(new Date().getFullYear(), 0, 1)
  const today = new Date()

  // Get total expenses and emissions for current user and current year
  const currentYearExpenses = await db.expense.aggregate({
    _sum: {
      nokAmount: true,
      scope1Co2Emissions: true,
      scope2Co2Emissions: true,
      scope3Co2Emissions: true,
    },
    where: {
      date: {
        gte: startOfYear,
      },
      userId: context.currentUser.dbUserId,
    },
  })

  // Set dates for last year
  const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1)
  const lastYearToday = new Date(
    new Date().getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  )

  // Get total expenses for current user and last year
  const lastYearExpenses = await db.expense.aggregate({
    _sum: {
      nokAmount: true,
    },
    where: {
      date: {
        gte: lastYearStart,
        lte: lastYearToday,
      },
      userId: context.currentUser.dbUserId,
    },
  })

  // Calculate percentage change from same period last year
  const total = Number(currentYearExpenses._sum.nokAmount || 0)
  const lastYearTotal = Number(lastYearExpenses._sum.nokAmount || 0)

  const percentageChange = lastYearTotal
    ? ((total - lastYearTotal) / lastYearTotal) * 100
    : undefined

  console.log('Raw expense values:', {
    currentYearTotal: total,
    lastYearTotal: lastYearTotal,
    percentageChange:
      percentageChange !== undefined
        ? percentageChange.toFixed(1) + '%'
        : 'No last year data',
  })

  console.log('Expense Calculation:', {
    currentYear: {
      total,
      startDate: startOfYear.toISOString(),
      endDate: today.toISOString(),
    },
    lastYear: {
      total: lastYearTotal,
      startDate: lastYearStart.toISOString(),
      endDate: lastYearToday.toISOString(),
    },
    percentageChange: `${percentageChange.toFixed(1)}%`,
    calculation: lastYearTotal
      ? `((${total} - ${lastYearTotal}) / ${lastYearTotal}) * 100`
      : 'No last year data (defaulting to 0%)',
  })

  // Calculate percentage change from same period last year
  const lastYearEmissions = await db.expense.aggregate({
    where: {
      userId: context.currentUser.dbUserId,
      date: {
        gte: lastYearStart,
        lte: lastYearToday,
      },
    },
    _sum: {
      scope1Co2Emissions: true,
      scope2Co2Emissions: true,
      scope3Co2Emissions: true,
    },
  })

  // Calculate carbon emissions
  const currentYearCarbonTotal =
    (currentYearExpenses._sum.scope1Co2Emissions || 0) +
    (currentYearExpenses._sum.scope2Co2Emissions || 0) +
    (currentYearExpenses._sum.scope3Co2Emissions || 0)

  const lastYearCarbonTotal =
    (lastYearEmissions._sum.scope1Co2Emissions || 0) +
    (lastYearEmissions._sum.scope2Co2Emissions || 0) +
    (lastYearEmissions._sum.scope3Co2Emissions || 0)

  const carbonPercentageChange = lastYearCarbonTotal
    ? ((currentYearCarbonTotal - lastYearCarbonTotal) / lastYearCarbonTotal) *
      100
    : undefined

  console.log('Raw carbon values:', {
    currentYearTotal: currentYearCarbonTotal,
    lastYearTotal: lastYearCarbonTotal,
    percentageChange:
      carbonPercentageChange !== undefined
        ? carbonPercentageChange.toFixed(1) + '%'
        : 'No last year data',
  })

  // Log detailed calculations for debugging
  console.log({
    expenses: {
      currentYear: {
        total,
        startDate: startOfYear.toISOString(),
        endDate: today.toISOString(),
      },
      lastYear: {
        total: lastYearTotal,
        startDate: lastYearStart.toISOString(),
        endDate: lastYearToday.toISOString(),
      },
      percentageChange:
        percentageChange !== undefined
          ? `${percentageChange.toFixed(1)}%`
          : 'No comparison available',
      calculation: lastYearTotal
        ? `((${total} - ${lastYearTotal}) / ${lastYearTotal}) * 100`
        : 'No last year data',
    },
    carbonEmissions: {
      currentYear: {
        total: currentYearCarbonTotal,
        scope1: currentYearExpenses._sum.scope1Co2Emissions || 0,
        scope2: currentYearExpenses._sum.scope2Co2Emissions || 0,
        scope3: currentYearExpenses._sum.scope3Co2Emissions || 0,
        startDate: startOfYear.toISOString(),
        endDate: today.toISOString(),
      },
      lastYear: {
        total: lastYearCarbonTotal,
        scope1: lastYearEmissions._sum.scope1Co2Emissions || 0,
        scope2: lastYearEmissions._sum.scope2Co2Emissions || 0,
        scope3: lastYearEmissions._sum.scope3Co2Emissions || 0,
        startDate: lastYearStart.toISOString(),
        endDate: lastYearToday.toISOString(),
      },
      percentageChange:
        carbonPercentageChange !== undefined
          ? `${carbonPercentageChange.toFixed(1)}%`
          : 'No comparison available',
      calculation: lastYearCarbonTotal
        ? `((${currentYearCarbonTotal} - ${lastYearCarbonTotal}) / ${lastYearCarbonTotal}) * 100`
        : 'No last year data',
    },
  })

  // Get all expenses for the user grouped by category with their emissions
  const expensesByCategory = await db.expense.findMany({
    where: {
      userId: context.currentUser.dbUserId,
    },
    include: {
      category: true,
    },
  })

  // Group expenses by category and calculate total emissions
  const categoryEmissions = expensesByCategory.reduce(
    (acc, expense) => {
      const categoryName = expense.category.name
      const totalEmissions =
        (expense.scope1Co2Emissions || 0) +
        (expense.scope2Co2Emissions || 0) +
        (expense.scope3Co2Emissions || 0)

      if (!acc[categoryName]) {
        acc[categoryName] = 0
      }
      acc[categoryName] += totalEmissions

      return acc
    },
    {} as Record<string, number>
  )

  // Calculate total emissions for display
  const totalCarbon = Object.values(categoryEmissions).reduce(
    (sum, amount) => sum + amount,
    0
  )

  // Get pending trips
  const pendingTrips = await db.trip.findMany({
    where: {
      reimbursementStatus: 'PENDING',
      userId: context.currentUser.dbUserId,
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

  // Get recent trips for current user
  const recentTrips = await db.trip.findMany({
    take: 5,
    orderBy: { startDate: 'desc' },
    where: {
      userId: context.currentUser.dbUserId,
    },
    include: {
      Project: true,
      Expense: {
        select: {
          nokAmount: true,
          scope1Co2Emissions: true,
          scope2Co2Emissions: true,
          scope3Co2Emissions: true,
        },
      },
    },
  })

  // console.log(
  //   'Recent Trips Query Result:',
  //   JSON.stringify(recentTrips, null, 2)
  // )

  return {
    expenses: {
      total,
      percentageChange,
      pending: {
        amount: pendingTotal,
        count: pendingTrips.length,
      },
    },
    trips: recentTrips.map((trip) => {
      // Calculate total emissions for this trip
      const tripEmissions = trip.Expense.reduce((sum, expense) => {
        return sum + (
          (expense.scope1Co2Emissions || 0) +
          (expense.scope2Co2Emissions || 0) +
          (expense.scope3Co2Emissions || 0)
        );
      }, 0);

      return {
        id: trip.id,
        name: trip.name,
        description: trip.description,
        project: trip.Project?.name,
        reimbursementStatus: trip.reimbursementStatus,
        expenseCount: trip.Expense.length,
        expenseAmount: trip.Expense.reduce(
          (sum, exp) => sum + Number(exp.nokAmount),
          0
        ),
        emissions: Math.round(tripEmissions),
        startDate: trip.startDate,
        endDate: trip.endDate
      };
    }),
    carbonFootprint: {
      total: Math.round(totalCarbon),
      percentageChange: carbonPercentageChange,
      byCategory: Object.entries(categoryEmissions)
        .filter(([_, amount]) => amount > 0)
        .sort(([_c1, a1], [_c2, a2]) => a2 - a1)
        .map(([category, amount]) => ({
          category,
          amount: Math.round(amount),
          unit: 'kg CO2e',
        })),
    },
  }
}

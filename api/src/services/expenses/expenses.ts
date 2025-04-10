import { ReimbursementStatus } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  ExpenseRelationResolvers,
} from 'types/graphql'

// Define the interface with __typename to match GraphQL union type resolution
interface ExpenseValidationError {
  __typename: 'ExpenseValidationError'
  message: string
}

import { context } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

const validateTripStatus = async (
  tripId: number
): Promise<ExpenseValidationError | null> => {
  const trip = await db.trip.findUnique({
    where: { id: tripId },
    select: { reimbursementStatus: true },
  })

  if (!trip) {
    throw new Error('Trip not found')
  }

  if (
    trip.reimbursementStatus === ReimbursementStatus.PENDING ||
    trip.reimbursementStatus === ReimbursementStatus.REIMBURSED
  ) {
    return {
      __typename: 'ExpenseValidationError',
      message: `Cannot modify expenses for trips that are ${trip.reimbursementStatus.toLowerCase()}`,
    }
  }

  return null
}
// import { context } from '@redwoodjs/graphql-server'

export const expenses: QueryResolvers['expenses'] = () => {
  const currentUser = context.currentUser

  return db.expense.findMany({
    where: {
      userId: currentUser.dbUserId,
    },
    include: {
      Receipt: true,
      Trip: true, // Include the Trip relation
    },
  })
}

export const expense: QueryResolvers['expense'] = ({ id }) => {
  return db.expense.findUnique({
    where: { id },
    include: {
      Receipt: true,
      Trip: true, // Include the Trip relation
    },
  })
}

export const createExpense: MutationResolvers['createExpense'] = async ({
  input,
}) => {
  const currentUser = context.currentUser

  const { receipt, ...expenseData } = input

  const data = {
    ...expenseData,
    userId: currentUser.dbUserId,
    Receipt: receipt
      ? {
          create: receipt, // Use `create` for nested writes
        }
      : undefined,
  }

  logger.debug({
    message: '===== Data being passed to db.expense.create =====',
    data: JSON.stringify(data, null, 2),
    receipt,
    expenseData,
    input,
  })

  return db.expense.create({
    data,
    include: {
      Receipt: true,
    },
  })
}

export const updateExpense: MutationResolvers['updateExpense'] = async ({
  id,
  input,
}) => {
  const expense = await db.expense.findUnique({
    where: { id },
    select: { tripId: true },
  })

  if (!expense) {
    throw new Error('Expense not found')
  }

  const validationError = await validateTripStatus(expense.tripId)
  if (validationError) {
    return validationError
  }

  const { receipt, ...expenseData } = input

  const updatedExpense = await db.expense.update({
    where: { id },
    data: {
      ...expenseData,
      Receipt: receipt
        ? {
            upsert: {
              create: receipt,
              update: receipt,
            },
          }
        : undefined,
    },
    include: {
      Receipt: true,
    },
  })

  return { __typename: 'Expense', ...updatedExpense }
}

export const deleteExpense: MutationResolvers['deleteExpense'] = async ({
  id,
}) => {
  const expense = await db.expense.findUnique({
    where: { id },
    select: { tripId: true },
  })

  if (!expense) {
    throw new Error('Expense not found')
  }

  const validationError = await validateTripStatus(expense.tripId)
  if (validationError) {
    return validationError
  }

  await db.receipt.deleteMany({
    where: { expenseId: id },
  })

  const deletedExpense = await db.expense.delete({
    where: { id },
  })

  return { __typename: 'Expense', ...deletedExpense }
}

export const ExpenseResult = {
  __resolveType(obj: { __typename: string }): string {
    if (obj.__typename === 'ExpenseValidationError') {
      return 'ExpenseValidationError'
    }
    return 'Expense'
  },
}

export const Expense: ExpenseRelationResolvers = {
  category: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).category()
  },
  Sector: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).Sector()
  },
  supplier: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).Supplier()
  },
  trip: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).Trip()
  },
  project: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).Project()
  },
  user: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).User()
  },
  receipt: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).Receipt()
  },
  // Add this resolver
  totalCo2Emissions: (_obj, { root }) => {
    console.log('Calculation of totalCo2Emissions')
    return (
      (root?.scope1Co2Emissions || 0) +
      (root?.scope2Co2Emissions || 0) +
      (root?.scope3Co2Emissions || 0)
    )
  },
}

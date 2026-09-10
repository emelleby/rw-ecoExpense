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

import { getConversionRate } from 'src/lib/currency'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import {
  deleteReceiptObject,
  finalizePendingReceipt,
} from 'src/services/receipts/receipts'

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

/**
 * Convert an expense into the secondary (reimbursement) currency configured on
 * its trip, if any. Converts straight from the expense's own currency at the
 * expense date — the same quote source the form uses for NOK — so there is no
 * double rounding through NOK, and an expense already in the secondary currency
 * converts at exactly 1.
 *
 * The user never sees this figure while entering an expense; it surfaces only
 * on the trip report and trip summary.
 */
const secondaryCurrencyFields = async (
  tripId: number,
  amount: number,
  currency: string,
  date: Date | string
) => {
  const trip = await db.trip.findUnique({
    where: { id: tripId },
    select: { secondaryCurrency: true },
  })

  // No secondary currency (or it was just cleared) — clear any stale values too.
  if (!trip?.secondaryCurrency) {
    return {
      secondaryCurrency: null,
      secondaryExchangeRate: null,
      secondaryAmount: null,
    }
  }

  const rate = await getConversionRate(
    currency,
    trip.secondaryCurrency,
    new Date(date)
  )

  // Unsupported currency or the rate API is down. Touch nothing rather than
  // blocking the save — an expense must never fail to persist over this.
  if (rate === null) return {}

  return {
    secondaryCurrency: trip.secondaryCurrency,
    secondaryExchangeRate: rate,
    secondaryAmount: Number((Number(amount) * rate).toFixed(2)),
  }
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

  // Move freshly uploaded receipts out of the pending prefix (orphan
  // cleanup) and store the permanent URL
  const receiptData = receipt
    ? { ...receipt, url: await finalizePendingReceipt(receipt.url) }
    : undefined

  const data = {
    ...expenseData,
    ...(await secondaryCurrencyFields(
      expenseData.tripId,
      expenseData.amount,
      expenseData.currency,
      expenseData.date
    )),
    userId: currentUser.dbUserId,
    Receipt: receiptData
      ? {
          create: receiptData, // Use `create` for nested writes
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
    // amount/currency/date are needed to re-convert on a partial update
    select: { tripId: true, amount: true, currency: true, date: true },
  })

  if (!expense) {
    throw new Error('Expense not found')
  }

  const validationError = await validateTripStatus(expense.tripId)
  if (validationError) {
    return validationError
  }

  const { receipt, ...expenseData } = input

  const receiptData = receipt
    ? { ...receipt, url: await finalizePendingReceipt(receipt.url) }
    : undefined

  // Fall back to the stored values on a partial update; an expense moved
  // between trips picks up the destination trip's currency.
  const secondary = await secondaryCurrencyFields(
    expenseData.tripId ?? expense.tripId,
    expenseData.amount ?? Number(expense.amount),
    expenseData.currency ?? expense.currency,
    expenseData.date ?? expense.date
  )

  const updatedExpense = await db.expense.update({
    where: { id },
    data: {
      ...expenseData,
      ...secondary,
      Receipt: receiptData
        ? {
            upsert: {
              create: receiptData,
              update: receiptData,
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

  // Delete the stored receipt objects before removing the rows
  const receipts = await db.receipt.findMany({
    where: { expenseId: id },
    select: { url: true },
  })
  for (const { url } of receipts) {
    await deleteReceiptObject(url)
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

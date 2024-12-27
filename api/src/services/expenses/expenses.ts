import type {
  QueryResolvers,
  MutationResolvers,
  ExpenseRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
// import { context } from '@redwoodjs/graphql-server'

export const expenses: QueryResolvers['expenses'] = () => {
  return db.expense.findMany({
    include: {
      receipt: true,
    },
  })
}

export const expense: QueryResolvers['expense'] = ({ id }) => {
  return db.expense.findUnique({
    where: { id },
    include: {
      receipt: true,
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
    ...(receipt && {
      receipt: {
        create: receipt, // Use `create` for nested writes
      },
    }),
  }

  logger.debug({
    message: '===== Data being passed to db.expense.create =====',
    data,
  })

  return db.expense.create({
    data,
  })
}

export const updateExpense: MutationResolvers['updateExpense'] = ({
  id,
  input,
}) => {
  const { receipt, ...expenseData } = input

  return db.expense.update({
    where: { id },
    data: {
      ...expenseData,
      receipt: receipt
        ? {
            upsert: {
              create: receipt,
              update: receipt,
            },
          }
        : undefined,
    },
    include: {
      receipt: true,
    },
  })
}

// export const updateExpense: MutationResolvers['updateExpense'] = ({
//   id,
//   input,
// }) => {
//   const { receipt, ...expenseData } = input

//   return db.expense.update({
//     where: { id },
//     data: {
//       ...expenseData,
//       receipt: receipt
//         ? {
//             update: {
//               url: receipt.url,
//               fileName: receipt.fileName,
//               fileType: receipt.fileType,
//             },
//           }
//         : undefined,
//     },
//   })
// }

export const deleteExpense: MutationResolvers['deleteExpense'] = async ({
  id,
}) => {
  await db.receipt.deleteMany({
    where: { expenseId: id },
  })

  return db.expense.delete({
    where: { id },
  })
}

export const Expense: ExpenseRelationResolvers = {
  category: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).category()
  },
  Sector: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).Sector()
  },
  supplier: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).supplier()
  },
  trip: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).trip()
  },
  project: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).project()
  },
  user: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).user()
  },
  receipt: (_obj, { root }) => {
    return db.expense.findUnique({ where: { id: root?.id } }).receipt()
  },
}

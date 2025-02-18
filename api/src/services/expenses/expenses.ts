import type {
  QueryResolvers,
  MutationResolvers,
  ExpenseRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
// import { context } from '@redwoodjs/graphql-server'

export const expenses: QueryResolvers['expenses'] = () => {
  const currentUser = context.currentUser

  return db.expense.findMany({
    where: {
      userId: currentUser.dbUserId,
    },
    include: {
      Receipt: true,
    },
  })
}

export const expense: QueryResolvers['expense'] = ({ id }) => {
  return db.expense.findUnique({
    where: { id },
    include: {
      Receipt: true,
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
    data: JSON.stringify(data, null, 2),
    receipt,
    expenseData,
    input,
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
}

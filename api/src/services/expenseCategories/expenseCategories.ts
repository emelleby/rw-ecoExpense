import type {
  QueryResolvers,
  MutationResolvers,
  ExpenseCategoryRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const expenseCategories: QueryResolvers['expenseCategories'] = () => {
  return db.expenseCategory.findMany()
}

export const expenseCategory: QueryResolvers['expenseCategory'] = ({ id }) => {
  return db.expenseCategory.findUnique({
    where: { id },
  })
}

export const createExpenseCategory: MutationResolvers['createExpenseCategory'] =
  ({ input }) => {
    return db.expenseCategory.create({
      data: input,
    })
  }

export const updateExpenseCategory: MutationResolvers['updateExpenseCategory'] =
  ({ id, input }) => {
    return db.expenseCategory.update({
      data: input,
      where: { id },
    })
  }

export const deleteExpenseCategory: MutationResolvers['deleteExpenseCategory'] =
  ({ id }) => {
    return db.expenseCategory.delete({
      where: { id },
    })
  }

export const ExpenseCategory: ExpenseCategoryRelationResolvers = {
  expenses: (_obj, { root }) => {
    return db.expenseCategory.findUnique({ where: { id: root?.id } }).expenses()
  },
}

import type {
  QueryResolvers,
  MutationResolvers,
  ExpenseRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const expenses: QueryResolvers['expenses'] = () => {
  return db.expense.findMany()
}

export const expense: QueryResolvers['expense'] = ({ id }) => {
  return db.expense.findUnique({
    where: { id },
  })
}

export const createExpense: MutationResolvers['createExpense'] = ({
  input,
}) => {
  return db.expense.create({
    data: input,
  })
}

export const updateExpense: MutationResolvers['updateExpense'] = ({
  id,
  input,
}) => {
  return db.expense.update({
    data: input,
    where: { id },
  })
}

export const deleteExpense: MutationResolvers['deleteExpense'] = ({ id }) => {
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
}

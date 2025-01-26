import type {
  QueryResolvers,
  MutationResolvers,
  SupplierRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const suppliers: QueryResolvers['suppliers'] = () => {
  return db.supplier.findMany()
}

export const supplier: QueryResolvers['supplier'] = ({ id }) => {
  return db.supplier.findUnique({
    where: { id },
  })
}

export const createSupplier: MutationResolvers['createSupplier'] = ({
  input,
}) => {
  return db.supplier.create({
    data: input,
  })
}

export const updateSupplier: MutationResolvers['updateSupplier'] = ({
  id,
  input,
}) => {
  return db.supplier.update({
    data: input,
    where: { id },
  })
}

export const deleteSupplier: MutationResolvers['deleteSupplier'] = ({ id }) => {
  return db.supplier.delete({
    where: { id },
  })
}

export const Supplier: SupplierRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.supplier.findUnique({ where: { id: root?.id } }).organization()
  },
  expenses: (_obj, { root }) => {
    return db.supplier.findUnique({ where: { id: root?.id } }).Expense()
  },
}

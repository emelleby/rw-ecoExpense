import type {
  QueryResolvers,
  MutationResolvers,
  CustomerRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const customers: QueryResolvers['customers'] = () => {
  return db.customer.findMany()
}

export const customersByUser: QueryResolvers['customersByUser'] = () => {
  const currentUser = context.currentUser
  
  return db.customer.findMany({
    where: { userId: currentUser.dbUserId },
  })
}

export const customer: QueryResolvers['customer'] = ({ id }) => {
  return db.customer.findUnique({
    where: { id },
  })
}

export const createCustomer: MutationResolvers['createCustomer'] = ({
  input,
}) => {
  const currentUser = context.currentUser
  
  return db.customer.create({
    data: {
      ...input,
      userId: currentUser.dbUserId,
    },
  })
}

export const updateCustomer: MutationResolvers['updateCustomer'] = ({
  id,
  input,
}) => {
  return db.customer.update({
    data: input,
    where: { id },
  })
}

export const deleteCustomer: MutationResolvers['deleteCustomer'] = ({ id }) => {
  return db.customer.delete({
    where: { id },
  })
}

export const Customer: CustomerRelationResolvers = {
  user: (_obj, { root }) => {
    return db.customer.findUnique({ where: { id: root?.id } }).user()
  },
  rates: (_obj, { root }) => {
    return db.customer.findUnique({ where: { id: root?.id } }).rates()
  },
}

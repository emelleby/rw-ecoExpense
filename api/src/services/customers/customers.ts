import type {
  QueryResolvers,
  MutationResolvers,
  CustomerRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

// Customer belongs to an Organization, not a User — scope through the user's org.
// The guard matters: `some: { id: undefined }` matches every org, not none.
const ownOrg = () => {
  const dbUserId = context.currentUser?.dbUserId
  if (!dbUserId) throw new Error('No database user for the current session')
  return { organization: { User: { some: { id: dbUserId } } } }
}

export const customers: QueryResolvers['customers'] = () => {
  return db.customer.findMany({ where: ownOrg() })
}

export const customersByUser: QueryResolvers['customersByUser'] = () => {
  return db.customer.findMany({ where: ownOrg() })
}

export const customer: QueryResolvers['customer'] = ({ id }) => {
  return db.customer.findUnique({
    where: { id },
  })
}

export const createCustomer: MutationResolvers['createCustomer'] = async ({
  input,
}) => {
  const { organizationId } = await db.user.findUniqueOrThrow({
    where: { id: context.currentUser.dbUserId },
    select: { organizationId: true },
  })

  return db.customer.create({ data: { ...input, organizationId } })
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
  rates: (_obj, { root }) => {
    return db.customer.findUnique({ where: { id: root?.id } }).rates()
  },
}

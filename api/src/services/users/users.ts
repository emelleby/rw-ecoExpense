import { clerkClient } from '@clerk/express'
import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const usersByOrganization: QueryResolvers['usersByOrganization'] = ({
  organizationId,
}) => {
  return db.user.findMany({
    where: { organizationId },
  })
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const updateUserStatus: MutationResolvers['updateUserStatus'] = async ({
  id,
}) => {
  const user = await db.user.update({
    data: { status: 'ACTIVE' },
    where: { id },
  })
  return user
}

// This code block has been added to support updating user roles. /services/users/users.ts
export const updateUserRole: MutationResolvers['updateUserRole'] = async ({
  id,
  role,
  organizationId,
}) => {
  // Update Clerk user metadata
  await clerkClient.users.updateUser(id, {
    publicMetadata: {
      roles: role,
      organizationId,
    },
  })

  // Find and return existing user
  const user = await db.user.findUnique({
    where: { clerkId: id },
  })
  return user
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Organization()
  },
  expenses: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Expense()
  },
  trips: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).Trip()
  },
}

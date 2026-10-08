import { Prisma } from '@prisma/client'

import { UserInputError } from '@redwoodjs/graphql-server'

import type {
  QueryResolvers,
  MutationResolvers,
  OrganizationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

const uniqueConstraintMessage = (target: unknown): string => {
  const serialized = JSON.stringify(target ?? '')
  if (serialized.includes('regnr')) {
    return 'An organization with this registration number (regnr) already exists.'
  }
  if (serialized.includes('name')) {
    return 'An organization with this name already exists.'
  }
  return 'An organization with this registration number or name already exists.'
}

const handleUniqueConstraintError = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    throw new UserInputError(uniqueConstraintMessage(error.meta?.target))
  }
  throw error as Error
}

export const organizations: QueryResolvers['organizations'] = () => {
  return db.organization.findMany()
}

export const organization: QueryResolvers['organization'] = ({ id }) => {
  return db.organization.findUnique({
    where: { id },
  })
}

export const createOrganization: MutationResolvers['createOrganization'] = ({
  input,
}) => {
  return db.organization
    .create({
      data: input,
    })
    .catch(handleUniqueConstraintError)
}

export const updateOrganization: MutationResolvers['updateOrganization'] = ({
  id,
  input,
}) => {
  return db.organization
    .update({
      data: input,
      where: { id },
    })
    .catch(handleUniqueConstraintError)
}

export const deleteOrganization: MutationResolvers['deleteOrganization'] = ({
  id,
}) => {
  return db.organization.delete({
    where: { id },
  })
}

export const Organization: OrganizationRelationResolvers = {
  users: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).User()
  },
  suppliers: (_obj, { root }) => {
    return db.organization.findUnique({ where: { id: root?.id } }).Supplier()
  },
}

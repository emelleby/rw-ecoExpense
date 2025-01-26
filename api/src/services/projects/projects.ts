import type {
  QueryResolvers,
  MutationResolvers,
  ProjectRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const projects: QueryResolvers['projects'] = ({
  take,
}: {
  take?: number
}) => {
  const currentUser = context.currentUser
  console.log('Current user:', currentUser)
  console.log('Organization ID:', currentUser.organizationId)
  const result = db.project.findMany({
    where: {
      organizationId: currentUser.organizationId,
    },
    include: {
      createdBy: true,
    },
    take: take || undefined,
    orderBy: {
      id: 'desc',
    },
  })

  console.log('Service - Query result:', result)
  return result
}

export const project: QueryResolvers['project'] = ({ id }) => {
  return db.project.findUnique({
    where: { id },
  })
}

export const createProject: MutationResolvers['createProject'] = ({
  input,
}) => {
  const currentUser = context.currentUser

  return db.project.create({
    data: {
      ...input,
      organizationId: currentUser.organizationId,
      createdById: currentUser.dbUserId,
    },
    // include: {
    //   createdBy: true,
    //   organization: true,
    // },
  })
}

export const updateProject: MutationResolvers['updateProject'] = ({
  id,
  input,
}) => {
  return db.project.update({
    data: input,
    where: { id },
  })
}

export const deleteProject: MutationResolvers['deleteProject'] = ({ id }) => {
  return db.project.delete({
    where: { id },
  })
}

export const Project: ProjectRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.project.findUnique({ where: { id: root?.id } }).Organization()
  },
  createdBy: (_obj, { root }) => {
    return db.project.findUnique({ where: { id: root?.id } }).createdBy()
  },
  expenses: (_obj, { root }) => {
    return db.project.findUnique({ where: { id: root?.id } }).Expense()
  },
  trips: (_obj, { root }) => {
    return db.project.findUnique({ where: { id: root?.id } }).Trip()
  },
}

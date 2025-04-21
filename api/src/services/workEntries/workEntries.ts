import type {
  QueryResolvers,
  MutationResolvers,
  WorkEntryRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const workEntries: QueryResolvers['workEntries'] = () => {
  return db.workEntry.findMany()
}

export const workEntriesByUser: QueryResolvers['workEntriesByUser'] = () => {
  const currentUser = context.currentUser
  
  return db.workEntry.findMany({
    where: { userId: currentUser.dbUserId },
  })
}

export const workEntry: QueryResolvers['workEntry'] = ({ id }) => {
  return db.workEntry.findUnique({
    where: { id },
  })
}

export const createWorkEntry: MutationResolvers['createWorkEntry'] = ({
  input,
}) => {
  const currentUser = context.currentUser
  
  return db.workEntry.create({
    data: {
      ...input,
      userId: currentUser.dbUserId,
    },
  })
}

export const updateWorkEntry: MutationResolvers['updateWorkEntry'] = ({
  id,
  input,
}) => {
  return db.workEntry.update({
    data: input,
    where: { id },
  })
}

export const deleteWorkEntry: MutationResolvers['deleteWorkEntry'] = ({ id }) => {
  return db.workEntry.delete({
    where: { id },
  })
}

export const WorkEntry: WorkEntryRelationResolvers = {
  user: (_obj, { root }) => {
    return db.workEntry.findUnique({ where: { id: root?.id } }).user()
  },
  rate: (_obj, { root }) => {
    return db.workEntry.findUnique({ where: { id: root?.id } }).rate()
  },
}

import type {
  QueryResolvers,
  MutationResolvers,
  SectorRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const sectors: QueryResolvers['sectors'] = () => {
  return db.sector.findMany()
}

export const sector: QueryResolvers['sector'] = ({ id }) => {
  return db.sector.findUnique({
    where: { id },
  })
}

export const createSector: MutationResolvers['createSector'] = ({ input }) => {
  return db.sector.create({
    data: input,
  })
}

export const updateSector: MutationResolvers['updateSector'] = ({
  id,
  input,
}) => {
  return db.sector.update({
    data: input,
    where: { id },
  })
}

export const deleteSector: MutationResolvers['deleteSector'] = ({ id }) => {
  return db.sector.delete({
    where: { id },
  })
}

export const Sector: SectorRelationResolvers = {
  expenses: (_obj, { root }) => {
    return db.sector.findUnique({ where: { id: root?.id } }).expenses()
  },
}

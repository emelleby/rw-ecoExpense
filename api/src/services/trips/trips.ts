import type {
  QueryResolvers,
  MutationResolvers,
  TripRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const trips: QueryResolvers['trips'] = () => {
  return db.trip.findMany()
}

export const trip: QueryResolvers['trip'] = ({ id }) => {
  return db.trip.findUnique({
    where: { id },
  })
}

// Added to only fetch trips for the current user
export const tripsByUser: QueryResolvers['tripsByUser'] = () => {
  const currentUser = context.currentUser

  return db.trip.findMany({
    where: {
      userId: currentUser.dbUserId,
    },
  })
}

// export const createTrip: MutationResolvers['createTrip'] = ({ input }) => {
//   return db.trip.create({
//     data: input,
//   })
// }

// This is a custom way of doing it from AI. The above is RW generated.
export const createTrip: MutationResolvers['createTrip'] = ({ input }) => {
  return db.trip.create({
    data: {
      name: input.name,
      description: input.description,
      startDate: input.startDate,
      endDate: input.endDate,
      user: {
        connect: {
          id: input.userId,
        },
      },
    },
  })
}

export const updateTrip: MutationResolvers['updateTrip'] = ({ id, input }) => {
  return db.trip.update({
    data: input,
    where: { id },
  })
}

export const deleteTrip: MutationResolvers['deleteTrip'] = ({ id }) => {
  return db.trip.delete({
    where: { id },
  })
}

export const Trip: TripRelationResolvers = {
  user: (_obj, { root }) => {
    return db.trip.findUnique({ where: { id: root?.id } }).user()
  },
  expenses: (_obj, { root }) => {
    return db.trip.findUnique({ where: { id: root?.id } }).expenses()
  },
}

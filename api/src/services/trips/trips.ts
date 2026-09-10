import type {
  QueryResolvers,
  MutationResolvers,
  TripRelationResolvers,
} from 'types/graphql'

import { getConversionRate } from 'src/lib/currency'
import { db } from 'src/lib/db'

export const trips: QueryResolvers['trips'] = () => {
  return db.trip.findMany()
}

export const trip: QueryResolvers['trip'] = async ({ id }) => {
  const currentUser = context.currentUser
  const trip = await db.trip.findUnique({
    where: { id, userId: currentUser.dbUserId },
  })
  return trip
}

export const topTripsByUser: QueryResolvers['topTripsByUser'] = () => {
  const currentUser = context.currentUser

  return db.trip.findMany({
    where: {
      userId: currentUser.dbUserId,
    },
    take: 5,
  })
}
// Added to only fetch trips for the current user
export const tripsByUser: QueryResolvers['tripsByUser'] = ({ take }) => {
  const currentUser = context.currentUser
  return db.trip.findMany({
    where: {
      userId: currentUser.dbUserId,
    },
    take: take || undefined,
    orderBy: {
      startDate: 'desc',
    },
  })
}

export const createTrip: MutationResolvers['createTrip'] = ({ input }) => {
  return db.trip.create({
    data: input,
  })
}

// This is a custom way of doing it from AI. The above is RW generated.
// export const createTrip: MutationResolvers['createTrip'] = ({ input }) => {
//   return db.trip.create({
//     data: {
//       name: input.name,
//       description: input.description,
//       startDate: input.startDate,
//       endDate: input.endDate,
//       Project: {
//         connect: {
//           id: input.projectId,
//         },
//       },
//       user: {
//         connect: {
//           id: input.userId,
//         },
//       },
//     },
//   })
// }

// export const createTrip: MutationResolvers['createTrip'] = ({ input }) => {
//   return db.trip.create({
//     data: {
//       name: input.name,
//       description: input.description,
//       startDate: input.startDate,
//       endDate: input.endDate,
//       projectId: input.projectId,  // Direct assignment instead of connect
//       userId: input.userId,        // Direct assignment instead of connect
//     },
//   })
// }

/**
 * Re-convert every expense on a trip into the trip's secondary currency.
 * Runs when that currency is set or changed, so expenses entered before the
 * currency was chosen still get a figure. Each expense converts at its own date.
 *
 * ponytail: sequential backfill inside the mutation. Trips hold tens of
 * expenses. If one ever holds hundreds, move this to a background job.
 */
const backfillSecondaryCurrency = async (
  tripId: number,
  secondaryCurrency: string | null
) => {
  const expenses = await db.expense.findMany({
    where: { tripId },
    select: { id: true, amount: true, currency: true, date: true },
  })

  if (!secondaryCurrency) {
    await db.expense.updateMany({
      where: { tripId },
      data: {
        secondaryCurrency: null,
        secondaryExchangeRate: null,
        secondaryAmount: null,
      },
    })
    return
  }

  // A trip is usually a handful of distinct currency/date pairs, not one per expense.
  const rates = new Map<string, number | null>()

  for (const expense of expenses) {
    const day = new Date(expense.date).toISOString().split('T')[0]
    const key = `${expense.currency}|${day}`

    if (!rates.has(key)) {
      rates.set(
        key,
        await getConversionRate(
          expense.currency,
          secondaryCurrency,
          expense.date
        )
      )
    }

    const rate = rates.get(key)
    if (rate === null) continue // unsupported currency or API down — skip, don't zero it

    await db.expense.update({
      where: { id: expense.id },
      data: {
        secondaryCurrency,
        secondaryExchangeRate: rate,
        secondaryAmount: Number((Number(expense.amount) * rate).toFixed(2)),
      },
    })
  }
}

export const updateTrip: MutationResolvers['updateTrip'] = async ({
  id,
  input,
}) => {
  const existing = await db.trip.findUnique({
    where: { id },
    select: { secondaryCurrency: true },
  })

  const updated = await db.trip.update({
    data: input,
    where: { id },
  })

  if (
    input.secondaryCurrency !== undefined &&
    input.secondaryCurrency !== existing?.secondaryCurrency
  ) {
    await backfillSecondaryCurrency(id, updated.secondaryCurrency)
  }

  return updated
}

// a function to update reimbursementStatus of all trips of a specific user input will be reimbursementStatus only which can be
// NOT_REQUESTED, PENDING, REIMBURSED

export const updateReimbursementStatus: MutationResolvers['updateReimbursementStatus'] =
  async ({ reimbursementStatus, id }) => {
    try {
      await db.trip.updateMany({
        data: {
          reimbursementStatus: reimbursementStatus,
        },
        where: {
          id: id,
        },
      })
      return true
    } catch (error) {
      return false
    }
  }

export const deleteTrip: MutationResolvers['deleteTrip'] = ({ id }) => {
  return db.trip.delete({
    where: { id },
  })
}

export const Trip: TripRelationResolvers = {
  user: (_obj, { root }) => {
    return db.trip.findUnique({ where: { id: root?.id } }).User()
  },
  expenses: (_obj, { root }) => {
    return db.trip.findUnique({ where: { id: root?.id } }).Expense()
  },
  project: (_obj, { root }) => {
    return db.trip.findUnique({ where: { id: root?.id } }).Project()
  },
}

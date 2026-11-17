import type { Trip } from '@prisma/client'

import { ForbiddenError } from '@redwoodjs/graphql-server'

import {
  trips,
  trip,
  createTrip,
  updateTrip,
  deleteTrip,
  createShareLink,
  revokeShareLink,
  updateReimbursementStatus,
  sharedTripReport,
} from './trips'
import type { StandardScenario } from './trips.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('trips', () => {
  scenario('returns all trips', async (scenario: StandardScenario) => {
    const result = await trips()

    expect(result.length).toEqual(Object.keys(scenario.trip).length)
  })

  scenario('returns a single trip', async (scenario: StandardScenario) => {
    mockCurrentUser({ dbUserId: scenario.trip.one.userId })

    const result = await trip({ id: scenario.trip.one.id })

    expect(result).toEqual(scenario.trip.one)
  })

  scenario('creates a trip', async (scenario: StandardScenario) => {
    const result = await createTrip({
      input: {
        name: 'String',
        startDate: '2024-11-19T23:29:58.047Z',
        endDate: '2024-11-19T23:29:58.047Z',
        userId: scenario.trip.two.userId,
        projectId: scenario.trip.two.projectId,
      },
    })

    expect(result.name).toEqual('String')
    expect(result.startDate).toEqual(new Date('2024-11-19T23:29:58.047Z'))
    expect(result.endDate).toEqual(new Date('2024-11-19T23:29:58.047Z'))
    expect(result.userId).toEqual(scenario.trip.two.userId)
  })

  scenario('updates a trip', async (scenario: StandardScenario) => {
    mockCurrentUser({ dbUserId: scenario.trip.one.userId })

    const original = (await trip({ id: scenario.trip.one.id })) as Trip
    const result = await updateTrip({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('updates trip isPrivate', async (scenario: StandardScenario) => {
    const result = await updateTrip({
      id: scenario.trip.one.id,
      input: { isPrivate: true },
    })

    expect(result.isPrivate).toEqual(true)

    mockCurrentUser({ dbUserId: scenario.trip.one.userId })

    const persisted = (await trip({ id: scenario.trip.one.id })) as Trip
    expect(persisted.isPrivate).toEqual(true)

    await updateTrip({
      id: scenario.trip.one.id,
      input: { isPrivate: false },
    })

    const toggledBack = (await trip({ id: scenario.trip.one.id })) as Trip
    expect(toggledBack.isPrivate).toEqual(false)
  })

  scenario('deletes a trip', async (scenario: StandardScenario) => {
    mockCurrentUser({ dbUserId: scenario.trip.one.userId })

    const original = (await deleteTrip({ id: scenario.trip.one.id })) as Trip
    const result = await trip({ id: original.id })

    expect(result).toEqual(null)
  })

  scenario('creates a share link', async (scenario: StandardScenario) => {
    mockCurrentUser({ dbUserId: scenario.trip.one.userId })

    const result = await createShareLink({ tripId: scenario.trip.one.id })

    expect(typeof result.shareToken).toEqual('string')
    expect(result.shareToken?.length).toBeGreaterThan(0)

    const persisted = (await trip({ id: scenario.trip.one.id })) as Trip
    expect(persisted.shareToken).toEqual(result.shareToken)
  })

  scenario(
    "throws when creating a share link for another user's trip",
    async (scenario: StandardScenario) => {
      mockCurrentUser({ dbUserId: scenario.trip.two.userId })

      await expect(
        createShareLink({ tripId: scenario.trip.one.id })
      ).rejects.toThrow(ForbiddenError)
    }
  )

  scenario('revokes a share link', async (scenario: StandardScenario) => {
    mockCurrentUser({ dbUserId: scenario.trip.three.userId })

    const result = await revokeShareLink({ tripId: scenario.trip.three.id })

    expect(result.shareToken).toEqual(null)

    const persisted = (await trip({ id: scenario.trip.three.id })) as Trip
    expect(persisted.shareToken).toEqual(null)
  })

  scenario(
    "throws when revoking another user's share link",
    async (scenario: StandardScenario) => {
      mockCurrentUser({ dbUserId: scenario.trip.two.userId })

      await expect(
        revokeShareLink({ tripId: scenario.trip.three.id })
      ).rejects.toThrow(ForbiddenError)
    }
  )

  scenario(
    'clears shareToken when trip is marked reimbursed',
    async (scenario: StandardScenario) => {
      mockCurrentUser({ dbUserId: scenario.trip.three.userId })

      const pending = await updateReimbursementStatus({
        id: scenario.trip.three.id,
        reimbursementStatus: 'PENDING',
      })

      expect(pending).toEqual(true)

      const afterPending = (await trip({
        id: scenario.trip.three.id,
      })) as Trip
      expect(afterPending.shareToken).toEqual('pre-existing-share-token')

      const reimbursed = await updateReimbursementStatus({
        id: scenario.trip.three.id,
        reimbursementStatus: 'REIMBURSED',
      })

      expect(reimbursed).toEqual(true)

      const afterReimbursed = (await trip({
        id: scenario.trip.three.id,
      })) as Trip
      expect(afterReimbursed.reimbursementStatus).toEqual('REIMBURSED')
      expect(afterReimbursed.shareToken).toEqual(null)
    }
  )

  scenario('returns a trip by share token', async (scenario: StandardScenario) => {
    const result = await sharedTripReport({
      token: scenario.trip.three.shareToken as string,
    })

    expect(result).toEqual(scenario.trip.three)
  })

  scenario('returns null for an unknown share token', async () => {
    expect(await sharedTripReport({ token: 'no-such-token' })).toEqual(null)
  })
})

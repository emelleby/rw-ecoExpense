import type { Trip } from '@prisma/client'

import { trips, trip, createTrip, updateTrip, deleteTrip } from './trips'
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
      },
    })

    expect(result.name).toEqual('String')
    expect(result.startDate).toEqual(new Date('2024-11-19T23:29:58.047Z'))
    expect(result.endDate).toEqual(new Date('2024-11-19T23:29:58.047Z'))
    expect(result.userId).toEqual(scenario.trip.two.userId)
  })

  scenario('updates a trip', async (scenario: StandardScenario) => {
    const original = (await trip({ id: scenario.trip.one.id })) as Trip
    const result = await updateTrip({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a trip', async (scenario: StandardScenario) => {
    const original = (await deleteTrip({ id: scenario.trip.one.id })) as Trip
    const result = await trip({ id: original.id })

    expect(result).toEqual(null)
  })
})

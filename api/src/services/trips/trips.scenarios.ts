import type { Prisma, Trip } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TripCreateArgs>({
  trip: {
    one: {
      data: {
        name: 'String',
        startDate: '2024-11-19T23:29:58.055Z',
        endDate: '2024-11-19T23:29:58.056Z',
        user: {
          create: {
            username: 'String8915191',
            email: 'String729604',
            organization: {
              create: { regnr: 'String75909', name: 'String8427115' },
            },
            role: {
              create: {
                name: 'String',
                organization: {
                  create: { regnr: 'String5252450', name: 'String1321675' },
                },
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        startDate: '2024-11-19T23:29:58.056Z',
        endDate: '2024-11-19T23:29:58.056Z',
        user: {
          create: {
            username: 'String9835652',
            email: 'String1223250',
            organization: {
              create: { regnr: 'String8306848', name: 'String2468492' },
            },
            role: {
              create: {
                name: 'String',
                organization: {
                  create: { regnr: 'String2574908', name: 'String9533643' },
                },
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Trip, 'trip'>

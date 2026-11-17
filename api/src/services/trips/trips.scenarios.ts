import type { Prisma, Trip } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TripCreateArgs>({
  trip: {
    one: {
      data: {
        name: 'String',
        startDate: '2024-11-19T23:29:58.055Z',
        endDate: '2024-11-19T23:29:58.056Z',
        User: {
          create: {
            username: 'String8915191',
            email: 'String729604',
            Organization: {
              create: { regnr: '123456789', name: 'String8427115' },
            },
          },
        },
        Project: {
          create: { name: 'String' },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        startDate: '2024-11-19T23:29:58.056Z',
        endDate: '2024-11-19T23:29:58.056Z',
        User: {
          create: {
            username: 'String9835652',
            email: 'String1223250',
            Organization: {
              create: { regnr: '987654321', name: 'String1321675' },
            },
          },
        },
        Project: {
          create: { name: 'String' },
        },
      },
    },
    three: {
      data: {
        name: 'String',
        startDate: '2024-11-19T23:29:58.056Z',
        endDate: '2024-11-19T23:29:58.056Z',
        User: {
          create: {
            username: 'String7261543',
            email: 'String9183746',
            Organization: {
              create: { regnr: '456789123', name: 'String6392814' },
            },
          },
        },
        Project: {
          create: { name: 'String' },
        },
        shareToken: 'pre-existing-share-token',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Trip, 'trip'>

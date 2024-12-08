import type { Prisma, Receipt } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReceiptCreateArgs>({
  receipt: {
    one: {
      data: {
        url: 'String',
        fileName: 'String',
        fileType: 'String',
        updatedAt: '2024-12-08T17:55:56.666Z',
        expense: {
          create: {
            amount: 5694856.903935368,
            currency: 'String',
            nokAmount: 5440424.316061869,
            category: {
              create: { name: 'String102150', norName: 'String8337186' },
            },
            trip: {
              create: {
                name: 'String',
                startDate: '2024-12-08T17:55:56.666Z',
                endDate: '2024-12-08T17:55:56.666Z',
                user: {
                  create: {
                    username: 'String4580447',
                    email: 'String3307192',
                    organization: {
                      create: { regnr: 'String7674526', name: 'String9839413' },
                    },
                  },
                },
              },
            },
            user: {
              create: {
                username: 'String8013276',
                email: 'String9201184',
                organization: {
                  create: { regnr: 'String1201853', name: 'String6752326' },
                },
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        url: 'String',
        fileName: 'String',
        fileType: 'String',
        updatedAt: '2024-12-08T17:55:56.666Z',
        expense: {
          create: {
            amount: 5977436.031150496,
            currency: 'String',
            nokAmount: 6775319.060644795,
            category: {
              create: { name: 'String386394', norName: 'String3135511' },
            },
            trip: {
              create: {
                name: 'String',
                startDate: '2024-12-08T17:55:56.666Z',
                endDate: '2024-12-08T17:55:56.666Z',
                user: {
                  create: {
                    username: 'String4616113',
                    email: 'String793630',
                    organization: {
                      create: { regnr: 'String4640413', name: 'String65625' },
                    },
                  },
                },
              },
            },
            user: {
              create: {
                username: 'String2928713',
                email: 'String1559055',
                organization: {
                  create: { regnr: 'String7680335', name: 'String6132028' },
                },
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Receipt, 'receipt'>

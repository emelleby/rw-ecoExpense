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
        Expense: {
          create: {
            amount: 5694856.903935368,
            currency: 'USD',
            nokAmount: 5440424.316061869,
            category: {
              create: { name: 'String102150', norName: 'String8337186' },
            },
            Trip: {
              create: {
                name: 'String',
                startDate: '2024-12-08T17:55:56.666Z',
                endDate: '2024-12-08T17:55:56.666Z',
                Project: { create: { name: 'String' } },
                User: {
                  create: {
                    username: 'String4580447',
                    email: 'String3307192',
                    Organization: {
                      create: { regnr: 'reg000001', name: 'String9839413' },
                    },
                  },
                },
              },
            },
            User: {
              create: {
                username: 'String8013276',
                email: 'String9201199',
                Organization: {
                  create: { regnr: 'reg000002', name: 'String9839417' },
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
        Expense: {
          create: {
            amount: 5977436.031150496,
            currency: 'USD',
            nokAmount: 6775319.060644795,
            category: {
              create: { name: 'String386394', norName: 'String3135511' },
            },
            Trip: {
              create: {
                name: 'String',
                startDate: '2024-12-08T17:55:56.666Z',
                endDate: '2024-12-08T17:55:56.666Z',
                Project: { create: { name: 'String' } },
                User: {
                  create: {
                    username: 'String4616113',
                    email: 'String793630',
                    Organization: {
                      create: { regnr: 'reg000003', name: 'String65625' },
                    },
                  },
                },
              },
            },
            User: {
              create: {
                username: 'String2928713',
                email: 'String1559055',
                Organization: {
                  create: { regnr: 'reg000004', name: 'String6132028' },
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

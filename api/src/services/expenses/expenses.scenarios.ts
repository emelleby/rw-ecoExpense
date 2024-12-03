import type { Prisma, Expense } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ExpenseCreateArgs>({
  expense: {
    one: {
      data: {
        amount: 8182321.249507456,
        currency: 'String',
        nokAmount: 4129900.1445682524,
        category: { create: { name: 'String333652' } },
        trip: {
          create: {
            name: 'String',
            startDate: '2024-12-02T20:00:56.229Z',
            endDate: '2024-12-02T20:00:56.229Z',
            user: {
              create: {
                username: 'String2282011',
                email: 'String4473013',
                organization: {
                  create: { regnr: 'String628283', name: 'String3049273' },
                },
              },
            },
          },
        },
        user: {
          create: {
            username: 'String3300629',
            email: 'String4377260',
            organization: {
              create: { regnr: 'String6214258', name: 'String2117459' },
            },
          },
        },
      },
    },
    two: {
      data: {
        amount: 8011036.815225876,
        currency: 'String',
        nokAmount: 9565364.218960198,
        category: { create: { name: 'String8151301' } },
        trip: {
          create: {
            name: 'String',
            startDate: '2024-12-02T20:00:56.229Z',
            endDate: '2024-12-02T20:00:56.229Z',
            user: {
              create: {
                username: 'String2224934',
                email: 'String6192527',
                organization: {
                  create: { regnr: 'String5072257', name: 'String6367941' },
                },
              },
            },
          },
        },
        user: {
          create: {
            username: 'String9060805',
            email: 'String8802792',
            organization: {
              create: { regnr: 'String3990121', name: 'String9595385' },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Expense, 'expense'>

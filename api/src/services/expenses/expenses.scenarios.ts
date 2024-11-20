import type { Prisma, Expense } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ExpenseCreateArgs>({
  expense: {
    one: {
      data: {
        amount: 5331541.8083723,
        currency: 'String',
        nokAmount: 5962913.464817204,
        supplier: {
          create: {
            name: 'String',
            organization: {
              create: { regnr: 'String8799290', name: 'String7570699' },
            },
          },
        },
        category: { create: { name: 'String1691293' } },
        user: {
          create: {
            username: 'String7269584',
            email: 'String771949',
            passwordHash: 'String',
            organization: {
              create: { regnr: 'String5252997', name: 'String2218503' },
            },
            role: {
              create: {
                name: 'String',
                organization: {
                  create: { regnr: 'String4302930', name: 'String5307512' },
                },
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        amount: 9332082.496461939,
        currency: 'String',
        nokAmount: 6917784.51323203,
        supplier: {
          create: {
            name: 'String',
            organization: {
              create: { regnr: 'String4305169', name: 'String871823' },
            },
          },
        },
        category: { create: { name: 'String7268796' } },
        user: {
          create: {
            username: 'String9429463',
            email: 'String4972862',
            passwordHash: 'String',
            organization: {
              create: { regnr: 'String1152693', name: 'String2220123' },
            },
            role: {
              create: {
                name: 'String',
                organization: {
                  create: { regnr: 'String217694', name: 'String3763879' },
                },
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Expense, 'expense'>

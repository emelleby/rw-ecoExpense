import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        username: 'String9939007',
        email: 'String4069834',
        organization: {
          create: { regnr: 'String5064707', name: 'String7948698' },
        },
      },
    },
    two: {
      data: {
        username: 'String2666148',
        email: 'String6498680',
        organization: {
          create: { regnr: 'String4007032', name: 'String5181307' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>

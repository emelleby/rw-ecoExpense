import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        username: 'String9745742',
        email: 'String9402059',
        organization: {
          create: { regnr: 'String4331466', name: 'String1427716' },
        },
      },
    },
    two: {
      data: {
        username: 'String5461410',
        email: 'String8558713',
        organization: {
          create: { regnr: 'String413794', name: 'String6299238' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>

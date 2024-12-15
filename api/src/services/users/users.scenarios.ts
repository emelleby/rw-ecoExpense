import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        username: 'String8387936',
        email: 'String5516340',
        organization: {
          create: { regnr: 'String2494426', name: 'String5411843' },
        },
      },
    },
    two: {
      data: {
        username: 'String4743954',
        email: 'String8934535',
        organization: {
          create: { regnr: 'String8063148', name: 'String8407518' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>

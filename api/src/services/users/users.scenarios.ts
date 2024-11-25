import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        username: 'String9713308',
        email: 'String6045150',
        firstName: 'String',
        organization: {
          create: { regnr: 'String3765678', name: 'String6081827' },
        },
        role: {
          create: {
            name: 'String',
            organization: {
              create: { regnr: 'String6228968', name: 'String324556' },
            },
          },
        },
      },
    },
    two: {
      data: {
        username: 'String5148374',
        email: 'String4951751',
        firstName: 'String',
        organization: {
          create: { regnr: 'String854651', name: 'String3778119' },
        },
        role: {
          create: {
            name: 'String',
            organization: {
              create: { regnr: 'String9665663', name: 'String4351475' },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>

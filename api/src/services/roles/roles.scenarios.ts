import type { Prisma, Role } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.RoleCreateArgs>({
  role: {
    one: {
      data: {
        name: 'String',
        organization: {
          create: { regnr: 'String4575344', name: 'String7076611' },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        organization: {
          create: { regnr: 'String1730855', name: 'String2087577' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Role, 'role'>

import type { Prisma, Supplier } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SupplierCreateArgs>({
  supplier: {
    one: {
      data: {
        name: 'String',
        organization: {
          create: { regnr: 'String8854593', name: 'String5495511' },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        organization: {
          create: { regnr: 'String4233353', name: 'String9562723' },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Supplier, 'supplier'>

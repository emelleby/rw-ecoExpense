import type { Prisma, Organization } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: { data: { regnr: 'String8381578', name: 'String518296' } },
    two: { data: { regnr: 'String5246394', name: 'String4240521' } },
  },
})

export type StandardScenario = ScenarioData<Organization, 'organization'>

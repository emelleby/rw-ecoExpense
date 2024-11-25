import type { Prisma, Organization } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: { data: { regnr: 'String1769779', name: 'String1789197' } },
    two: { data: { regnr: 'String9876777', name: 'String7946393' } },
  },
})

export type StandardScenario = ScenarioData<Organization, 'organization'>

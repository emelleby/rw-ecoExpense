import type { Prisma, Organization } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: { data: { regnr: 'String7844395', name: 'String447356' } },
    two: { data: { regnr: 'String4171397', name: 'String1920275' } },
  },
})

export type StandardScenario = ScenarioData<Organization, 'organization'>

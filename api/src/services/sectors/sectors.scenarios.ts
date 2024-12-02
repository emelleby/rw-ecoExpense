import type { Prisma, Sector } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SectorCreateArgs>({
  sector: {
    one: {
      data: {
        name: 'String1015646',
        factor: 1951989.2228932579,
        currency: 'String',
      },
    },
    two: {
      data: {
        name: 'String5791446',
        factor: 6037428.062799637,
        currency: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Sector, 'sector'>

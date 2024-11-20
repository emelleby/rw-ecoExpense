import type { Prisma, Project } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ProjectCreateArgs>({
  project: {
    one: {
      data: {
        name: 'String',
        user: {
          create: {
            username: 'String7325940',
            email: 'String9243457',
            passwordHash: 'String',
            organization: {
              create: { regnr: 'String8205171', name: 'String1017461' },
            },
            role: {
              create: {
                name: 'String',
                organization: {
                  create: { regnr: 'String5262525', name: 'String6098587' },
                },
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        user: {
          create: {
            username: 'String5077017',
            email: 'String8131635',
            passwordHash: 'String',
            organization: {
              create: { regnr: 'String8396979', name: 'String8434391' },
            },
            role: {
              create: {
                name: 'String',
                organization: {
                  create: { regnr: 'String3219754', name: 'String2775808' },
                },
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Project, 'project'>

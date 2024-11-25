import type { Prisma, Project } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ProjectCreateArgs>({
  project: {
    one: {
      data: {
        name: 'String',
        user: {
          create: {
            username: 'String8372830',
            email: 'String1132189',
            organization: {
              create: { regnr: 'String7671896', name: 'String8960761' },
            },
            role: {
              create: {
                name: 'String',
                organization: {
                  create: { regnr: 'String5092569', name: 'String9966258' },
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
            username: 'String3446428',
            email: 'String3982933',
            organization: {
              create: { regnr: 'String1603039', name: 'String3059993' },
            },
            role: {
              create: {
                name: 'String',
                organization: {
                  create: { regnr: 'String9620736', name: 'String569656' },
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

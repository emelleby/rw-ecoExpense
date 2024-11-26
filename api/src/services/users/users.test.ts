import type { User } from '@prisma/client'

import { users, user, createUser, updateUser, deleteUser } from './users'
import type { StandardScenario } from './users.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('users', () => {
  scenario('returns all users', async (scenario: StandardScenario) => {
    const result = await users()

    expect(result.length).toEqual(Object.keys(scenario.user).length)
  })

  scenario('returns a single user', async (scenario: StandardScenario) => {
    const result = await user({ id: scenario.user.one.id })

    expect(result).toEqual(scenario.user.one)
  })

  scenario('creates a user', async (scenario: StandardScenario) => {
    const result = await createUser({
      input: {
        username: 'String6444293',
        email: 'String1187288',
        organizationId: scenario.user.two.organizationId,
      },
    })

    expect(result.username).toEqual('String6444293')
    expect(result.email).toEqual('String1187288')
    expect(result.organizationId).toEqual(scenario.user.two.organizationId)
  })

  scenario('updates a user', async (scenario: StandardScenario) => {
    const original = (await user({ id: scenario.user.one.id })) as User
    const result = await updateUser({
      id: original.id,
      input: { username: 'String3520752' },
    })

    expect(result.username).toEqual('String3520752')
  })

  scenario('deletes a user', async (scenario: StandardScenario) => {
    const original = (await deleteUser({ id: scenario.user.one.id })) as User
    const result = await user({ id: original.id })

    expect(result).toEqual(null)
  })
})

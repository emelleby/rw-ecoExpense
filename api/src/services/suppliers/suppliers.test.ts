import type { Supplier } from '@prisma/client'

import {
  suppliers,
  supplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from './suppliers'
import type { StandardScenario } from './suppliers.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('suppliers', () => {
  scenario('returns all suppliers', async (scenario: StandardScenario) => {
    const result = await suppliers()

    expect(result.length).toEqual(Object.keys(scenario.supplier).length)
  })

  scenario('returns a single supplier', async (scenario: StandardScenario) => {
    const result = await supplier({ id: scenario.supplier.one.id })

    expect(result).toEqual(scenario.supplier.one)
  })

  scenario('creates a supplier', async (scenario: StandardScenario) => {
    const result = await createSupplier({
      input: {
        name: 'String',
        organizationId: scenario.supplier.two.organizationId,
      },
    })

    expect(result.name).toEqual('String')
    expect(result.organizationId).toEqual(scenario.supplier.two.organizationId)
  })

  scenario('updates a supplier', async (scenario: StandardScenario) => {
    const original = (await supplier({
      id: scenario.supplier.one.id,
    })) as Supplier
    const result = await updateSupplier({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a supplier', async (scenario: StandardScenario) => {
    const original = (await deleteSupplier({
      id: scenario.supplier.one.id,
    })) as Supplier
    const result = await supplier({ id: original.id })

    expect(result).toEqual(null)
  })
})

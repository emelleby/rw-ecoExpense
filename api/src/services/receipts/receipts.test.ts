import type { Receipt } from '@prisma/client'

import {
  receipts,
  receipt,
  createReceipt,
  updateReceipt,
  deleteReceipt,
} from './receipts'
import type { StandardScenario } from './receipts.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('receipts', () => {
  scenario('returns all receipts', async (scenario: StandardScenario) => {
    const result = await receipts()

    expect(result.length).toEqual(Object.keys(scenario.receipt).length)
  })

  scenario('returns a single receipt', async (scenario: StandardScenario) => {
    const result = await receipt({ id: scenario.receipt.one.id })

    expect(result).toEqual(scenario.receipt.one)
  })

  scenario('creates a receipt', async (scenario: StandardScenario) => {
    const result = await createReceipt({
      input: {
        url: 'String',
        fileName: 'String',
        fileType: 'String',
        expenseId: scenario.receipt.two.expenseId,
        updatedAt: '2024-12-08T17:55:56.485Z',
      },
    })

    expect(result.url).toEqual('String')
    expect(result.fileName).toEqual('String')
    expect(result.fileType).toEqual('String')
    expect(result.expenseId).toEqual(scenario.receipt.two.expenseId)
    expect(result.updatedAt).toEqual(new Date('2024-12-08T17:55:56.485Z'))
  })

  scenario('updates a receipt', async (scenario: StandardScenario) => {
    const original = (await receipt({ id: scenario.receipt.one.id })) as Receipt
    const result = await updateReceipt({
      id: original.id,
      input: { url: 'String2' },
    })

    expect(result.url).toEqual('String2')
  })

  scenario('deletes a receipt', async (scenario: StandardScenario) => {
    const original = (await deleteReceipt({
      id: scenario.receipt.one.id,
    })) as Receipt
    const result = await receipt({ id: original.id })

    expect(result).toEqual(null)
  })
})

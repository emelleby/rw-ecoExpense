import type { Expense } from '@prisma/client'

import {
  expenses,
  expense,
  createExpense,
  updateExpense,
  deleteExpense,
} from './expenses'
import type { StandardScenario } from './expenses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('expenses', () => {
  scenario('returns all expenses', async (scenario: StandardScenario) => {
    const result = await expenses()

    expect(result.length).toEqual(Object.keys(scenario.expense).length)
  })

  scenario('returns a single expense', async (scenario: StandardScenario) => {
    const result = await expense({ id: scenario.expense.one.id })

    expect(result).toEqual(scenario.expense.one)
  })

  scenario('creates a expense', async (scenario: StandardScenario) => {
    const result = await createExpense({
      input: {
        amount: 168763.03014920157,
        currency: 'String',
        nokAmount: 2130024.1070896275,
        supplierId: scenario.expense.two.supplierId,
        categoryId: scenario.expense.two.categoryId,
        userId: scenario.expense.two.userId,
      },
    })

    expect(result.amount).toEqual(168763.03014920157)
    expect(result.currency).toEqual('String')
    expect(result.nokAmount).toEqual(2130024.1070896275)
    expect(result.supplierId).toEqual(scenario.expense.two.supplierId)
    expect(result.categoryId).toEqual(scenario.expense.two.categoryId)
    expect(result.userId).toEqual(scenario.expense.two.userId)
  })

  scenario('updates a expense', async (scenario: StandardScenario) => {
    const original = (await expense({ id: scenario.expense.one.id })) as Expense
    const result = await updateExpense({
      id: original.id,
      input: { amount: 8891296.867525356 },
    })

    expect(result.amount).toEqual(8891296.867525356)
  })

  scenario('deletes a expense', async (scenario: StandardScenario) => {
    const original = (await deleteExpense({
      id: scenario.expense.one.id,
    })) as Expense
    const result = await expense({ id: original.id })

    expect(result).toEqual(null)
  })
})

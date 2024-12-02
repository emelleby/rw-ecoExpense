import { Prisma, Expense } from '@prisma/client'

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
        categoryId: scenario.expense.two.categoryId,
        amount: 309798.09458905994,
        currency: 'String',
        nokAmount: 7600771.620770918,
        tripId: scenario.expense.two.tripId,
        userId: scenario.expense.two.userId,
      },
    })

    expect(result.categoryId).toEqual(scenario.expense.two.categoryId)
    expect(result.amount).toEqual(new Prisma.Decimal(309798.09458905994))
    expect(result.currency).toEqual('String')
    expect(result.nokAmount).toEqual(new Prisma.Decimal(7600771.620770918))
    expect(result.tripId).toEqual(scenario.expense.two.tripId)
    expect(result.userId).toEqual(scenario.expense.two.userId)
  })

  scenario('updates a expense', async (scenario: StandardScenario) => {
    const original = (await expense({ id: scenario.expense.one.id })) as Expense
    const result = await updateExpense({
      id: original.id,
      input: { amount: 1084566.0444929984 },
    })

    expect(result.amount).toEqual(new Prisma.Decimal(1084566.0444929984))
  })

  scenario('deletes a expense', async (scenario: StandardScenario) => {
    const original = (await deleteExpense({
      id: scenario.expense.one.id,
    })) as Expense
    const result = await expense({ id: original.id })

    expect(result).toEqual(null)
  })
})

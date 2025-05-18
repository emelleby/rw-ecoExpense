import { Prisma, Expense } from '@prisma/client'
import { mockGraphQLQuery, mockGraphQLMutation } from '@redwoodjs/testing/api'

import {
  expenses,
  expense,
  createExpense,
  updateExpense,
  deleteExpense,
  validateTripStatus,
} from './expenses'
import type { StandardScenario } from './expenses.scenarios'

// Following RedwoodJS best practices for testing services
// https://redwoodjs.com/docs/testing#testing-services

describe('expenses', () => {
  // Basic CRUD operations
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
      },
    })

    expect(result.categoryId).toEqual(scenario.expense.two.categoryId)
    expect(result.amount).toEqual(new Prisma.Decimal(309798.09458905994))
    expect(result.currency).toEqual('String')
    expect(result.nokAmount).toEqual(new Prisma.Decimal(7600771.620770918))
    expect(result.tripId).toEqual(scenario.expense.two.tripId)
    expect(result.userId).toEqual(scenario.expense.two.userId)
  })

  // Tests for the validateTripStatus function
  describe('validateTripStatus', () => {
    scenario('returns true for expenses with NOT_REQUESTED trip status', async (scenario: StandardScenario) => {
      const result = await validateTripStatus({ id: scenario.expense.one.id })
      expect(result).toEqual(true)
    })

    scenario('returns an error for expenses with PENDING trip status', async (scenario: StandardScenario) => {
      try {
        await validateTripStatus({ id: scenario.expense.withPendingTrip.id })
        // If we get here, the test should fail
        expect(true).toEqual(false) // This will fail if no error is thrown
      } catch (error) {
        expect(error.message).toContain('Cannot modify expenses for trips that are pending')
      }
    })

    scenario('returns an error for expenses with REIMBURSED trip status', async (scenario: StandardScenario) => {
      try {
        await validateTripStatus({ id: scenario.expense.withReimbursedTrip.id })
        // If we get here, the test should fail
        expect(true).toEqual(false) // This will fail if no error is thrown
      } catch (error) {
        expect(error.message).toContain('Cannot modify expenses for trips that are reimbursed')
      }
    })
  })

  // Tests for expense edit restrictions
  describe('expense update restrictions', () => {
    scenario('prevents updating an expense with PENDING trip status', async (scenario: StandardScenario) => {
      // Mock the validateTripStatus function to throw an error
      jest.spyOn(require('./expenses'), 'validateTripStatus').mockImplementationOnce(() => {
        throw new Error('Cannot modify expenses for trips that are pending reimbursement')
      })

      const pendingExpense = scenario.expense.withPendingTrip
      const result = await updateExpense({
        id: pendingExpense.id,
        input: { amount: 9999 },
      })

      // Should return a validation error
      expect(result.__typename).toEqual('ExpenseValidationError')
      expect(result.message).toContain('Cannot modify expenses for trips that are pending')
    })

    scenario('prevents updating an expense with REIMBURSED trip status', async (scenario: StandardScenario) => {
      // Mock the validateTripStatus function to throw an error
      jest.spyOn(require('./expenses'), 'validateTripStatus').mockImplementationOnce(() => {
        throw new Error('Cannot modify expenses for trips that are reimbursed')
      })

      const reimbursedExpense = scenario.expense.withReimbursedTrip
      const result = await updateExpense({
        id: reimbursedExpense.id,
        input: { amount: 9999 },
      })

      // Should return a validation error
      expect(result.__typename).toEqual('ExpenseValidationError')
      expect(result.message).toContain('Cannot modify expenses for trips that are reimbursed')
    })

    scenario('allows updating an expense with NOT_REQUESTED trip status', async (scenario: StandardScenario) => {
      // Mock the validateTripStatus function to return true
      jest.spyOn(require('./expenses'), 'validateTripStatus').mockImplementationOnce(() => true)

      const editableExpense = scenario.expense.one
      const result = await updateExpense({
        id: editableExpense.id,
        input: { amount: 7777 },
      })

      // Should return the updated expense
      expect(result.__typename).toEqual('Expense')
      expect(result.amount).toEqual(new Prisma.Decimal(7777))
    })
  })

  // Tests for expense delete restrictions
  describe('expense delete restrictions', () => {
    scenario('prevents deleting an expense with PENDING trip status', async (scenario: StandardScenario) => {
      // Mock the validateTripStatus function to throw an error
      jest.spyOn(require('./expenses'), 'validateTripStatus').mockImplementationOnce(() => {
        throw new Error('Cannot modify expenses for trips that are pending reimbursement')
      })

      const pendingExpense = scenario.expense.withPendingTrip
      const result = await deleteExpense({
        id: pendingExpense.id,
      })

      // Should return a validation error
      expect(result.__typename).toEqual('ExpenseValidationError')
      expect(result.message).toContain('Cannot modify expenses for trips that are pending')
    })

    scenario('prevents deleting an expense with REIMBURSED trip status', async (scenario: StandardScenario) => {
      // Mock the validateTripStatus function to throw an error
      jest.spyOn(require('./expenses'), 'validateTripStatus').mockImplementationOnce(() => {
        throw new Error('Cannot modify expenses for trips that are reimbursed')
      })

      const reimbursedExpense = scenario.expense.withReimbursedTrip
      const result = await deleteExpense({
        id: reimbursedExpense.id,
      })

      // Should return a validation error
      expect(result.__typename).toEqual('ExpenseValidationError')
      expect(result.message).toContain('Cannot modify expenses for trips that are reimbursed')
    })

    scenario('allows deleting an expense with NOT_REQUESTED trip status', async (scenario: StandardScenario) => {
      // Mock the validateTripStatus function to return true
      jest.spyOn(require('./expenses'), 'validateTripStatus').mockImplementationOnce(() => true)

      const editableExpense = scenario.expense.two
      const result = await deleteExpense({
        id: editableExpense.id,
      })

      // Should return the deleted expense
      expect(result.__typename).toEqual('Expense')
      expect(result.id).toEqual(editableExpense.id)
    })
  })
})

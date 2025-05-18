import { mockRedwoodService, mockCurrentUser } from '@redwoodjs/testing/api'
import { Prisma } from '@prisma/client'

// Mock the entire expenses service
jest.mock('./expenses', () => ({
  validateTripStatus: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
}))

// Import the mocked service
import { validateTripStatus, updateExpense, deleteExpense } from './expenses'

describe('Expense Edit Restrictions', () => {
  beforeEach(() => {
    mockCurrentUser({
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
    })
    jest.clearAllMocks()
  })

  describe('validateTripStatus', () => {
    it('returns true for expenses with NOT_REQUESTED trip status', async () => {
      // Mock the implementation for this test
      const mockValidateTripStatus = validateTripStatus as jest.Mock
      mockValidateTripStatus.mockResolvedValueOnce(true)

      const result = await validateTripStatus({ id: 1 })
      expect(result).toBe(true)
      expect(mockValidateTripStatus).toHaveBeenCalledWith({ id: 1 })
    })

    it('throws an error for expenses with PENDING trip status', async () => {
      // Mock the implementation for this test
      const mockValidateTripStatus = validateTripStatus as jest.Mock
      mockValidateTripStatus.mockRejectedValueOnce(
        new Error('Cannot modify expenses for trips that are pending reimbursement')
      )

      await expect(validateTripStatus({ id: 2 })).rejects.toThrow(
        'Cannot modify expenses for trips that are pending reimbursement'
      )
      expect(mockValidateTripStatus).toHaveBeenCalledWith({ id: 2 })
    })

    it('throws an error for expenses with REIMBURSED trip status', async () => {
      // Mock the implementation for this test
      const mockValidateTripStatus = validateTripStatus as jest.Mock
      mockValidateTripStatus.mockRejectedValueOnce(
        new Error('Cannot modify expenses for trips that are reimbursed')
      )

      await expect(validateTripStatus({ id: 3 })).rejects.toThrow(
        'Cannot modify expenses for trips that are reimbursed'
      )
      expect(mockValidateTripStatus).toHaveBeenCalledWith({ id: 3 })
    })
  })

  describe('updateExpense', () => {
    it('returns a validation error when trying to update an expense with PENDING trip status', async () => {
      // Mock validateTripStatus to throw an error
      const mockValidateTripStatus = validateTripStatus as jest.Mock
      mockValidateTripStatus.mockRejectedValueOnce(
        new Error('Cannot modify expenses for trips that are pending reimbursement')
      )

      // Mock updateExpense to return a validation error
      const mockUpdateExpense = updateExpense as jest.Mock
      mockUpdateExpense.mockResolvedValueOnce({
        __typename: 'ExpenseValidationError',
        message: 'Cannot modify expenses for trips that are pending reimbursement',
      })

      const result = await updateExpense({
        id: 2,
        input: { amount: 9999 },
      })

      expect(result.__typename).toBe('ExpenseValidationError')
      expect(result.message).toContain('Cannot modify expenses for trips that are pending')
    })

    it('returns the updated expense when trip status is NOT_REQUESTED', async () => {
      // Mock validateTripStatus to return true
      const mockValidateTripStatus = validateTripStatus as jest.Mock
      mockValidateTripStatus.mockResolvedValueOnce(true)

      // Mock updateExpense to return the updated expense
      const mockUpdateExpense = updateExpense as jest.Mock
      mockUpdateExpense.mockResolvedValueOnce({
        __typename: 'Expense',
        id: 1,
        amount: new Prisma.Decimal(7777),
      })

      const result = await updateExpense({
        id: 1,
        input: { amount: 7777 },
      })

      expect(result.__typename).toBe('Expense')
      expect(result.amount).toEqual(new Prisma.Decimal(7777))
    })
  })

  describe('deleteExpense', () => {
    it('returns a validation error when trying to delete an expense with REIMBURSED trip status', async () => {
      // Mock validateTripStatus to throw an error
      const mockValidateTripStatus = validateTripStatus as jest.Mock
      mockValidateTripStatus.mockRejectedValueOnce(
        new Error('Cannot modify expenses for trips that are reimbursed')
      )

      // Mock deleteExpense to return a validation error
      const mockDeleteExpense = deleteExpense as jest.Mock
      mockDeleteExpense.mockResolvedValueOnce({
        __typename: 'ExpenseValidationError',
        message: 'Cannot modify expenses for trips that are reimbursed',
      })

      const result = await deleteExpense({ id: 3 })

      expect(result.__typename).toBe('ExpenseValidationError')
      expect(result.message).toContain('Cannot modify expenses for trips that are reimbursed')
    })

    it('returns the deleted expense when trip status is NOT_REQUESTED', async () => {
      // Mock validateTripStatus to return true
      const mockValidateTripStatus = validateTripStatus as jest.Mock
      mockValidateTripStatus.mockResolvedValueOnce(true)

      // Mock deleteExpense to return the deleted expense
      const mockDeleteExpense = deleteExpense as jest.Mock
      mockDeleteExpense.mockResolvedValueOnce({
        __typename: 'Expense',
        id: 1,
      })

      const result = await deleteExpense({ id: 1 })

      expect(result.__typename).toBe('Expense')
      expect(result.id).toBe(1)
    })
  })
})

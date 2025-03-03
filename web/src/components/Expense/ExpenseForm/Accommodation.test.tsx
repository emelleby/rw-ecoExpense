import userEvent from '@testing-library/user-event'

import { render, screen, waitFor } from '@redwoodjs/testing/web'

import { Accommodation } from './Accommodation'
import { getCurrencyConversionRate } from './service'

// Mock the service function
jest.mock('./service', () => ({
  getCurrencyConversionRate: jest.fn().mockResolvedValue(1),
}))

// Mock DOM APIs that might be missing in the test environment
beforeAll(() => {
  // Mock hasPointerCapture if it doesn't exist
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = jest.fn(() => false)
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = jest.fn()
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = jest.fn()
  }
})

describe('Accommodation', () => {
  const mockTrips = [
    { id: 1, name: 'Business Trip 1' },
    { id: 2, name: 'Business Trip 2' },
  ]

  const defaultProps = {
    trips: mockTrips,
    onSave: jest.fn(),
    error: undefined,
    loading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders successfully', () => {
    expect(() => {
      render(<Accommodation {...defaultProps} />)
    }).not.toThrow()
  })

  it('renders all form fields', () => {
    render(<Accommodation {...defaultProps} />)

    // Check for form labels
    expect(screen.getByText('Accommodation Type')).toBeInTheDocument()
    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByText('# People')).toBeInTheDocument()
    expect(screen.getByText('# Nights')).toBeInTheDocument()
    expect(screen.getByText('Merchant')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Currency')).toBeInTheDocument()
    expect(screen.getByText('Exchange rate')).toBeInTheDocument()
  })

  // Alternative approach - use React Testing Library's form submission
  it('submits form with direct form submission', async () => {
    const onSave = jest.fn()

    // Mock the global fetch function if it's used in the component
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ rate: 1 }),
    })

    render(<Accommodation {...defaultProps} onSave={onSave} />)

    // Fill in the minimum required fields

    // Select a trip - using the custom Combobox component
    const tripTrigger = screen.getByText(/select a trip/i, { exact: false })
    await userEvent.click(tripTrigger)

    // Wait for the dropdown to appear and select the first trip
    const tripOption = await screen.findByText('Business Trip 1')
    await userEvent.click(tripOption)

    // Fill in amount
    const amountInput = screen.getByTestId('amount-input')
    await userEvent.clear(amountInput)
    await userEvent.type(amountInput, '100')

    // Set currency to NOK - using the custom Select component
    const currencyTrigger = screen.getByText(/select currency/i, {
      exact: false,
    })
    await userEvent.click(currencyTrigger)

    // Wait for the dropdown to appear and select NOK
    const nokOption = await screen.findByText('NOK')
    await userEvent.click(nokOption)

    // Set exchange rate
    const exchangeRateInput = screen.getByTestId('exchange-rate-input')
    await userEvent.clear(exchangeRateInput)
    await userEvent.type(exchangeRateInput, '1')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(submitButton)

    // Wait for the onSave to be called
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 100,
          currency: 'NOK',
          exchangeRate: 1,
          tripId: 1,
        }),
        undefined
      )
    })
  })

  it('updates NOK amount when amount changes', async () => {
    render(<Accommodation {...defaultProps} />)

    const amountInput = screen.getByTestId('amount-input')
    await userEvent.clear(amountInput)
    await userEvent.type(amountInput, '100')

    await waitFor(() => {
      const nokAmountField = screen.getByText('NOK amount')
      expect(nokAmountField).toBeInTheDocument()
    })
  })
})

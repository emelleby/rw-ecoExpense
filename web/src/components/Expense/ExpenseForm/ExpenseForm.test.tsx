import userEvent from '@testing-library/user-event'

import { render, screen } from '@redwoodjs/testing/web'

import ExpenseForm from './ExpenseForm'

jest.mock('./service', () => ({
  getCurrencyConversionRate: jest.fn().mockResolvedValue(1),
}))

beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = jest.fn(() => false)
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = jest.fn()
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = jest.fn()
  }
  Element.prototype.scrollIntoView = jest.fn()
})

describe('ExpenseForm travel categories', () => {
  const categories = [
    { id: 1, name: 'Accommodation' },
    { id: 2, name: 'Car - distance-based' },
    { id: 3, name: 'Fuel Expenses' },
    { id: 4, name: 'Flights' },
    { id: 5, name: 'Groceries' },
    { id: 6, name: 'Other miscellaneous' },
    { id: 25, name: 'Bus', group: 'Travel' },
    { id: 26, name: 'Train', group: 'Travel' },
    { id: 27, name: 'Ferry', group: 'Travel' },
    { id: 28, name: 'Road toll', group: 'Travel' },
    { id: 29, name: 'Rental car', group: 'Travel' },
  ]

  const defaultProps = {
    trips: [{ id: 1, name: 'Business Trip 1' }],
    categories,
    onSave: jest.fn(),
    error: undefined,
    loading: false,
  }

  it('groups the new travel categories under a "Travel" optgroup', async () => {
    render(<ExpenseForm {...defaultProps} />)

    await userEvent.click(screen.getByText('Accommodation').closest('button'))

    expect(screen.getByText('Travel')).toBeInTheDocument()
    for (const name of ['Bus', 'Train', 'Ferry', 'Road toll', 'Rental car']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })

  it('renders a distance field for Bus (distance-based emissions)', async () => {
    render(<ExpenseForm {...defaultProps} />)

    await userEvent.click(screen.getByText('Accommodation').closest('button'))
    await userEvent.click(screen.getByText('Bus'))

    expect(await screen.findByText('Distance')).toBeInTheDocument()
  })

  it('renders no distance field for Road toll (spend-based emissions)', async () => {
    render(<ExpenseForm {...defaultProps} />)

    await userEvent.click(screen.getByText('Accommodation').closest('button'))
    await userEvent.click(screen.getByText('Road toll'))

    expect(await screen.findByText('Amount')).toBeInTheDocument()
    expect(screen.queryByText('Distance')).not.toBeInTheDocument()
  })
})

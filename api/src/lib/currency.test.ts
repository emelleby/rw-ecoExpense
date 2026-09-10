import { getConversionRate } from './currency'

// The conversion is a money path: a silent wrong answer here quietly corrupts
// every reimbursement figure. These assert the contract callers depend on —
// above all that failure is null, never 0.

describe('getConversionRate', () => {
  const realFetch = global.fetch
  const mockFetch = (impl) => {
    global.fetch = jest.fn(impl) as unknown as typeof fetch
  }

  afterEach(() => {
    global.fetch = realFetch
  })

  it('returns 1 without calling out when base equals symbol', async () => {
    mockFetch(() => {
      throw new Error('should not be called')
    })

    expect(await getConversionRate('EUR', 'EUR', new Date())).toBe(1)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns the quoted rate', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({ rates: { EUR: 0.086 } }),
    }))

    expect(await getConversionRate('NOK', 'EUR', new Date('2025-01-15'))).toBe(
      0.086
    )
  })

  it('quotes a past expense at its own date, not today', async () => {
    mockFetch(async () => ({ ok: true, json: async () => ({ rates: { EUR: 1 } }) }))

    await getConversionRate('NOK', 'EUR', new Date('2025-01-15'))

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/2025-01-15?base=NOK&symbols=EUR')
    )
  })

  it('returns null, never 0, when the request throws', async () => {
    mockFetch(async () => {
      throw new Error('network down')
    })

    expect(await getConversionRate('NOK', 'EUR', new Date())).toBeNull()
  })

  it('returns null when the symbol is absent from the response', async () => {
    // Frankfurter quotes ~31 currencies; an unsupported pick comes back empty.
    mockFetch(async () => ({ ok: true, json: async () => ({ rates: {} }) }))

    expect(await getConversionRate('NOK', 'XYZ', new Date())).toBeNull()
  })

  it('returns null on a non-OK response', async () => {
    mockFetch(async () => ({ ok: false, status: 500, json: async () => ({}) }))

    expect(await getConversionRate('NOK', 'EUR', new Date())).toBeNull()
  })
})

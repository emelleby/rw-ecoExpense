import { logger } from 'src/lib/logger'

/**
 * Fetch an exchange rate from Frankfurter, quoted at `date`.
 *
 * Mirrors the web-side getCurrencyConversionRate
 * (web/src/components/Expense/ExpenseForm/service.ts) — same host, same
 * latest-vs-dated endpoint switch — but returns null rather than 0 on failure,
 * so a caller can never silently persist a zero-rate conversion.
 */
export const getConversionRate = async (
  base: string,
  symbol: string,
  date: Date
): Promise<number | null> => {
  if (!base || !symbol) return null
  if (base === symbol) return 1

  const day = new Date(date).toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]
  // Frankfurter has no rates for future dates; fall back to the latest quote.
  const path = today <= day ? 'latest' : day

  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/${path}?base=${base}&symbols=${symbol}`
    )
    if (!response.ok) {
      logger.warn(
        { status: response.status, base, symbol, day },
        'Frankfurter returned a non-OK response'
      )
      return null
    }
    const json = await response.json()
    const rate = json?.rates?.[symbol]
    return typeof rate === 'number' ? rate : null
  } catch (error) {
    logger.warn({ error, base, symbol, day }, 'Conversion rate lookup failed')
    return null
  }
}

import axios from 'axios'

export async function getCurrencyConversionRate(base, date) {
  try {
    const response = await axios.get(
      `https://api.frankfurter.dev/v1/${date}?base=${base}&symbols=NOK`
    )
    return response.data.rates.NOK || 0
  } catch (error) {
    //console.error('Error fetching conversion rate:', error)
    return 0
  }
}

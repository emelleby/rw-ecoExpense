// api/src/functions/flightEmissions.ts
import axios from 'axios'

/**
 * This function proxies requests to the flight emissions calculation API
 * to avoid CORS issues when calling the API directly from the frontend.
 */
export const handler = async (
  event: { httpMethod: string; body: string },
  _context: any
) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body || '{}')
    console.log('Received request body:', requestBody)

    // Forward the request to the external API
    const response = await axios.post(
      'https://g-flightapi-318955611692.europe-north1.run.app/api/v1/calculate-emissions',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    console.log('Received response from external API:', response.data)

    // Return the response
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response.data),
    }
  } catch (error) {
    console.error('Error in flight emissions proxy:', error)

    let statusCode = 500
    let errorMessage = 'Internal server error'

    if (axios.isAxiosError(error) && error.response) {
      statusCode = error.response.status
      errorMessage = error.response.data?.message || error.message
    }

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    }
  }
}

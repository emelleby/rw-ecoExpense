export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: `${process.env.HELLO_ENV}\n${process.env.REDWOOD_ENV_GOOGLE_MAPS_API_KEY}`,
  }
}

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  customerRates: [
    {
      __typename: 'CustomerRates' as const,
      id: 42,
    },
    {
      __typename: 'CustomerRates' as const,
      id: 43,
    },
    {
      __typename: 'CustomerRates' as const,
      id: 44,
    },
  ],
})

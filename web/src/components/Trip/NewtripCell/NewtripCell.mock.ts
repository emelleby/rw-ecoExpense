// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  newtrip: {
    __typename: 'newtrip' as const,
    id: 42,
  },
})

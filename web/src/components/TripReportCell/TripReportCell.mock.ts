// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  tripReport: {
    __typename: 'TripReport' as const,
    id: 42,
  },
})

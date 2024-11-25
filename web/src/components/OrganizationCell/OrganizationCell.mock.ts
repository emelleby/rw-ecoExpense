// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  organization: {
    __typename: 'Organization' as const,
    id: 42,
  },
})

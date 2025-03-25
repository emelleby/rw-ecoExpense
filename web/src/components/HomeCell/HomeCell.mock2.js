// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  home: {
    __typename: 'home' as const,
    id: 42,
  },
})

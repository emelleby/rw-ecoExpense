// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  projects: [
    {
      __typename: 'Project' as const,
      id: 42,
    },
    {
      __typename: 'Project' as const,
      id: 43,
    },
    {
      __typename: 'Project' as const,
      id: 44,
    },
  ],
})

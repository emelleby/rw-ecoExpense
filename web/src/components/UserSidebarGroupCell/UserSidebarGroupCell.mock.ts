// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  userSidebarGroup: {
    __typename: 'UserSidebarGroup' as const,
    id: 42,
  },
})

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  user: {
    __typename: 'User' as const,
    id: 42,
    homeAddress: null,
    workAddress: null,
    homeLatitude: null,
    homeLongitude: null,
    workLatitude: null,
    workLongitude: null,
  },
})

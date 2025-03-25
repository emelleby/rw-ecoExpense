interface UserSidebarGroupData {
  projects: Array<{
    id: number
    name: string
  }>
  tripsByUser: Array<{
    id: number
    name: string
  }>
}

export const standard = (): UserSidebarGroupData => ({
  projects: [
    {
      id: 1,
      name: 'Website Redesign',
    },
    {
      id: 2,
      name: 'Mobile App Development',
    },
    {
      id: 3,
      name: 'Cloud Migration',
    },
    {
      id: 4,
      name: 'Data Analytics Platform',
    },
    {
      id: 5,
      name: 'Security Audit',
    },
  ],
  tripsByUser: [
    {
      id: 1,
      name: 'Client Meeting in Oslo',
    },
    {
      id: 2,
      name: 'Tech Conference Berlin',
    },
    {
      id: 3,
      name: 'Team Offsite Stockholm',
    },
  ],
})

export const empty = (): UserSidebarGroupData => ({
  projects: [],
  tripsByUser: [],
})

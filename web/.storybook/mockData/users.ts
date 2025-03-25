import type { MockUser } from '../providers/StoryAuthProvider'

export const mockUsers: Record<string, MockUser> = {
  admin: {
    id: 'user_admin',
    dbUserId: 1,
    organizationId: 1,
    roles: ['admin'],
    metadata: {
      organizationId: 1,
      roles: ['admin'],
    },
  },
  member: {
    id: 'user_member',
    dbUserId: 2,
    organizationId: 1,
    roles: ['member'],
    metadata: {
      organizationId: 1,
      roles: ['member'],
    },
  },
  newUser: {
    id: 'user_new',
    dbUserId: 3,
    organizationId: null,
    roles: [],
    metadata: {
      organizationId: null,
      roles: [],
    },
  },
  superuser: {
    id: 'user_super',
    dbUserId: 4,
    organizationId: 1,
    roles: ['superuser'],
    metadata: {
      organizationId: 1,
      roles: ['superuser'],
    },
  },
}

/**
 * Extra test setup, run after Redwood's own jest setup (see jest.config.js).
 */
import React from 'react'

// jsdom has no matchMedia; responsive hooks (e.g. the sidebar's useIsMobile)
// need it. Report a desktop-sized, non-matching viewport.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

// Components call Clerk hooks directly, which throw outside <ClerkProvider>.
// Provide a signed-in test user instead of a real Clerk instance.
jest.mock('@clerk/clerk-react', () => {
  const user = {
    id: 'user_test',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    imageUrl: '',
    primaryEmailAddress: { emailAddress: 'test@example.com' },
    emailAddresses: [{ emailAddress: 'test@example.com' }],
    publicMetadata: {},
    unsafeMetadata: {},
    reload: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
  }
  const Passthrough = ({ children }: { children?: React.ReactNode }) =>
    children ?? null

  return {
    ...jest.requireActual('@clerk/clerk-react'),
    ClerkProvider: Passthrough,
    SignedIn: Passthrough,
    SignedOut: () => null,
    SignInButton: Passthrough,
    UserButton: () => null,
    useUser: () => ({ isLoaded: true, isSignedIn: true, user }),
    useAuth: () => ({
      isLoaded: true,
      isSignedIn: true,
      userId: user.id,
      getToken: jest.fn(() => Promise.resolve('test-token')),
      signOut: jest.fn(),
    }),
    useClerk: () => ({ signOut: jest.fn(), openSignIn: jest.fn() }),
  }
})

// The Google Maps web components ship untranspiled ES modules that Jest
// cannot load; tests don't exercise the map widgets.
jest.mock('@googlemaps/extended-component-library/react', () => ({
  APILoader: () => null,
  PlacePicker: () => null,
}))

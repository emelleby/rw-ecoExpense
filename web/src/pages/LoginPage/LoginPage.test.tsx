import { act, render, screen } from '@redwoodjs/testing/web'

import LoginPage from './LoginPage'

// Clerk's control components require a live ClerkProvider context, which the
// jsdom test environment does not have. Simulate the two client states that
// matter for this page: signed out, and signed in while the app is still
// restoring its Redwood auth state.
const mockClerkState = { signedIn: false }

jest.mock('@clerk/clerk-react', () => ({
  SignInButton: ({ children }) => <>{children}</>,
  SignedOut: ({ children }) => (mockClerkState.signedIn ? null : <>{children}</>),
  SignedIn: ({ children }) => (mockClerkState.signedIn ? <>{children}</> : null),
}))

const mockUseAuth = jest.fn()

jest.mock('src/auth', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    mockClerkState.signedIn = false
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      hasRole: () => false,
      signUp: jest.fn(),
      reauthenticate: jest.fn(),
      logOut: jest.fn(),
    })
  })

  it('renders the sign-in form when the visitor is signed out', () => {
    render(<LoginPage />)

    expect(screen.getByText('Welcome to EcoExpense')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'sign up' })).toBeInTheDocument()
  })

  it('renders a restoring state instead of the sign-in form when a Clerk session exists but auth is still resolving', () => {
    // Regression: this state used to render the signed-out page with all
    // buttons hidden by <SignedOut> — a welcome heading with no buttons and
    // nowhere to navigate.
    mockClerkState.signedIn = true
    render(<LoginPage />)

    expect(screen.queryByText('Welcome to EcoExpense')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('offers retry and sign-out when the session restore never completes', () => {
    jest.useFakeTimers()
    mockClerkState.signedIn = true
    render(<LoginPage />)

    act(() => {
      jest.advanceTimersByTime(10000)
    })

    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('redirects to onboarding when authenticated without a role', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      hasRole: () => false,
      signUp: jest.fn(),
    })
    render(<LoginPage />)

    expect(screen.queryByText('Welcome to EcoExpense')).not.toBeInTheDocument()
  })
})

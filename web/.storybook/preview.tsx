// .storybook/preview.tsx
import React from 'react'

// import { AuthProvider } from 'web/src/auth.tsx' // your custom auth provider, configured for Clerk

// import { RedwoodProvider } from '@redwoodjs/web'
// import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

// export const decorators = [
//   (Story) => (
//     <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
//       <AuthProvider type="clerk">
//         <RedwoodApolloProvider>
//           <Story />
//         </RedwoodApolloProvider>
//       </AuthProvider>
//     </RedwoodProvider>
//   ),
// ]

import { ClerkProvider } from '@clerk/clerk-react'

// Use your actual publishable key or a dummy key for Storybook.
const publishableKey =
  process.env.CLERK_PUBLISHABLE_KEY || 'your-publishable-key'

export const decorators = [
  (Story) => (
    <ClerkProvider publishableKey={publishableKey}>
      <Story />
    </ClerkProvider>
  ),
]

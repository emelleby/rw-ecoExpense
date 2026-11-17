export {}
// Vite asset imports (e.g. the pdf.js worker `?url`)
declare module '*?url' {
  const src: string
  export default src
}
// Create a type for the roles
export type Roles = 'admin' | 'member'
declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
      role?: Roles
    }
  }
}

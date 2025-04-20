// Type definitions for extending RedwoodJS Route component
import '@redwoodjs/router'

declare module '@redwoodjs/router' {
  interface RouteProps {
    title?: string
  }
}

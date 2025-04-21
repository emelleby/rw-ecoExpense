// Type definitions for page components with optional pageTitle
import { RouteProps } from '@redwoodjs/router'

declare global {
  // Extend the RouteProps interface to include pageTitle
  interface PageProps extends RouteProps {
    pageTitle?: string
  }
}

export {}

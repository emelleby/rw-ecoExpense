import React from 'react'

import { SidebarProvider } from './Sidebar'

// Mock matchMedia if it's not available
if (typeof window !== 'undefined') {
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

export const SidebarStoryWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // Mock document.cookie to prevent cookie access errors
  if (typeof window !== 'undefined' && !window.document.cookie) {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'sidebar:state=expanded',
    })
  }

  return (
    <div className="relative min-h-screen">
      <SidebarProvider defaultOpen={true}>
        <div style={{ margin: '1rem' }}>{children}</div>
      </SidebarProvider>
    </div>
  )
}

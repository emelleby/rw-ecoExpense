import React from 'react'

import type { Preview } from '@storybook/react'

import { SidebarStoryWrapper } from '../src/components/ui/SidebarStoryWrapper'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <SidebarStoryWrapper>
        <Story />
      </SidebarStoryWrapper>
    ),
  ],
}

export default preview

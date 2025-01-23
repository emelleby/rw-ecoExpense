// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import UserSidebarGroup from './UserSidebarGroup'

const meta: Meta<typeof UserSidebarGroup> = {
  component: UserSidebarGroup,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof UserSidebarGroup>

export const Primary: Story = {}

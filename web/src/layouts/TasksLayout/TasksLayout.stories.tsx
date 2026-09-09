import type { Meta, StoryObj } from '@storybook/react'

import TaskLayout from './TasksLayout'

const meta: Meta<typeof TaskLayout> = {
  component: TaskLayout,
}

export default meta

type Story = StoryObj<typeof TaskLayout>

export const Primary: Story = {}

import type { Meta, StoryObj } from '@storybook/react'

import TasksPage from './TasksPage'

const meta: Meta<typeof TasksPage> = {
  component: TasksPage,
}

export default meta

type Story = StoryObj<typeof TasksPage>

export const Primary: Story = {}

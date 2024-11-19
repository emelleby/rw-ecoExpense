import type { Meta, StoryObj } from '@storybook/react'

import AddExpensePage from './AddExpensePage'

const meta: Meta<typeof AddExpensePage> = {
  component: AddExpensePage,
}

export default meta

type Story = StoryObj<typeof AddExpensePage>

export const Primary: Story = {}

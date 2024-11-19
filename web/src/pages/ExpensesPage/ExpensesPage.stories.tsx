import type { Meta, StoryObj } from '@storybook/react'

import ExpensesPage from './ExpensesPage'

const meta: Meta<typeof ExpensesPage> = {
  component: ExpensesPage,
}

export default meta

type Story = StoryObj<typeof ExpensesPage>

export const Primary: Story = {}

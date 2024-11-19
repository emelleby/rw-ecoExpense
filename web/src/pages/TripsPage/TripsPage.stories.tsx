import type { Meta, StoryObj } from '@storybook/react'

import TripsPage from './TripsPage'

const meta: Meta<typeof TripsPage> = {
  component: TripsPage,
}

export default meta

type Story = StoryObj<typeof TripsPage>

export const Primary: Story = {}

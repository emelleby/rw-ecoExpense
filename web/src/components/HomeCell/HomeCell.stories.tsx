import type { Meta, StoryObj } from '@storybook/react'

import { Loading, Empty, Failure, Success } from './HomeCell'
import { standard } from './HomeCell.mock'

const meta: Meta = {
  title: 'Cells/HomeCell',
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

export const success: Story = {
  render: () => {
    return <Success dashboard={standard().dashboard} />
  },
}

export const loading: Story = {
  render: Loading,
}

export const empty: Story = {
  render: Empty,
}

export const failure: Story = {
  render: () => {
    return (
      <Failure
        error={new Error('Something went wrong loading the dashboard')}
      />
    )
  },
}

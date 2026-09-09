import userEvent from '@testing-library/user-event'

import { render, screen, waitFor } from '@redwoodjs/testing/web'
import { Form, Label, Submit, TextField } from '@redwoodjs/forms'

import { decimalField } from './constants'

const Harness = ({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) => (
  <Form onSubmit={onSubmit}>
    <Label name="amount">Amount</Label>
    <TextField name="amount" validation={{ required: true, ...decimalField }} />
    <Submit>Save</Submit>
  </Form>
)

describe('decimal amount input', () => {
  it('accepts a comma as decimal delimiter', async () => {
    const onSubmit = jest.fn()
    render(<Harness onSubmit={onSubmit} />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Amount'), '12,5')
    await user.click(screen.getByText('Save'))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].amount).toBe(12.5)
  })

  it('still accepts a dot as decimal delimiter', async () => {
    const onSubmit = jest.fn()
    render(<Harness onSubmit={onSubmit} />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Amount'), '12.5')
    await user.click(screen.getByText('Save'))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].amount).toBe(12.5)
  })

  it('blocks submission when empty', async () => {
    const onSubmit = jest.fn()
    render(<Harness onSubmit={onSubmit} />)
    const user = userEvent.setup()
    await user.click(screen.getByText('Save'))
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

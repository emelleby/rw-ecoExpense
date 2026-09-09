import { render, screen, waitFor } from '@redwoodjs/testing/web'

import { Loading, Empty, Failure, Success } from './TasksCell'
import { standard } from './TasksCell.mock'

describe('TasksCell', () => {
  it('renders Loading successfully', async () => {
    render(<Loading />)
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
  })

  it('renders Empty successfully', async () => {
    render(<Empty />)
    expect(screen.getByText('No tasks found')).toBeInTheDocument()
  })

  it('renders Failure successfully', async () => {
    render(<Failure error={new Error('Oh no')} />)
    expect(screen.getByText('Error loading tasks: Oh no')).toBeInTheDocument()
  })

  it('renders Success successfully', async () => {
    const tasks = standard().tasks
    render(<Success tasks={tasks} />)

    await waitFor(() => {
      expect(screen.getByText(tasks[0].title)).toBeInTheDocument()
    })
  })
})

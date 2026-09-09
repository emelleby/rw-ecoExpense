import { readFile } from 'fs/promises'

import { tasks } from './tasks'

// Mock fs/promises readFile
jest.mock('fs/promises')

describe('tasks', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks()
  })

  it('returns tasks from tasks.json when file exists and is valid', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        details: 'Test Details',
        testStrategy: 'Test Strategy',
        priority: 'high',
        dependencies: [],
        status: 'pending',
        subtasks: [],
      },
    ]

    ;(readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockTasks))

    const result = await tasks()

    expect(result).toEqual(
      mockTasks.map((task) => ({ ...task, isFromFallback: false }))
    )
  })

  it('returns fallback task when tasks.json does not contain an array', async () => {
    ;(readFile as jest.Mock).mockResolvedValue('{"notAnArray": true}')

    const result = await tasks()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(
      expect.objectContaining({
        title: 'Sample Task',
        isFromFallback: true,
      })
    )
  })

  it('returns fallback task when tasks.json cannot be read', async () => {
    ;(readFile as jest.Mock).mockRejectedValue(new Error('File not found'))

    const result = await tasks()

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(
      expect.objectContaining({
        title: 'Sample Task',
        isFromFallback: true,
      })
    )
  })
})

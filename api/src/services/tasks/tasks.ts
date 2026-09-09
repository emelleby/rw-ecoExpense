import { readFile } from 'fs/promises'
import { join } from 'path'

import type { QueryResolvers, Task } from 'types/graphql'

export const tasks: QueryResolvers['tasks'] = async () => {
  try {
    // Read the tasks.json file
    const tasksFile = await readFile(
      join(process.cwd(), 'tasks', 'tasks.json'),
      'utf-8'
    )
    const tasksData = JSON.parse(tasksFile)

    // Extract the tasks array from the JSON structure
    const tasksArray = tasksData.tasks || tasksData

    if (!Array.isArray(tasksArray)) {
      // If tasks.json doesn't contain an array, return fallback data
      console.warn('tasks.json does not contain a valid tasks array')
      return [getFallbackTask()]
    }

    // Return the actual tasks with isFromFallback set to false
    return tasksArray.map((task: Omit<Task, 'isFromFallback'>) => ({
      ...task,
      isFromFallback: false,
    }))
  } catch (error) {
    // Log the error and return fallback data
    console.error('Error reading tasks:', error)
    return [getFallbackTask()]
  }
}

function getFallbackTask(): Task {
  return {
    id: 1,
    title: 'Sample Task',
    description:
      'This is a fallback task since tasks.json could not be accessed.',
    details: 'Please ensure tasks.json exists and is properly formatted.',
    testStrategy: 'Not applicable',
    priority: 'medium',
    dependencies: [],
    status: 'pending',
    subtasks: [],
    isFromFallback: true,
  }
}

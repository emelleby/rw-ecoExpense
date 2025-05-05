import { useState } from 'react'

import TaskDetailsModal from 'src/components/TaskDetailsModal/TaskDetailsModal'
import { Button } from 'src/components/ui/Button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/Table'

interface Task {
  id: number
  title: string
  description: string
  details: string
  testStrategy: string
  priority: string
  dependencies: number[]
  status: string
  subtasks: any[]
  isFromFallback?: boolean
}

interface TasksData {
  tasks: Task[]
}

export const QUERY = gql`
  query TasksQuery {
    tasks {
      id
      title
      description
      details
      testStrategy
      priority
      dependencies
      status
      subtasks
      isFromFallback
    }
  }
`

// Type for the data returned by the QUERY
export type TasksQueryResponse = {
  tasks: Task[]
}

export const Loading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-sky-500"></div>
    <span className="ml-2">Loading tasks...</span>
  </div>
)

export const Empty = () => (
  <div className="rounded-md border p-8 text-center">
    <p className="text-gray-500">No tasks found</p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-700">
    <h3 className="text-lg font-semibold">Error loading tasks</h3>
    <p className="mt-2">{error.message}</p>
    <p className="mt-2">
      Please make sure the tasks.json file is accessible and properly formatted.
    </p>
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-medium">Technical Details</summary>
      <pre className="mt-2 max-h-40 overflow-auto rounded bg-rose-100 p-2 text-xs">
        {JSON.stringify(error, null, 2)}
      </pre>
    </details>
  </div>
)

export const Success = ({ tasks }: TasksQueryResponse) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const closeTaskDetails = () => {
    setIsModalOpen(false)
  }

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-200'
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'in-progress':
        return 'bg-sky-100 text-sky-800 border-sky-200'
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Check if any of the tasks are from the fallback data
  const isUsingFallbackData = tasks.some(task => task.isFromFallback)

  return (
    <>
      {isUsingFallbackData && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>Note:</strong> Displaying fallback task data because the tasks.json file could not be accessed.
            </span>
          </p>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableCaption>List of development tasks</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dependencies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className={task.isFromFallback ? "bg-amber-50/30" : ""}
              >
                <TableCell>
                  {task.id}
                  {task.isFromFallback && (
                    <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-amber-400" title="Fallback data"></span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  {task.description.length > 100
                    ? `${task.description.substring(0, 100)}...`
                    : task.description}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPriorityClass(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>
                  {task.dependencies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {task.dependencies.map((depId) => (
                        <span
                          key={depId}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                        >
                          #{depId}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTaskDetails(task)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={closeTaskDetails}
      />
    </>
  )
}

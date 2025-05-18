import React from 'react'

import { Button } from 'src/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/Dialog'

// Use the same Task interface as in TasksPage
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

interface TaskDetailsModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

const TaskDetailsModal = ({ task, isOpen, onClose }: TaskDetailsModalProps) => {
  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Task #{task.id}: {task.title}
            {task.isFromFallback && (
              <span className="ml-2 inline-flex items-center rounded-full border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning-foreground dark:bg-warning/20 dark:text-warning-foreground">
                Fallback Data
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                task.priority === 'high'
                  ? 'bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20'
                  : task.priority === 'medium'
                  ? 'bg-warning/10 text-warning-foreground border-warning/20 dark:bg-warning/20'
                  : 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20'
              } mr-2`}
            >
              {task.priority}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                task.status === 'completed'
                  ? 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20'
                  : task.status === 'in-progress'
                  ? 'bg-accent/50 text-accent-foreground border-accent/20 dark:bg-accent/30'
                  : 'bg-muted text-muted-foreground border-muted/20'
              }`}
            >
              {task.status}
            </span>
          </DialogDescription>

          {task.isFromFallback && (
            <div className="mt-2 rounded-md border border-warning/30 bg-warning/10 p-2 text-sm text-warning-foreground dark:bg-warning/5">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>
                  This is fallback data because the tasks.json file could not be accessed.
                </span>
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p className="mt-1 text-foreground">{task.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Details</h3>
            <div className="mt-1 whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-sm text-foreground dark:bg-muted/20">
              {task.details}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Test Strategy</h3>
            <div className="mt-1 whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-sm text-foreground dark:bg-muted/20">
              {task.testStrategy}
            </div>
          </div>

          {task.dependencies.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Dependencies</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {task.dependencies.map((depId) => (
                  <span
                    key={depId}
                    className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                  >
                    Task #{depId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {task.subtasks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Subtasks</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-foreground">
                {task.subtasks.map((subtask, index) => (
                  <li key={index}>{subtask}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TaskDetailsModal

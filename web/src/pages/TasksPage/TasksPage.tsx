import { Metadata } from '@redwoodjs/web'

import TasksCell from 'src/components/TasksCell'

const TasksPage = () => {
  return (
    <>
      <Metadata title="Tasks" description="Tasks page" />
      <TasksCell />
    </>
  )
}

export default TasksPage

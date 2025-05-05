import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

type TaskLayoutProps = {
  title: string
  children?: React.ReactNode
}

const TaskLayout = ({ title, children }: TaskLayoutProps) => {
  return (
    <div className="rw-scaffold min-h-screen">
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="rw-header border border-b-1 border-gray-200">
        <Link to={routes.homey()}>Home</Link>
        <h1 className="rw-heading rw-heading-primary">

            {title}

        </h1>

      </header>
      <main className="rw-main mt-4">{children}</main>
    </div>
  )
}

export default TaskLayout





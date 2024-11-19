// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ProjectsPage = () => {
  return (
    <>
      <Metadata title="Projects" description="Projects page" />

      <h1>ProjectsPage</h1>
      <p>
        Find me in <code>./web/src/pages/ProjectsPage/ProjectsPage.tsx</code>
      </p>
      {/*
          My default route is named `projects`, link to me with:
          `<Link to={routes.projects()}>Projects</Link>`
      */}
    </>
  )
}

export default ProjectsPage

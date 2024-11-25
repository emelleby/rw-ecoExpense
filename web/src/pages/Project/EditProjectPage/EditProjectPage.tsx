import EditProjectCell from 'src/components/Project/EditProjectCell'

type ProjectPageProps = {
  id: number
}

const EditProjectPage = ({ id }: ProjectPageProps) => {
  return <EditProjectCell id={id} />
}

export default EditProjectPage

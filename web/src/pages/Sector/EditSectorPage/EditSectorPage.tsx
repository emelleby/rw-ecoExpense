import EditSectorCell from 'src/components/Sector/EditSectorCell'

type SectorPageProps = {
  id: number
}

const EditSectorPage = ({ id }: SectorPageProps) => {
  return <EditSectorCell id={id} />
}

export default EditSectorPage

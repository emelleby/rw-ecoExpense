import SectorCell from 'src/components/Sector/SectorCell'

type SectorPageProps = {
  id: number
}

const SectorPage = ({ id }: SectorPageProps) => {
  return <SectorCell id={id} />
}

export default SectorPage

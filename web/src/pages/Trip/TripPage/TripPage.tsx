import TripCell from 'src/components/Trip/TripCell'

type TripPageProps = {
  id: number
}

const TripPage = ({ id }: TripPageProps) => {
  return <TripCell id={id} />
}

export default TripPage

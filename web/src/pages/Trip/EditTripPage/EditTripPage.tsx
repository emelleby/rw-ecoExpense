import EditTripCell from 'src/components/Trip/EditTripCell'

type TripPageProps = {
  id: number
}

const EditTripPage = ({ id }: TripPageProps) => {
  return <EditTripCell id={id} />
}

export default EditTripPage

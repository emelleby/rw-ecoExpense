import type { FindUserById } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
} from '@redwoodjs/web'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'

import { Input } from 'src/components/ui/Input'
import { Label } from 'src/components/ui/Label'

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      homeAddress
      workAddress
      homeLatitude
      homeLongitude
      workLatitude
      workLongitude
    }
  }
`

export const QUERY = gql`
  query FindUserByIdForProfile($id: Int!) {
    user: user(id: $id) {
      id
      homeAddress
      workAddress
      homeLatitude
      homeLongitude
      workLatitude
      workLongitude
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ user }: CellSuccessProps<FindUserById>) => {
  const [updateUser] = useMutation(UPDATE_USER_PROFILE)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const handleAddressUpdate = async (type: 'home' | 'work', address: string) => {
    const geocoder = new google.maps.Geocoder()

    try {
      const result = await geocoder.geocode({ address })
      if (result.results[0]) {
        const { lat, lng } = result.results[0].geometry.location

        await updateUser({
          variables: {
            id: user.id,
            input: {
              [`${type}Address`]: address,
              [`${type}Latitude`]: lat(),
              [`${type}Longitude`]: lng(),
            },
          },
        })
        toast.success(`${type} address updated`)
      }
    } catch (error) {
      toast.error('Failed to update address')
    }
  }

  if (!isLoaded) return <div>Loading maps...</div>

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="homeAddress">Home Address</Label>
        <Input
          id="homeAddress"
          defaultValue={user.homeAddress}
          onBlur={(e) => handleAddressUpdate('home', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="workAddress">Work Address</Label>
        <Input
          id="workAddress"
          defaultValue={user.workAddress}
          onBlur={(e) => handleAddressUpdate('work', e.target.value)}
        />
      </div>

      {user.homeLatitude && user.homeLongitude && (
        <GoogleMap
          zoom={15}
          center={{ lat: user.homeLatitude, lng: user.homeLongitude }}
          mapContainerClassName="w-full h-64"
        >
          <Marker
            position={{ lat: user.homeLatitude, lng: user.homeLongitude }}
          />
        </GoogleMap>
      )}
    </div>
  )
}

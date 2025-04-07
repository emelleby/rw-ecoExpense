import type { FindUserById } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
} from '@redwoodjs/web'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
// Import the Google Maps API script directly
import { useEffect, useState } from 'react'
// No need to import anything special for the API key

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
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Load the Google Maps API script
  useEffect(() => {
    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true)
      return
    }

    // Fetch the API key from the backend
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Maps API key from backend')

        // Use the environment variable directly
        const apiKey = process.env.REDWOOD_ENV_GOOGLE_MAPS_API_KEY
        console.log('Google Maps API Key:', apiKey)

        if (!apiKey) {
          throw new Error('API key not found in response')
        }

        console.log('Successfully fetched Maps API key from backend')

        // Create a script element to load the Google Maps API
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => {
          console.log('Google Maps API loaded')
          setIsLoaded(true)
        }
        script.onerror = (error) => {
          console.error('Failed to load Google Maps API:', error)
          setMapError('Failed to load Google Maps API')
        }

        document.head.appendChild(script)
      } catch (error) {
        console.error('Error fetching Maps API key:', error)
        setMapError(`Failed to fetch Maps API key: ${error.message}`)
      }
    }

    fetchApiKey()

    return () => {
      // No need to clean up the script as it's beneficial to keep it loaded
      // for other components that might use Google Maps
    }
  }, [])

  const handleAddressUpdate = async (type: 'home' | 'work', address: string) => {
    console.log('Updating address:', type, address)
    if (!isLoaded) {
      console.error('Google Maps API not loaded')
      toast.error('Google Maps API not loaded')
      return
    }

    try {
      console.log('Creating Geocoder')
      const geocoder = new window.google.maps.Geocoder()
      console.log('Geocoder created')

      console.log('Geocoding address:', address)
      geocoder.geocode({ address }, (results: any, status: any) => {
        console.log('Geocoding result:', results, status)

        if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location
          const lat = location.lat()
          const lng = location.lng()
          console.log('Coordinates:', lat, lng)

          updateUser({
            variables: {
              id: user.id,
              input: {
                [`${type}Address`]: address,
                [`${type}Latitude`]: lat,
                [`${type}Longitude`]: lng,
              },
            },
          })
            .then(() => {
              toast.success(`${type} address updated`)
            })
            .catch((error) => {
              console.error('Error updating user:', error)
              toast.error('Failed to update user')
            })
        } else {
          console.error('No results found for address:', address, status)
          toast.error(`No results found for address: ${status}`)
        }
      })
    } catch (error) {
      console.error('Error updating address:', error)
      toast.error('Failed to update address: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  if (mapError) {
    return (
      <div className="space-y-6">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="text-lg font-medium text-red-800">Maps API Error</h3>
          <p className="mt-2 text-sm text-red-700">{mapError}</p>
          <p className="mt-2 text-sm text-red-700">
            You can still edit your addresses, but geocoding and map display are unavailable.
          </p>
        </div>
        <div>
          <Label htmlFor="homeAddress">Home Address</Label>
          <Input
            id="homeAddress"
            defaultValue={user.homeAddress}
            onChange={(e) => {
              // Simple update without geocoding
              if (e.target.value) {
                updateUser({
                  variables: {
                    id: user.id,
                    input: {
                      homeAddress: e.target.value,
                    },
                  },
                }).catch(error => {
                  console.error('Error updating address:', error)
                  toast.error('Failed to update address')
                })
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="workAddress">Work Address</Label>
          <Input
            id="workAddress"
            defaultValue={user.workAddress}
            onChange={(e) => {
              // Simple update without geocoding
              if (e.target.value) {
                updateUser({
                  variables: {
                    id: user.id,
                    input: {
                      workAddress: e.target.value,
                    },
                  },
                }).catch(error => {
                  console.error('Error updating address:', error)
                  toast.error('Failed to update address')
                })
              }
            }}
          />
        </div>
      </div>
    )
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
        <div id="map" className="w-full h-64" ref={(el) => {
          if (el && isLoaded) {
            const map = new window.google.maps.Map(el, {
              zoom: 15,
              center: { lat: user.homeLatitude, lng: user.homeLongitude },
            })
            new window.google.maps.Marker({
              position: { lat: user.homeLatitude, lng: user.homeLongitude },
              map,
            })
          }
        }} />
      )}
    </div>
  )
}

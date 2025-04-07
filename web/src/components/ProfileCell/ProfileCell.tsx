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

    // Define a global callback function for Google Maps to call when loaded
    window.initMap = () => {
      console.log('Google Maps API loaded via callback')
      setIsLoaded(true)
    }

    // Use the environment variable directly
    const apiKey = process.env.REDWOOD_ENV_GOOGLE_MAPS_API_KEY
    console.log('Google Maps API Key:', apiKey)

    if (!apiKey) {
      setMapError('Google Maps API key is missing')
      return
    }

    // Create a script element to load the Google Maps API with loading=async parameter
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&loading=async&callback=initMap`
    script.async = true
    script.defer = true
    script.onerror = (error) => {
      console.error('Failed to load Google Maps API:', error)
      setMapError('Failed to load Google Maps API')
    }

    document.head.appendChild(script)

    return () => {
      // Clean up the global callback when component unmounts
      delete window.initMap
    }
  }, [])

  // Set up autocomplete for address inputs
  useEffect(() => {
    if (!isLoaded) return;

    try {
      // Initialize autocomplete for home address
      const homeInput = document.getElementById('homeAddress') as HTMLInputElement;
      if (homeInput) {
        const homeAutocomplete = new window.google.maps.places.Autocomplete(homeInput, {
          types: ['address'],
        });

        // Add listener for place selection
        homeAutocomplete.addListener('place_changed', () => {
          const place = homeAutocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || homeInput.value;

            updateUser({
              variables: {
                id: user.id,
                input: {
                  homeAddress: address,
                  homeLatitude: lat,
                  homeLongitude: lng,
                },
              },
            })
              .then(() => {
                toast.success('Home address updated');
              })
              .catch((error) => {
                console.error('Error updating user:', error);
                toast.error('Failed to update user');
              });
          }
        });
      }

      // Initialize autocomplete for work address
      const workInput = document.getElementById('workAddress') as HTMLInputElement;
      if (workInput) {
        const workAutocomplete = new window.google.maps.places.Autocomplete(workInput, {
          types: ['address'],
        });

        // Add listener for place selection
        workAutocomplete.addListener('place_changed', () => {
          const place = workAutocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || workInput.value;

            updateUser({
              variables: {
                id: user.id,
                input: {
                  workAddress: address,
                  workLatitude: lat,
                  workLongitude: lng,
                },
              },
            })
              .then(() => {
                toast.success('Work address updated');
              })
              .catch((error) => {
                console.error('Error updating user:', error);
                toast.error('Failed to update user');
              });
          }
        });
      }
    } catch (error) {
      console.error('Error setting up autocomplete:', error);
    }
  }, [isLoaded, user.id, updateUser]);

  // We're now using the Places Autocomplete API instead of manual geocoding

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
          placeholder="Start typing to search for an address"
        />
      </div>

      <div>
        <Label htmlFor="workAddress">Work Address</Label>
        <Input
          id="workAddress"
          defaultValue={user.workAddress}
          placeholder="Start typing to search for an address"
        />
      </div>

      {user.homeLatitude && user.homeLongitude && isLoaded && (
        <div id="map" className="w-full h-64" ref={(el) => {
          if (el && window.google && window.google.maps) {
            try {
              const map = new window.google.maps.Map(el, {
                zoom: 15,
                center: { lat: user.homeLatitude, lng: user.homeLongitude },
                mapId: 'DEMO_MAP_ID', // Optional: you can create a map ID in the Google Cloud Console
              })

              // Check if AdvancedMarkerElement is available (it's part of the marker library)
              if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                // Use the new AdvancedMarkerElement
                const position = { lat: user.homeLatitude, lng: user.homeLongitude }
                new window.google.maps.marker.AdvancedMarkerElement({
                  position,
                  map,
                  title: 'Home Location',
                })
              } else {
                // Fallback to the deprecated Marker if AdvancedMarkerElement is not available
                new window.google.maps.Marker({
                  position: { lat: user.homeLatitude, lng: user.homeLongitude },
                  map,
                })
              }
            } catch (error) {
              console.error('Error initializing map:', error)
            }
          }
        }} />
      )}
    </div>
  )
}

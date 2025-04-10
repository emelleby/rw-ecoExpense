import { useEffect, useState } from 'react'

import type { FindUserById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
// Import the Google Maps API script directly
// No need to import anything special for the API key

import DistanceCalculation from 'src/components/DistanceCalculation/DistanceCalculation'
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

export const Failure = ({ error }: CellFailureProps) => (
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

  // We'll use regular input elements with the Autocomplete API

  // Initialize the autocomplete components
  useEffect(() => {
    if (
      !isLoaded ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places
    )
      return

    try {
      // Initialize autocomplete for home address
      const homeInput = document.getElementById(
        'homeAddress'
      ) as HTMLInputElement
      if (homeInput) {
        const homeAutocomplete = new window.google.maps.places.Autocomplete(
          homeInput,
          {
            types: ['address'],
          }
        )

        // Add listener for place selection
        homeAutocomplete.addListener('place_changed', () => {
          const place = homeAutocomplete.getPlace()
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            const address = place.formatted_address || homeInput.value

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
                toast.success('Home address updated')
              })
              .catch((error) => {
                console.error('Error updating user:', error)
                toast.error('Failed to update user')
              })
          }
        })
      }

      // Initialize autocomplete for work address
      const workInput = document.getElementById(
        'workAddress'
      ) as HTMLInputElement
      if (workInput) {
        const workAutocomplete = new window.google.maps.places.Autocomplete(
          workInput,
          {
            types: ['address'],
          }
        )

        // Add listener for place selection
        workAutocomplete.addListener('place_changed', () => {
          const place = workAutocomplete.getPlace()
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            const address = place.formatted_address || workInput.value

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
                toast.success('Work address updated')
              })
              .catch((error) => {
                console.error('Error updating user:', error)
                toast.error('Failed to update user')
              })
          }
        })
      }
    } catch (error) {
      console.error('Error setting up autocomplete:', error)
    }
  }, [isLoaded, user.id, updateUser])

  // Note: We're using the legacy Autocomplete API for now, as the PlaceAutocompleteElement
  // requires additional setup. We'll update to the new API in a future release.

  // We're now using the Places Autocomplete API instead of manual geocoding

  if (mapError) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-red-300 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Maps API Error</h3>
          <p className="mt-2 text-sm text-red-700">{mapError}</p>
          <p className="mt-2 text-sm text-red-700">
            You can still edit your addresses, but geocoding and map display are
            unavailable.
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
                }).catch((error) => {
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
                }).catch((error) => {
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
      <h2 className="text-xl font-semibold">My profile</h2>
      <div className="space-y-2">
        <Label htmlFor="homeAddress" className="rw-label">
          Home Address
        </Label>
        <Input
          id="homeAddress"
          defaultValue={user.homeAddress}
          placeholder="Start typing to search for an address"
          className="rw-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="workAddress" className="rw-label">
          Work Address
        </Label>
        <Input
          id="workAddress"
          defaultValue={user.workAddress}
          placeholder="Start typing to search for an address"
          className="rw-input"
        />
      </div>

      {isLoaded &&
        ((user.homeLatitude && user.homeLongitude) ||
          (user.workLatitude && user.workLongitude)) && (
          <div className="space-y-4">
            <div
              id="map"
              className="h-64 w-full"
              ref={(el) => {
                if (el && window.google && window.google.maps) {
                  try {
                    // Determine map center and bounds
                    let mapCenter: { lat: number; lng: number } | null = null
                    const bounds = new window.google.maps.LatLngBounds()
                    const hasHome = user.homeLatitude && user.homeLongitude
                    const hasWork = user.workLatitude && user.workLongitude

                    if (hasHome) {
                      mapCenter = {
                        lat: user.homeLatitude,
                        lng: user.homeLongitude,
                      }
                      bounds.extend(mapCenter)
                    }

                    if (hasWork) {
                      const workLocation = {
                        lat: user.workLatitude,
                        lng: user.workLongitude,
                      }
                      if (!hasHome) mapCenter = workLocation
                      bounds.extend(workLocation)
                    }

                    // Create the map with default styling
                    const map = new window.google.maps.Map(el, {
                      zoom: 12,
                      center: mapCenter,
                      mapId: 'DEMO_MAP_ID',
                    })

                    // Add markers for home and work locations
                    if (hasHome) {
                      const homePosition = {
                        lat: user.homeLatitude,
                        lng: user.homeLongitude,
                      }

                      // Check if AdvancedMarkerElement is available
                      if (
                        window.google.maps.marker &&
                        window.google.maps.marker.AdvancedMarkerElement
                      ) {
                        // Create a home icon element
                        const homePin = document.createElement('div')
                        homePin.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
                        homePin.style.color = '#2563eb' // Blue color

                        new window.google.maps.marker.AdvancedMarkerElement({
                          position: homePosition,
                          map,
                          title: 'Home Location',
                          content: homePin,
                        })
                      } else {
                        // Fallback to the deprecated Marker
                        const homeMarker = new window.google.maps.Marker({
                          position: homePosition,
                          map,
                          title: 'Home Location',
                          icon: {
                            path: window.google.maps.SymbolPath.HOME,
                            fillColor: '#2563eb',
                            fillOpacity: 1,
                            strokeWeight: 1,
                            scale: 10,
                          },
                        })
                        // Store marker reference if needed for cleanup
                        return () => homeMarker.setMap(null)
                      }
                    }

                    if (hasWork) {
                      const workPosition = {
                        lat: user.workLatitude,
                        lng: user.workLongitude,
                      }

                      // Check if AdvancedMarkerElement is available
                      if (
                        window.google.maps.marker &&
                        window.google.maps.marker.AdvancedMarkerElement
                      ) {
                        // Create a work icon element
                        const workPin = document.createElement('div')
                        workPin.innerHTML =
                          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
                        workPin.style.color = '#dc2626' // Red color

                        new window.google.maps.marker.AdvancedMarkerElement({
                          position: workPosition,
                          map,
                          title: 'Work Location',
                        })
                      } else {
                        // Fallback to the deprecated Marker
                        const workMarker = new window.google.maps.Marker({
                          position: workPosition,
                          map,
                          title: 'Work Location',
                          icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: '#dc2626',
                            fillOpacity: 1,
                            strokeWeight: 1,
                            scale: 10,
                          },
                        })
                        // Store marker reference if needed for cleanup
                        return () => workMarker.setMap(null)
                      }
                    }

                    // If both home and work locations exist, draw a line between them and calculate distance
                    if (hasHome && hasWork) {
                      // Draw a line between home and work
                      const homePosition = {
                        lat: user.homeLatitude,
                        lng: user.homeLongitude,
                      }
                      const workPosition = {
                        lat: user.workLatitude,
                        lng: user.workLongitude,
                      }

                      new window.google.maps.Polyline({
                        path: [homePosition, workPosition],
                        geodesic: true,
                        strokeColor: '#4b5563',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        map: map,
                      })

                      // Fit the map to show both markers
                      map.fitBounds(bounds)
                    }
                  } catch (error) {
                    console.error('Error initializing map:', error)
                  }
                }
              }}
            />

            {/* Distance calculation */}
            {user.homeLatitude &&
              user.homeLongitude &&
              user.workLatitude &&
              user.workLongitude && (
                <div className="rw-segment p-4">
                  <h3 className="rw-heading mb-2">Distance Information</h3>
                  <DistanceCalculation
                    homeLocation={{
                      lat: user.homeLatitude,
                      lng: user.homeLongitude,
                    }}
                    workLocation={{
                      lat: user.workLatitude,
                      lng: user.workLongitude,
                    }}
                    isLoaded={isLoaded}
                  />
                </div>
              )}
          </div>
        )}
    </div>
  )
}

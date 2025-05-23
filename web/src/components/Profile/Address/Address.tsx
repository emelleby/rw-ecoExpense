import { useEffect, useRef } from 'react'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import DistanceCalculation from 'src/components/Profile/Address/DistanceCalculation/DistanceCalculation'
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

interface AddressProps {
  user: {
    id: number
    homeAddress?: string | null
    workAddress?: string | null
    homeLatitude?: number | null
    homeLongitude?: number | null
    workLatitude?: number | null
    workLongitude?: number | null
  }
  isLoaded: boolean
  mapError: string | null
}

const Address = ({ user, isLoaded, mapError }: AddressProps) => {
  const [updateUser] = useMutation(UPDATE_USER_PROFILE)
  const mapRef = useRef<HTMLDivElement>(null)

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

  // Initialize the map when component mounts or when locations change
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapError) return

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

      // If no locations are set, don't render the map
      if (!mapCenter) return

      // Create the map with default styling
      const map = new window.google.maps.Map(mapRef.current, {
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

          // Create and store the marker
          const _homeMarker =
            new window.google.maps.marker.AdvancedMarkerElement({
              position: homePosition,
              map,
              title: 'Home Location',
              content: homePin,
            })
          // We're not returning a cleanup function here, but we could if needed
        } else {
          // Fallback to the deprecated Marker
          const _homeMarker = new window.google.maps.Marker({
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
          // We're not returning a cleanup function here, but we could if needed
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

          const _workMarker =
            new window.google.maps.marker.AdvancedMarkerElement({
              position: workPosition,
              map,
              title: 'Work Location',
              content: workPin,
            })
        } else {
          // Fallback to the deprecated Marker
          const _workMarker = new window.google.maps.Marker({
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

        const _polyline = new window.google.maps.Polyline({
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
  }, [isLoaded, user, mapError])

  if (mapError) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-300 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Maps API Error</h3>
          <p className="mt-2 text-sm text-red-700">{mapError}</p>
          <p className="mt-2 text-sm text-red-700">
            You can still edit your addresses, but geocoding and map display are
            unavailable.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="homeAddress">Home Address</Label>
          <Input
            id="homeAddress"
            defaultValue={user.homeAddress || ''}
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
        <div className="space-y-2">
          <Label htmlFor="workAddress">Work Address</Label>
          <Input
            id="workAddress"
            defaultValue={user.workAddress || ''}
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="homeAddress">Home Address</Label>
        <Input
          id="homeAddress"
          defaultValue={user.homeAddress || ''}
          placeholder="Start typing to search for an address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="workAddress">Work Address</Label>
        <Input
          id="workAddress"
          defaultValue={user.workAddress || ''}
          placeholder="Start typing to search for an address"
        />
      </div>

      {isLoaded &&
        ((user.homeLatitude && user.homeLongitude) ||
          (user.workLatitude && user.workLongitude)) && (
          <div className="space-y-4 pt-2">
            <div
              id="map"
              className="h-64 w-full overflow-hidden rounded-md border"
              ref={mapRef}
            />

            {/* Distance calculation */}
            {user.homeLatitude &&
              user.homeLongitude &&
              user.workLatitude &&
              user.workLongitude && (
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Distance Information</h3>
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

export default Address

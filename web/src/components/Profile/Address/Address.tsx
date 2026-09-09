import { useEffect, useRef, useCallback } from 'react'

import { PlacePicker } from '@googlemaps/extended-component-library/react'

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

  // --- Event Handlers for PlacePicker ---
  const handlePlaceChange = useCallback(
    async (
      fieldName: 'homeAddress' | 'workAddress',
      // Use the standard DOM CustomEvent type
      event: CustomEvent
    ) => {
      // The selected place object is in event.target.value for this component
      // Cast event.target to the expected element type (or use any if type is unknown)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const place = (event.target as any)?.value
      console.log(`${fieldName} selected:`, place)

      if (!place || typeof place.fetchFields !== 'function') {
        console.warn('PlacePicker did not return a valid place object.')
        // Optionally clear the field if selection is invalid/cleared by user?
        // Depending on desired UX, might call updateUser with null values here.
        return
      }

      try {
        // Fetch necessary fields
        await place.fetchFields({ fields: ['geometry', 'formattedAddress'] })

        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          const address = place.formattedAddress || '' // Use formattedAddress

          console.log(`Updating ${fieldName} in DB:`, { address, lat, lng })

          const inputData = {
            [fieldName]: address,
            // Construct field names dynamically based on type (home/work)
            [`${fieldName.replace('Address', '')}Latitude`]: lat,
            [`${fieldName.replace('Address', '')}Longitude`]: lng,
          }

          // Update user profile via mutation
          updateUser({
            variables: {
              id: user.id,
              input: inputData,
            },
          })
            .then(() => {
              toast.success(
                `${fieldName === 'homeAddress' ? 'Home' : 'Work'} address updated.`
              )
            })
            .catch((error) => {
              console.error(`Error updating ${fieldName}:`, error)
              toast.error(
                `Failed to update ${fieldName === 'homeAddress' ? 'Home' : 'Work'} address.`
              )
            })
        } else {
          console.warn('Selected place is missing geometry:', place)
          toast.error('Could not get location data for the selected address.')
        }
      } catch (error) {
        console.error('Error fetching place details or updating user:', error)
        toast.error('An error occurred while updating the address.')
      }
    },
    [updateUser, user.id]
  ) // Dependencies for the callback

  // Define separate callbacks for home and work to pass the field name
  // Use the standard DOM CustomEvent type
  const handleHomeAddressChange = (event: CustomEvent) =>
    handlePlaceChange('homeAddress', event)
  const handleWorkAddressChange = (event: CustomEvent) =>
    handlePlaceChange('workAddress', event)

  // --- Map Initialization Effect ---
  useEffect(() => {
    // Check if Google Maps API is loaded, the map container ref exists, and there's no API error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isLoaded || !mapRef.current || mapError || !(window as any).google)
      return

    try {
      // Determine map center and bounds based on available home/work locations
      let mapCenter: { lat: number; lng: number } | null = null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bounds = new (window as any).google.maps.LatLngBounds()
      const hasHome = user.homeLatitude && user.homeLongitude
      const hasWork = user.workLatitude && user.workLongitude

      if (hasHome) {
        mapCenter = {
          lat: user.homeLatitude!,
          lng: user.homeLongitude!,
        }
        bounds.extend(mapCenter)
      }

      if (hasWork) {
        const workLocation = {
          lat: user.workLatitude!,
          lng: user.workLongitude!,
        }
        if (!hasHome) mapCenter = workLocation // Center on work if home isn't set
        bounds.extend(workLocation)
      }

      // If neither home nor work location is set, don't attempt to render the map
      if (!mapCenter) return

      // Create the Google Map instance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 12,
        center: mapCenter,
        mapId: 'DEMO_MAP_ID', // Use your actual Map ID in production
        disableDefaultUI: true, // Optional: Hide default controls if desired
        zoomControl: true,
      })

      // --- Add Markers ---
      // Add marker for home location if available
      if (hasHome) {
        const homePosition = {
          lat: user.homeLatitude!,
          lng: user.homeLongitude!,
        }

        // Use the newer AdvancedMarkerElement if available
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).google.maps.marker &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).google.maps.marker.AdvancedMarkerElement
        ) {
          const homePin = document.createElement('div')
          homePin.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
          homePin.style.color = '#2563eb' // Blue color for home

          // Assign to variable to satisfy linter
          const _homeMarker =
            new // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).google.maps.marker.AdvancedMarkerElement({
              position: homePosition,
              map,
              title: 'Home Location',
              content: homePin,
            })
        } else {
          // Fallback to the older Marker class
          // Assign to variable to satisfy linter
          const _homeMarkerFallback =
            new // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).google.maps.Marker({
              position: homePosition,
              map,
              title: 'Home Location',
              icon: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                path: (window as any).google.maps.SymbolPath.HOME,
                fillColor: '#2563eb',
                fillOpacity: 1,
                strokeWeight: 1,
                scale: 10,
              },
            })
        }
      }

      // Add marker for work location if available
      if (hasWork) {
        const workPosition = {
          lat: user.workLatitude!,
          lng: user.workLongitude!,
        }

        if (
          window.google.maps.marker &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).google.maps.marker.AdvancedMarkerElement
        ) {
          const workPin = document.createElement('div')
          workPin.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
          workPin.style.color = '#dc2626' // Red color for work

          // Assign to variable to satisfy linter
          const _workMarker =
            new // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).google.maps.marker.AdvancedMarkerElement({
              position: workPosition,
              map,
              title: 'Work Location',
              content: workPin,
            })
        } else {
          // Fallback to older Marker
          // Assign to variable to satisfy linter
          const _workMarkerFallback =
            new // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).google.maps.Marker({
              position: workPosition,
              map,
              title: 'Work Location',
              icon: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                path: (window as any).google.maps.SymbolPath.CIRCLE, // Using a simple circle for work
                fillColor: '#dc2626',
                fillOpacity: 1,
                strokeWeight: 1,
                scale: 8, // Slightly smaller than home
              },
            })
        }
      }

      // --- Draw Polyline and Fit Bounds ---
      // If both home and work locations exist, draw a line between them and adjust map view
      if (hasHome && hasWork) {
        const homePosition = {
          lat: user.homeLatitude!,
          lng: user.homeLongitude!,
        }
        const workPosition = {
          lat: user.workLatitude!,
          lng: user.workLongitude!,
        }

        // Draw a connecting line
        // Assign to variable to satisfy linter
        const _polyline =
          new // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).google.maps.Polyline({
            path: [homePosition, workPosition],
            geodesic: true,
            strokeColor: '#4b5563', // Gray color for the line
            strokeOpacity: 0.8,
            strokeWeight: 2,
            map: map,
          })

        // Adjust the map viewport to show both markers
        map.fitBounds(bounds)
      }
    } catch (error) {
      console.error('Error initializing map:', error)
      // Optionally set an error state here to inform the user
    }
  }, [isLoaded, user, mapError]) // Rerun effect if loading state, user data, or error status changes

  // --- Fallback Rendering on Map Error ---
  // If there was an error loading the Google Maps API
  if (mapError) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-300 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Maps API Error</h3>
          <p className="mt-2 text-sm text-red-700">{mapError}</p>
          <p className="mt-2 text-sm text-red-700">
            Address search and map display are unavailable. You can still edit
            addresses manually.
          </p>
        </div>
        {/* Fallback to simple text inputs if Maps API fails */}
        <div className="space-y-2">
          <Label htmlFor="homeAddressManual">Home Address</Label>
          <Input
            id="homeAddressManual" // Use different ID to avoid conflict
            defaultValue={user.homeAddress || ''}
            placeholder="Enter home address manually"
            // Debounce this onChange or use onBlur in a real app for performance
            onChange={(e) => {
              // Simple update without geocoding when maps fail
              updateUser({
                variables: {
                  id: user.id,
                  input: { homeAddress: e.target.value },
                },
              }).catch((error) => {
                console.error('Error updating address (manual):', error)
                toast.error('Failed to update address')
              })
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workAddressManual">Work Address</Label>
          <Input
            id="workAddressManual" // Use different ID
            defaultValue={user.workAddress || ''}
            placeholder="Enter work address manually"
            onChange={(e) => {
              // Simple update without geocoding
              updateUser({
                variables: {
                  id: user.id,
                  input: { workAddress: e.target.value },
                },
              }).catch((error) => {
                console.error('Error updating address (manual):', error)
                toast.error('Failed to update address')
              })
            }}
          />
        </div>
      </div>
    )
  }

  // --- Loading State ---
  // Show a loading indicator while the Google Maps API is loading
  if (!isLoaded) return <div>Loading maps and address search...</div>

  // --- Main Rendering with PlacePicker and Map ---
  return (
    <div className="space-y-6">
      {/* Home Address PlacePicker */}
      <div className="space-y-2">
        <Label>Home Address</Label>
        {/*
          Use the PlacePicker component.
          - `placeholder` shows the current address or default text.
          - `type`: restrict search results (e.g., to addresses).
          - `onPlaceChange`: event triggered when a place is selected.
          - Styling might need adjustment via CSS custom properties if default isn't perfect.
        */}
        <PlacePicker
          placeholder={user.homeAddress || 'Search for your home address...'}
          type="address"
          // The event type needs assertion for React wrappers of web components
          onPlaceChange={handleHomeAddressChange as (event: Event) => void}
          className="w-full" // Apply width, other styles are handled internally or via CSS vars
        />
      </div>

      {/* Work Address PlacePicker */}
      <div className="space-y-2">
        <Label>Work Address</Label>
        <PlacePicker
          placeholder={user.workAddress || 'Search for your work address...'}
          type="address"
          onPlaceChange={handleWorkAddressChange as (event: Event) => void}
          className="w-full"
        />
      </div>

      {/* Map and Distance Section (conditionally rendered) */}
      {/* Only show map/distance if API loaded AND at least one location is set */}
      {isLoaded &&
        (user.homeLatitude || user.workLatitude) && ( // Simplified condition
          <div className="space-y-4 pt-2">
            {/* Map Container */}
            <div
              id="map"
              className="h-64 w-full overflow-hidden rounded-md border"
              ref={mapRef}
              aria-label="Map showing home and work locations"
            />

            {/* Distance Calculation Component */}
            {/* Render only if both locations are available */}
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
                    isLoaded={isLoaded} // Pass loading state
                  />
                </div>
              )}
          </div>
        )}
    </div>
  )
}

export default Address

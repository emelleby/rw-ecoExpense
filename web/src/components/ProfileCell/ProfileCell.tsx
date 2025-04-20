import { useEffect, useState } from 'react'

import type { FindUserById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Address from 'src/components/Profile/Address/Address'

import Customers from '@/components/Profile/Customers/Customers'

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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My profile</h2>
      <Address user={user} isLoaded={isLoaded} mapError={mapError} />
      <Customers />
    </div>
  )
}
